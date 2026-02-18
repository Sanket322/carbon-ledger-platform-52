import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const projectTypes = [
  { name: "Renewable Energy", count: 87, color: "bg-accent" },
  { name: "Forestry & Land Use", count: 64, color: "bg-success" },
  { name: "Energy Efficiency", count: 45, color: "bg-primary" },
  { name: "Waste Management", count: 38, color: "bg-warning" },
];

const ProjectTypesSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center animate-fade-in">
        <Badge className="mb-4 bg-success/10 text-success px-4 py-1.5">Project Categories</Badge>
        <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
          Diverse Project Portfolio
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          From renewable energy to reforestation—explore verified carbon offset projects across India and worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projectTypes.map((type, index) => (
          <Card
            key={type.name}
            className="group relative overflow-hidden border-border bg-card transition-all hover:shadow-2xl hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute inset-0 ${type.color} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
            <div className="relative p-6">
              <div className={`mb-4 h-2 w-20 rounded-full ${type.color}`} />
              <h3 className="mb-2 text-2xl font-semibold text-foreground">{type.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{type.count} Active Projects</p>
            </div>
            <div className="relative bg-muted/50 px-6 py-4 border-t border-border">
              <Link
                to="/marketplace"
                className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all"
              >
                Explore Projects
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectTypesSection;
