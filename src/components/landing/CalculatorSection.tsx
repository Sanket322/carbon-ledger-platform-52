import { Badge } from "@/components/ui/badge";
import CarbonCalculator from "@/components/CarbonCalculator";

const CalculatorSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1.5">
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
);

export default CalculatorSection;
