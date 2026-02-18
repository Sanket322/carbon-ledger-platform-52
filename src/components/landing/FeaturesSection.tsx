import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, BarChart3, CheckCircle2, Target } from "lucide-react";

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

const FeaturesSection = () => (
  <section className="bg-muted/30 py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center animate-fade-in">
        <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1.5">Why Choose Us</Badge>
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
            className="group border-border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
