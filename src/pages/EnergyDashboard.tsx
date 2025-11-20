import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
        .order("reading_date", { ascending: false })
        .limit(50);

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
        <Tabs defaultValue="readings" className="w-full">
          <TabsList>
            <TabsTrigger value="readings">Energy Readings</TabsTrigger>
            <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default EnergyDashboard;
