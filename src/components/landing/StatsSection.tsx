import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, BarChart3, Shield, Globe } from "lucide-react";

const stats = [
  { icon: <Leaf className="h-6 w-6 text-primary" />, value: "1.2M", label: "Tons CO₂ Offset", trend: "+12% this month" },
  { icon: <BarChart3 className="h-6 w-6 text-primary" />, value: "5,847", label: "Credits Traded", trend: "+8% this week" },
  { icon: <Shield className="h-6 w-6 text-primary" />, value: "234", label: "Verified Projects" },
  { icon: <Globe className="h-6 w-6 text-primary" />, value: "48", label: "Countries" },
];

const StatsSection = () => (
  <section className="container mx-auto px-4 -mt-20 relative z-10">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="bg-card border-border shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">{stat.icon}</div>
              {stat.trend && (
                <Badge variant="outline" className="text-xs text-success border-success/30">
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
);

export default StatsSection;
