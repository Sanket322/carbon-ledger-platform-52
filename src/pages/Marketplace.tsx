import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import projectSolar from "@/assets/project-solar.jpg";
import projectForest from "@/assets/project-forest.jpg";
import projectWind from "@/assets/project-wind.jpg";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const projects = [
    {
      id: "1",
      name: "Amazon Rainforest Conservation REDD+ Project",
      type: "Forestry & Land Use",
      location: "Brazil",
      registry: "Verra VCS",
      pricePerTon: 12.5,
      availableCredits: 45000,
      image: projectForest,
      verified: true,
    },
    {
      id: "2",
      name: "India Solar Power Generation Initiative",
      type: "Renewable Energy",
      location: "Rajasthan, India",
      registry: "Gold Standard",
      pricePerTon: 8.75,
      availableCredits: 78500,
      image: projectSolar,
      verified: true,
    },
    {
      id: "3",
      name: "European Wind Farm Development",
      type: "Renewable Energy",
      location: "Scotland, UK",
      registry: "UCR",
      pricePerTon: 10.0,
      availableCredits: 52000,
      image: projectWind,
      verified: true,
    },
    {
      id: "4",
      name: "Southeast Asian Mangrove Restoration",
      type: "Forestry & Land Use",
      location: "Indonesia",
      registry: "Verra VCS",
      pricePerTon: 15.25,
      availableCredits: 28000,
      image: projectForest,
      verified: true,
    },
    {
      id: "5",
      name: "California Solar Energy Project",
      type: "Renewable Energy",
      location: "California, USA",
      registry: "Gold Standard",
      pricePerTon: 9.5,
      availableCredits: 65000,
      image: projectSolar,
      verified: true,
    },
    {
      id: "6",
      name: "Nordic Offshore Wind Development",
      type: "Renewable Energy",
      location: "Norway",
      registry: "UCR",
      pricePerTon: 11.25,
      availableCredits: 42000,
      image: projectWind,
      verified: true,
    },
  ];

  const projectTypes = ["All Projects", "Renewable Energy", "Forestry & Land Use", "Energy Efficiency", "Waste Management"];
  const registries = ["All Registries", "UCR", "Verra VCS", "Gold Standard"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Carbon Credit Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Browse verified carbon offset projects from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, location, or registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Project Type</p>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={type === "All Projects" ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Registry</p>
              <div className="flex flex-wrap gap-2">
                {registries.map((registry) => (
                  <Badge
                    key={registry}
                    variant={registry === "All Registries" ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {registry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{projects.length}</span> verified projects
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
