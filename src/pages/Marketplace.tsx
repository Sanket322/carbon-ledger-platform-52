import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCreditPrice } from "@/utils/currency";
import projectSolar from "@/assets/project-solar.jpg";
import projectForest from "@/assets/project-forest.jpg";
import projectWind from "@/assets/project-wind.jpg";

interface Project {
  id: string;
  title: string;
  project_type: string;
  location_country: string;
  registry: string;
  price_per_ton: number;
  available_credits: number;
  status: string;
  description: string;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRegistry, setSelectedRegistry] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("status", ["active", "verified"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getProjectImage = (type: string) => {
    if (type.includes("Forest") || type.includes("Reforestation")) return projectForest;
    if (type.includes("Wind")) return projectWind;
    return projectSolar;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || project.project_type === selectedType;
    const matchesRegistry = !selectedRegistry || project.registry === selectedRegistry;

    return matchesSearch && matchesType && matchesRegistry;
  });

  const projectTypes = Array.from(new Set(projects.map((p) => p.project_type)));
  const registries = Array.from(new Set(projects.map((p) => p.registry)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Carbon Credit Marketplace
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Browse verified carbon offset projects from India and worldwide. All credits are verified by 
              international registries (UCR, Verra, Gold Standard).
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>💡 <strong>How it works:</strong></span>
              <span>1 credit = 1 ton CO₂ offset</span>
              <span>•</span>
              <span>Pay in INR</span>
              <span>•</span>
              <Link to="/how-it-works" className="text-primary hover:underline">Learn more</Link>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by project name, location (e.g., India, Maharashtra)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Use filters below to find projects by type (Solar, Wind) or registry (UCR, Verra)
            </p>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              
              {/* Type Filters */}
              <Badge
                variant={selectedType === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedType(null)}
              >
                All Types
              </Badge>
              {projectTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  {type.replace(/_/g, " ")}
                </Badge>
              ))}

              {/* Registry Filters */}
              {registries.map((registry) => (
                <Badge
                  key={registry}
                  variant={selectedRegistry === registry ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedRegistry(registry)}
                >
                  {registry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No projects found matching your criteria</p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedType(null);
                setSelectedRegistry(null);
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.title}
                  type={project.project_type.replace(/_/g, " ")}
                  location={project.location_country}
                  registry={`${project.registry}`}
                  pricePerTon={project.price_per_ton}
                  availableCredits={project.available_credits}
                  image={getProjectImage(project.project_type)}
                  verified={project.status === "verified" || project.status === "active"}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
