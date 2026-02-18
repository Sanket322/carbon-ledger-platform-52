import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Globe } from "lucide-react";

const CTASection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <Card className="relative overflow-hidden border-0 bg-gradient-hero shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 py-16 text-center md:px-12 md:py-20">
          <Badge className="mb-6 bg-primary-foreground/15 text-primary-foreground backdrop-blur-lg border-primary-foreground/20 px-4 py-2">
            Join 1000+ Organizations
          </Badge>
          <h2 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Ready to Make an Impact?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/90 leading-relaxed">
            Join thousands of organizations and individuals offsetting their carbon footprint.
            Start your journey to carbon neutrality today with verified credits in INR.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="xl"
              asChild
              className="bg-background text-primary hover:bg-background/90 shadow-xl font-semibold text-lg px-8 hover:scale-105 transition-transform"
            >
              <Link to="/signup">Get Started Today</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm font-semibold text-lg px-8"
            >
              <Link to="/marketplace">Browse Projects</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/70">
            {[
              { icon: Shield, label: "100% Secure" },
              { icon: CheckCircle2, label: "Verified Projects" },
              { icon: Globe, label: "Global Standards" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </section>
);

export default CTASection;
