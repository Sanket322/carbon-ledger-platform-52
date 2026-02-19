import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Block private/internal IP ranges and cloud metadata endpoints to prevent SSRF
function isValidApiEndpoint(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);

    // Only allow HTTPS
    if (parsed.protocol !== "https:") return false;

    const hostname = parsed.hostname;

    // Block localhost and loopback
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") return false;

    // Block cloud metadata endpoints
    if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") return false;

    // Block private IPv4 ranges
    const privateRanges = [
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    ];
    if (privateRanges.some((r) => r.test(hostname))) return false;

    // Must have a valid TLD (basic check)
    if (!hostname.includes(".")) return false;

    return true;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const { project_id, api_endpoint, api_key } = await req.json();

    if (!project_id || !api_endpoint) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the API endpoint to prevent SSRF
    if (!isValidApiEndpoint(api_endpoint)) {
      return new Response(
        JSON.stringify({ error: "Invalid or disallowed API endpoint. Only HTTPS external URLs are permitted." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the authenticated user owns this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, owner_id")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (project.owner_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: you do not own this project" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch data from external API with timeout
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (api_key) {
      fetchHeaders["Authorization"] = `Bearer ${api_key}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let apiResponse: Response;
    try {
      apiResponse = await fetch(api_endpoint, {
        headers: fetchHeaders,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!apiResponse.ok) {
      throw new Error(`External API returned status ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();

    // Process and insert energy readings
    const readings = Array.isArray(apiData) ? apiData : [apiData];

    const insertData = readings.map((reading: any) => ({
      project_id,
      reading_date: reading.reading_date || reading.timestamp || new Date().toISOString(),
      energy_generated_kwh: parseFloat(reading.energy_generated_kwh || reading.energy || 0),
      carbon_credits_generated: parseFloat(reading.carbon_credits_generated || reading.credits || 0),
      reading_type: "automatic",
      notes: reading.notes || "Imported via API sync",
    }));

    const { data, error } = await supabase
      .from("energy_readings")
      .insert(insertData)
      .select();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, count: data.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
