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

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-5xl">
            {/* Trust Badges */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
              <Badge className="bg-white/20 text-white backdrop-blur-md border-white/30 px-4 py-2 text-sm font-medium">
                🏆 UCR Verified
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-md border-white/30 px-4 py-2 text-sm font-medium">
                ✓ Verra Approved
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-md border-white/30 px-4 py-2 text-sm font-medium">
                🌟 Gold Standard
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl tracking-tight">
                India's Leading
                <br />
                <span className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                  Carbon Credit Marketplace
                </span>
              </h1>
              
              <p className="mb-8 text-xl text-white/95 md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
                Buy verified carbon credits in INR. Support renewable energy projects across India. 
                Get instant retirement certificates. Make your business carbon neutral today.
              </p>

              {/* Key Features */}
              <div className="mb-10 flex flex-wrap items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-200" />
                  <span className="text-sm font-medium">Pay in ₹ INR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-200" />
                  <span className="text-sm font-medium">Instant Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-200" />
                  <span className="text-sm font-medium">100% Verified Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-200" />
                  <span className="text-sm font-medium">No Hidden Fees</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-8">
                <Button 
                  variant="default" 
                  size="xl" 
                  asChild 
                  className="bg-white text-primary hover:bg-white/90 shadow-2xl hover-scale font-semibold text-lg px-8 py-6"
                >
                  <Link to="/marketplace">
                    Browse Projects <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  asChild 
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-lg px-8 py-6"
                >
                  <Link to="/signup/project-owner">
                    Register Your Project
                  </Link>
                </Button>
              </div>

              {/* Help Links */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                <Link to="/knowledge" className="flex items-center gap-2 hover:text-white transition-colors story-link">
                  <Lightbulb className="h-4 w-4" />
                  <span>New to carbon credits?</span>
                </Link>
                <span className="text-white/40">•</span>
                <Link to="/demo-login" className="flex items-center gap-2 hover:text-white transition-colors story-link">
                  <Users className="h-4 w-4" />
                  <span>Try Demo Account</span>
                </Link>
                <span className="text-white/40">•</span>
                <Link to="/how-it-works" className="flex items-center gap-2 hover:text-white transition-colors story-link">
                  <Target className="h-4 w-4" />
                  <span>How it works</span>
                </Link>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">1.2M+</div>
                <div className="text-sm text-white/70">Tons CO₂ Offset</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">5,847</div>
                <div className="text-sm text-white/70">Credits Traded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">234</div>
                <div className="text-sm text-white/70">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">48</div>
                <div className="text-sm text-white/70">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="hsl(var(--background))" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="hover-scale bg-card border-border shadow-lg hover:shadow-xl transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              Why Choose Offst.AI?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              India's most trusted carbon credit platform with verified projects, transparent pricing, and instant certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover-scale border-border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Types - Enhanced */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-fade-in">
            <Badge className="mb-4 bg-success/10 text-success px-4 py-1">
              Project Categories
            </Badge>
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
                className="group relative overflow-hidden border-border bg-card transition-all hover:shadow-2xl hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative p-6">
                  <div className={`mb-4 h-2 w-20 rounded-full ${type.color}`} />
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.count} Active Projects</p>
                </div>
                <div className="relative bg-muted/50 px-6 py-4 border-t">
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

      {/* CTA Section - Enhanced */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-6 py-16 text-center md:px-12 md:py-20">
              <Badge className="mb-6 bg-white/20 text-white backdrop-blur-md border-white/30 px-4 py-2">
                Join 1000+ Organizations
              </Badge>
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Ready to Make an Impact?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-white/95 leading-relaxed">
                Join thousands of organizations and individuals offsetting their carbon footprint. 
                Start your journey to carbon neutrality today with verified credits in INR.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button 
                  variant="default" 
                  size="xl" 
                  asChild 
                  className="bg-white text-primary hover:bg-white/90 shadow-xl hover-scale font-semibold text-lg px-8"
                >
                  <Link to="/signup">Get Started Today</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  asChild 
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-lg px-8"
                >
                  <Link to="/marketplace">Browse Projects</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Verified Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">Global Standards</span>
                </div>
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
