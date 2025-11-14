import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import {
  TrendingUp,
  Shield,
  Leaf,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Globe,
  Target,
  Users,
  Lightbulb,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import howItWorks from "@/assets/how-it-works.jpg";
import CarbonCalculator from "@/components/CarbonCalculator";

const Index = () => {
  const stats = [
    { icon: <Leaf className="h-6 w-6 text-primary" />, value: "1.2M", label: "Tons CO₂ Offset", trend: "+12% this month" },
    { icon: <BarChart3 className="h-6 w-6 text-primary" />, value: "5,847", label: "Credits Traded", trend: "+8% this week" },
    { icon: <Shield className="h-6 w-6 text-primary" />, value: "234", label: "Verified Projects" },
    { icon: <Globe className="h-6 w-6 text-primary" />, value: "48", label: "Countries" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Carbon Credits",
      description: "All projects verified through internationally recognized registries including UCR, Verra, and Gold Standard.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Trading",
      description: "Advanced marketplace with live pricing, order matching, and instant settlement for seamless transactions.",
    },
    {
      icon: CheckCircle2,
      title: "Digital Certificates",
      description: "Automated certificate generation with QR codes linking directly to registry verification documents.",
    },
    {
      icon: Target,
      title: "Impact Tracking",
      description: "Comprehensive dashboards showing your environmental impact and portfolio performance in real-time.",
    },
  ];

  const projectTypes = [
    { name: "Renewable Energy", count: 87, color: "bg-accent" },
    { name: "Forestry & Land Use", count: 64, color: "bg-success" },
    { name: "Energy Efficiency", count: 45, color: "bg-primary" },
    { name: "Waste Management", count: 38, color: "bg-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary-light/20 px-4 py-1 text-primary-foreground backdrop-blur-sm">
              Trusted Carbon Credit Marketplace
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              Trade Verified Carbon Credits with Confidence
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Join the leading platform connecting project owners, traders, and buyers in the global carbon market. 
              Transparent, secure, and backed by internationally recognized registries.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/marketplace">
                  Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline-primary" size="xl" asChild className="bg-background/10 backdrop-blur-sm">
                <Link to="/signup">Register Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Why Choose Offst.AI?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A comprehensive platform designed for transparency, efficiency, and trust in carbon credit trading.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Diverse Project Portfolio
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explore verified carbon offset projects across multiple categories and regions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectTypes.map((type) => (
              <Card
                key={type.name}
                className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className={`mb-4 h-2 w-16 rounded-full ${type.color}`} />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.count} Active Projects</p>
                </div>
                <div className="bg-muted/50 px-6 py-4">
                  <Link
                    to="/marketplace"
                    className="flex items-center text-sm font-medium text-primary group-hover:gap-2"
                  >
                    Explore Projects
                    <ArrowRight className="ml-1 h-4 w-4 transition-all" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                How Carbon Credits Work
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Project Registration</h3>
                    <p className="text-sm text-muted-foreground">
                      Project owners register their carbon reduction initiatives with international registries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Verification & Issuance</h3>
                    <p className="text-sm text-muted-foreground">
                      Third-party verifiers audit projects and carbon credits are issued based on verified emission reductions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Trade & Retire</h3>
                    <p className="text-sm text-muted-foreground">
                      Credits are traded on our marketplace and retired to offset carbon emissions, with digital certificates issued.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="lg" className="mt-8" asChild>
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={howItWorks}
                alt="How carbon credits work"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Calculator Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">
              Carbon Footprint Calculator
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Calculate Your Carbon Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Understand your carbon footprint and discover how many credits you need to become carbon neutral
            </p>
          </div>
          
          <CarbonCalculator />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              About Offst.AI
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Building a Sustainable Future Through Carbon Markets
            </h2>
            <p className="text-lg text-muted-foreground">
              Offst.AI is the leading platform for verified carbon credit trading, connecting project owners, 
              traders, and buyers in a transparent, secure marketplace that drives real environmental impact.
            </p>
          </div>

          {/* Mission */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground">
              To accelerate global climate action by creating the most trusted, transparent, and efficient 
              marketplace for carbon credits. We empower organizations and individuals to measurably reduce 
              their carbon footprint while supporting verified environmental projects worldwide.
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Our Core Values
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground mb-12">
              The principles that guide everything we do at Offst.AI
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-foreground">
                Transparency
              </h4>
              <p className="text-sm text-muted-foreground">
                Every carbon credit on our platform is verified and traceable to internationally recognized registries.
              </p>
            </Card>

            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-foreground">
                Trust
              </h4>
              <p className="text-sm text-muted-foreground">
                We ensure all projects meet rigorous verification standards and maintain complete documentation.
              </p>
            </Card>

            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-foreground">
                Global Impact
              </h4>
              <p className="text-sm text-muted-foreground">
                Connecting projects from 48+ countries with buyers worldwide to maximize environmental impact.
              </p>
            </Card>

            <Card className="border-border bg-card p-6 text-center">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-foreground">
                Innovation
              </h4>
              <p className="text-sm text-muted-foreground">
                Leveraging cutting-edge technology to make carbon credit trading efficient, secure, and accessible.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-border bg-gradient-hero">
            <div className="px-6 py-12 text-center md:px-12">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Make an Impact?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
                Join thousands of organizations and individuals trading verified carbon credits on Offst.AI.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button variant="hero" size="xl" asChild className="bg-card text-foreground hover:bg-card/90">
                  <Link to="/signup">Get Started Today</Link>
                </Button>
                <Button variant="outline-primary" size="xl" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/marketplace">Browse Projects</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
