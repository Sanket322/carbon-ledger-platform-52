import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";
import projectSolar from "@/assets/project-solar.jpg";

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const project = {
    id,
    name: "India Solar Power Generation Initiative",
    type: "Renewable Energy",
    location: "Rajasthan, India",
    registry: "Gold Standard",
    registryId: "GS-12345",
    pricePerTon: 8.75,
    availableCredits: 78500,
    totalCredits: 100000,
    vintage: "2023",
    verificationDate: "March 2024",
    image: projectSolar,
    verified: true,
    description:
      "A large-scale solar power generation project in Rajasthan, India, providing clean renewable energy to the national grid. This project contributes to India's renewable energy targets while reducing reliance on fossil fuels and creating local employment opportunities.",
    sdgs: ["Clean Energy", "Climate Action", "Decent Work"],
    co2Reduction: "125,000 tons/year",
    methodology: "ACM0002 Grid-connected electricity generation from renewable sources",
    documents: [
      { name: "Project Design Document", type: "PDF", size: "2.4 MB" },
      { name: "Verification Report", type: "PDF", size: "1.8 MB" },
      { name: "Monitoring Report 2024", type: "PDF", size: "3.2 MB" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <img
                src={project.image}
                alt={project.name}
                className="h-96 w-full object-cover"
              />
              {project.verified && (
                <Badge className="absolute right-4 top-4 bg-success text-success-foreground">
                  <Shield className="mr-1 h-4 w-4" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Project Header */}
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="outline">{project.type}</Badge>
                <Badge variant="secondary">{project.registry}</Badge>
                <Badge variant="outline">Vintage {project.vintage}</Badge>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                {project.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Verified {project.verificationDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{project.co2Reduction}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-6 border-border p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Project Description
              </h2>
              <p className="text-muted-foreground">{project.description}</p>
            </Card>

            {/* SDGs */}
            <Card className="mb-6 border-border p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                UN Sustainable Development Goals
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.sdgs.map((sdg) => (
                  <Badge key={sdg} variant="outline" className="px-4 py-2">
                    {sdg}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Documents */}
            <Card className="border-border p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Verification Documents
              </h2>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-border p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                Purchase Credits
              </h2>

              <div className="mb-6 space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Price per ton CO₂</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${project.pricePerTon}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Credits</span>
                    <span className="font-semibold text-foreground">
                      {project.availableCredits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Issued</span>
                    <span className="font-semibold text-foreground">
                      {project.totalCredits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Registry ID</span>
                    <span className="font-semibold text-foreground">
                      {project.registryId}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="hero" size="lg" className="mb-3 w-full">
                Buy Credits
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Add to Watchlist
              </Button>

              <p className="mt-4 text-xs text-muted-foreground">
                * KYC verification required to purchase credits
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
