import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCreditPrice } from "@/utils/currency";

interface ProjectCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  registry: string;
  pricePerTon: number;
  availableCredits: number;
  image: string;
  verified: boolean;
}

const ProjectCard = ({
  id,
  name,
  type,
  location,
  registry,
  pricePerTon,
  availableCredits,
  image,
  verified,
}: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {verified && (
          <Badge className="absolute right-3 top-3 bg-success text-success-foreground">
            <Shield className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {registry}
          </Badge>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
          {name}
        </h3>

        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Price per ton</p>
            <p className="text-xl font-bold text-foreground">{formatCreditPrice(pricePerTon)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="font-semibold text-foreground">{availableCredits.toLocaleString()}</p>
          </div>
        </div>

        <Button variant="default" className="w-full" asChild>
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
