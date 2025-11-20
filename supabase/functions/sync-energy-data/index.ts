import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project_id, api_endpoint, api_key } = await req.json();

    if (!project_id || !api_endpoint) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch data from external API
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (api_key) {
      headers["Authorization"] = `Bearer ${api_key}`;
    }

    const apiResponse = await fetch(api_endpoint, { headers });
    
    if (!apiResponse.ok) {
      throw new Error(`API returned status ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process and insert energy readings
    const readings = Array.isArray(apiData) ? apiData : [apiData];
    
    const insertData = readings.map((reading: any) => ({
      project_id,
      reading_date: reading.reading_date || reading.timestamp || new Date().toISOString(),
      energy_generated_kwh: reading.energy_generated_kwh || reading.energy || 0,
      carbon_credits_generated: reading.carbon_credits_generated || reading.credits || 0,
      reading_type: "automatic",
      notes: reading.notes || "Imported via API sync"
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
      JSON.stringify({ success: true, count: data.length, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Sync error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
