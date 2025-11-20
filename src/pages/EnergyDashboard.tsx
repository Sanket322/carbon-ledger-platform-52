import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Calendar, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  title: string;
  project_type: string;
}

interface EnergyReading {
  id: string;
  project_id: string;
  reading_date: string;
  energy_generated_kwh: number;
  carbon_credits_generated: number;
  reading_type: string;
  notes: string | null;
}

interface EnergySummary {
  project_id: string;
  project_name: string;
  total_readings: number;
  total_energy_kwh: number;
  total_credits_generated: number;
  last_reading_date: string | null;
  avg_energy_per_reading: number;
}

const EnergyDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [energyReadings, setEnergyReadings] = useState<EnergyReading[]>([]);
  const [summary, setSummary] = useState<EnergySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiConfig, setShowApiConfig] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchEnergyData(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, project_type")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      if (data && data.length > 0) {
        setSelectedProject(data[0].id);
      }
    } catch (error: any) {
      toast.error("Failed to load projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnergyData = async (projectId: string) => {
    try {
      // Fetch energy readings
      const { data: readings, error: readingsError } = await supabase
        .from("energy_readings")
        .select("*")
        .eq("project_id", projectId)
        .order("reading_date", { ascending: true })
        .limit(100);

      if (readingsError) throw readingsError;
      setEnergyReadings(readings || []);

      // Calculate summary
      if (readings && readings.length > 0) {
        const totalEnergy = readings.reduce((sum, r) => sum + Number(r.energy_generated_kwh), 0);
        const totalCredits = readings.reduce((sum, r) => sum + Number(r.carbon_credits_generated), 0);
        const project = projects.find(p => p.id === projectId);

        setSummary({
          project_id: projectId,
          project_name: project?.title || "",
          total_readings: readings.length,
          total_energy_kwh: totalEnergy,
          total_credits_generated: totalCredits,
          last_reading_date: readings[0].reading_date,
          avg_energy_per_reading: totalEnergy / readings.length,
        });
      } else {
        setSummary(null);
      }
    } catch (error: any) {
      toast.error("Failed to load energy data");
      console.error(error);
    }
  };

  const handleApiSync = async () => {
    if (!selectedProject || !apiEndpoint) {
      toast.error("Please select a project and provide an API endpoint");
      return;
    }

    try {
      const response = await fetch(`https://kqaywzwiudxtkxfczflz.supabase.co/functions/v1/sync-energy-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          project_id: selectedProject,
          api_endpoint: apiEndpoint,
          api_key: apiKey
        })
      });

      if (response.ok) {
        toast.success("Energy data synced successfully");
        fetchEnergyData(selectedProject);
        setShowApiConfig(false);
      } else {
        toast.error("Failed to sync energy data");
      }
    } catch (error) {
      console.error("API sync error:", error);
      toast.error("Error syncing data");
    }
  };

  const getChartData = () => {
    if (!energyReadings.length) return [];

    const groupedData: { [key: string]: { energy: number; credits: number; count: number } } = {};

    energyReadings.forEach((reading) => {
      const date = new Date(reading.reading_date);
      let key: string;

      if (timePeriod === "daily") {
        key = date.toISOString().split("T")[0];
      } else if (timePeriod === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = { energy: 0, credits: 0, count: 0 };
      }

      groupedData[key].energy += Number(reading.energy_generated_kwh);
      groupedData[key].credits += Number(reading.carbon_credits_generated);
      groupedData[key].count += 1;
    });

    return Object.entries(groupedData).map(([date, data]) => ({
      date,
      energy: Number(data.energy.toFixed(2)),
      credits: Number(data.credits.toFixed(2))
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Energy Information System</h1>
            <Card className="mx-auto max-w-2xl p-8">
              <p className="mb-6 text-muted-foreground">
                You don't have any projects yet. Register a project to start tracking energy generation.
              </p>
              <Button asChild variant="hero">
                <Link to="/register-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Register Project
                </Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Energy Information System
          </h1>
          <p className="text-muted-foreground">
            Track energy generation and carbon credits by project
          </p>
        </div>

        {/* Project Selector */}
        <Card className="mb-6 p-4">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Select Project
          </label>
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title} ({project.project_type})
              </option>
            ))}
          </select>
        </Card>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Energy</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summary.total_energy_kwh.toLocaleString()} kWh
                  </p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carbon Credits</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summary.total_credits_generated.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg per Reading</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summary.avg_energy_per_reading.toFixed(2)} kWh
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Readings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summary.total_readings}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="charts" className="w-full">
          <TabsList>
            <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
            <TabsTrigger value="readings">Energy Readings</TabsTrigger>
            <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
            <TabsTrigger value="sync">Data Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="charts">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Energy Generation Trends</h2>
                  <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {energyReadings.length > 0 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-foreground">Energy Production (kWh)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="energy"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            name="Energy (kWh)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-foreground">Carbon Credits Generated</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }}
                          />
                          <Legend />
                          <Bar dataKey="credits" fill="hsl(var(--primary))" name="Carbon Credits (tCO₂e)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No data available for charts</p>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="readings">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent Energy Readings</h2>
              </div>
              
              {energyReadings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Energy (kWh)</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Credits Generated</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {energyReadings.map((reading) => (
                        <tr key={reading.id} className="border-b border-border last:border-0">
                          <td className="py-3 text-sm text-foreground">
                            {new Date(reading.reading_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {Number(reading.energy_generated_kwh).toLocaleString()}
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {Number(reading.carbon_credits_generated).toFixed(2)}
                          </td>
                          <td className="py-3 text-sm text-foreground capitalize">
                            {reading.reading_type}
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {reading.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No energy readings yet</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">Carbon Credits Tracking</h2>
              
              {summary ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Summary</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Credits Generated</p>
                        <p className="text-xl font-bold text-foreground">
                          {summary.total_credits_generated.toFixed(2)} tCO₂e
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="text-xl font-bold text-foreground">
                          {summary.last_reading_date 
                            ? new Date(summary.last_reading_date).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Conversion Rate</h3>
                    <p className="text-sm text-muted-foreground">
                      {summary.total_energy_kwh > 0 
                        ? `${(summary.total_credits_generated / summary.total_energy_kwh * 1000).toFixed(4)} tCO₂e per MWh`
                        : "No data available"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No carbon credit data available</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="sync">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">Automated Data Sync</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Configure automated energy data import from IoT devices, smart meters, or monitoring APIs.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                  <Input
                    id="api-endpoint"
                    type="url"
                    placeholder="https://api.your-iot-device.com/readings"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    The API should return JSON with: reading_date, energy_generated_kwh, carbon_credits_generated
                  </p>
                </div>

                <div>
                  <Label htmlFor="api-key">API Key / Token (Optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Your API authentication key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleApiSync} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Sync Data Now
                  </Button>
                  <Button variant="outline" onClick={() => setShowApiConfig(!showApiConfig)}>
                    Webhook Configuration
                  </Button>
                </div>

                {showApiConfig && (
                  <Card className="mt-4 border-primary/20 bg-primary/5 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Webhook Endpoint</h3>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Configure your IoT device to POST data to this endpoint:
                    </p>
                    <code className="block rounded bg-muted p-2 text-xs">
                      https://kqaywzwiudxtkxfczflz.supabase.co/functions/v1/energy-webhook
                    </code>
                    <p className="mt-3 text-xs text-muted-foreground">
                      <strong>Headers:</strong> Authorization: Bearer [YOUR_API_KEY]
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <strong>Body:</strong> {`{ "project_id": "uuid", "reading_date": "ISO date", "energy_generated_kwh": number, "carbon_credits_generated": number }`}
                    </p>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default EnergyDashboard;
