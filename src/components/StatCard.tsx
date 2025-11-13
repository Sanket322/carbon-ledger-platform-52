import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: string;
}

const StatCard = ({ icon: Icon, value, label, trend }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border bg-gradient-card p-6 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs text-success">{trend}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-primary/5" />
    </Card>
  );
};

export default StatCard;
