import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Globe, Lightbulb } from "lucide-react";

const values = [
  { icon: Target, title: "Transparency", desc: "Every carbon credit on our platform is verified and traceable to internationally recognized registries." },
  { icon: Users, title: "Trust", desc: "We ensure all projects meet rigorous verification standards and maintain complete documentation." },
  { icon: Globe, title: "Global Impact", desc: "Connecting projects from 48+ countries with buyers worldwide to maximize environmental impact." },
  { icon: Lightbulb, title: "Innovation", desc: "Leveraging cutting-edge technology to make carbon credit trading efficient, secure, and accessible." },
];

const AboutSection = () => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1.5">About Offst.AI</Badge>
        <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
          Building a Sustainable Future Through Carbon Markets
        </h2>
        <p className="text-lg text-muted-foreground">
          Offst.AI is the leading platform for verified carbon credit trading, connecting project owners,
          traders, and buyers in a transparent, secure marketplace that drives real environmental impact.
        </p>
      </div>

      <div className="mx-auto max-w-4xl text-center mb-16">
        <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Our Mission</h3>
        <p className="text-lg text-muted-foreground">
          To accelerate global climate action by creating the most trusted, transparent, and efficient
          marketplace for carbon credits. We empower organizations and individuals to measurably reduce
          their carbon footprint while supporting verified environmental projects worldwide.
        </p>
      </div>

      <div className="mb-12 text-center">
        <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Our Core Values</h3>
        <p className="mx-auto max-w-2xl text-muted-foreground mb-12">
          The principles that guide everything we do at Offst.AI
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <Card key={v.title} className="border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
              <v.icon className="h-6 w-6 text-primary" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-foreground">{v.title}</h4>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
