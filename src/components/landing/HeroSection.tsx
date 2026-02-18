import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Lightbulb, Users, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[92vh] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Trust Badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            {["🏆 UCR Verified", "✓ Verra Approved", "🌟 Gold Standard"].map((badge) => (
              <Badge
                key={badge}
                className="bg-primary-foreground/15 text-primary-foreground backdrop-blur-lg border-primary-foreground/20 px-4 py-2 text-sm font-medium"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Headline */}
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] text-primary-foreground md:text-7xl tracking-tight">
              India's Leading
              <br />
              <span className="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">
                Carbon Credit Marketplace
              </span>
            </h1>

            <p className="mb-10 text-xl text-primary-foreground/90 md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              Buy verified carbon credits in INR. Support renewable energy projects across India.
              Get instant retirement certificates. Make your business carbon neutral today.
            </p>

            {/* Feature pills */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-primary-foreground/85">
              {["Pay in ₹ INR", "Instant Certificates", "100% Verified Projects", "No Hidden Fees"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-10">
              <Button
                size="xl"
                asChild
                className="bg-background text-primary hover:bg-background/90 shadow-2xl font-semibold text-lg px-8 py-6 hover:scale-105 transition-transform"
              >
                <Link to="/marketplace">
                  Browse Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                asChild
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm font-semibold text-lg px-8 py-6"
              >
                <Link to="/signup/project-owner">Register Your Project</Link>
              </Button>
            </div>

            {/* Help links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
              {[
                { to: "/knowledge", icon: Lightbulb, label: "New to carbon credits?" },
                { to: "/demo-login", icon: Users, label: "Try Demo Account" },
                { to: "/how-it-works", icon: Target, label: "How it works" },
              ].map((link, i) => (
                <span key={link.to} className="flex items-center gap-4">
                  {i > 0 && <span className="text-primary-foreground/30">•</span>}
                  <Link to={link.to} className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                </span>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "1.2M+", label: "Tons CO₂ Offset" },
              { value: "5,847", label: "Credits Traded" },
              { value: "234", label: "Active Projects" },
              { value: "48", label: "Countries" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{s.value}</div>
                <div className="text-sm text-primary-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
