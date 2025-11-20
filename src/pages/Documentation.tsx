import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Download, ExternalLink } from "lucide-react";

const Documentation = () => {
  const guides = [
    {
      title: "Getting Started Guide",
      description: "Complete guide to registering projects and understanding the certification process",
      category: "basics",
      link: "#"
    },
    {
      title: "Project Registration Manual",
      description: "Step-by-step documentation for project developers on registration requirements",
      category: "developers",
      link: "#"
    },
    {
      title: "Buying Carbon Credits Guide",
      description: "How to browse, purchase, and retire carbon credits on the marketplace",
      category: "buyers",
      link: "#"
    },
    {
      title: "UCR Registry Standards",
      description: "Universal Carbon Registry methodologies and certification requirements",
      category: "registries",
      link: "#"
    },
    {
      title: "Verra VCS Documentation",
      description: "Verified Carbon Standard procedures and project validation guidelines",
      category: "registries",
      link: "#"
    },
    {
      title: "Gold Standard Requirements",
      description: "Gold Standard for the Global Goals certification framework",
      category: "registries",
      link: "#"
    },
    {
      title: "Energy Data Integration API",
      description: "Technical documentation for IoT device and smart meter integration",
      category: "technical",
      link: "#"
    },
    {
      title: "Trading Engine Guide",
      description: "How to use limit orders, market orders, and read the order book",
      category: "buyers",
      link: "#"
    },
    {
      title: "Monitoring & Reporting",
      description: "Requirements for ongoing project monitoring and MRV (Measurement, Reporting, Verification)",
      category: "developers",
      link: "#"
    },
    {
      title: "Retirement Certificates",
      description: "Understanding carbon credit retirement and certificate generation",
      category: "buyers",
      link: "#"
    }
  ];

  const methodologies = [
    {
      title: "Renewable Energy Projects",
      type: "Solar, Wind, Hydro",
      description: "Methodologies for calculating emission reductions from renewable energy generation"
    },
    {
      title: "Forest Conservation",
      type: "REDD+",
      description: "Reducing Emissions from Deforestation and Forest Degradation methodologies"
    },
    {
      title: "Energy Efficiency",
      type: "Industrial & Residential",
      description: "Measuring carbon savings from efficiency improvements and retrofits"
    },
    {
      title: "Waste Management",
      type: "Landfill Gas, Composting",
      description: "Methodologies for methane capture and waste diversion projects"
    }
  ];

  const filterGuidesByCategory = (category: string) => {
    return guides.filter((guide) => guide.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Documentation Hub</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive guides, methodologies, and technical documentation for carbon credit projects and marketplace
            transactions
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="all">All Docs</TabsTrigger>
            <TabsTrigger value="basics">Getting Started</TabsTrigger>
            <TabsTrigger value="developers">For Developers</TabsTrigger>
            <TabsTrigger value="buyers">For Buyers</TabsTrigger>
            <TabsTrigger value="registries">Registries</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide, index) => (
                <Card key={index} className="p-6 transition-all hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{guide.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{guide.description}</p>
                  <a
                    href={guide.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Read Documentation
                  </a>
                </Card>
              ))}
            </div>
          </TabsContent>

          {["basics", "developers", "buyers", "registries"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2">
                {filterGuidesByCategory(category).map((guide, index) => (
                  <Card key={index} className="p-6 transition-all hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                      <FileText className="h-8 w-8 text-primary" />
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{guide.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{guide.description}</p>
                    <a
                      href={guide.link}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Read Documentation
                    </a>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-foreground">Carbon Credit Methodologies</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {methodologies.map((method, index) => (
              <Card key={index} className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.type}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Card className="bg-primary/5 p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Download className="h-12 w-12 text-primary" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-2 text-xl font-bold text-foreground">Download Complete Documentation</h3>
                <p className="text-muted-foreground">
                  Access our comprehensive documentation package including all guides, methodologies, and technical
                  specifications in PDF format.
                </p>
              </div>
              <button className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Download PDF Pack
              </button>
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-bold text-foreground">Registry Links & Resources</h3>
            <div className="space-y-3">
              <a
                href="https://www.universalcarbonregistry.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Universal Carbon Registry (UCR)
              </a>
              <a
                href="https://verra.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Verra - Verified Carbon Standard (VCS)
              </a>
              <a
                href="https://www.goldstandard.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Gold Standard for the Global Goals
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
