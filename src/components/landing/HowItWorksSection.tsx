import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import howItWorks from "@/assets/how-it-works.jpg";

const steps = [
  { num: 1, title: "Project Registration", desc: "Project owners register their carbon reduction initiatives with international registries." },
  { num: 2, title: "Verification & Issuance", desc: "Third-party verifiers audit projects and carbon credits are issued based on verified emission reductions." },
  { num: 3, title: "Trade & Retire", desc: "Credits are traded on our marketplace and retired to offset carbon emissions, with digital certificates issued." },
];

const HowItWorksSection = () => (
  <section className="bg-muted/30 py-20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
            How Carbon Credits Work
          </h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                  {step.num}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="lg" className="mt-8" asChild>
            <Link to="/how-it-works">Learn More</Link>
          </Button>
        </div>
        <div className="relative">
          <img src={howItWorks} alt="How carbon credits work" className="rounded-2xl shadow-xl" />
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
