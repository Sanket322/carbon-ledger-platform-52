import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Globe, Lightbulb } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Transparency",
      description:
        "Every carbon credit on our platform is verified and traceable to internationally recognized registries.",
    },
    {
      icon: Users,
      title: "Trust",
      description:
        "We ensure all projects meet rigorous verification standards and maintain complete documentation.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Connecting projects from 48+ countries with buyers worldwide to maximize environmental impact.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Leveraging cutting-edge technology to make carbon credit trading efficient, secure, and accessible.",
    },
  ];

  const stats = [
    { value: "1.2M+", label: "Tons CO₂ Offset" },
    { value: "234", label: "Verified Projects" },
    { value: "48", label: "Countries" },
    { value: "2,500+", label: "Active Users" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light/20 px-4 py-1 text-primary-foreground">
            About Offst.AI
          </Badge>
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Building a Sustainable Future Through Carbon Markets
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-primary-foreground/90">
            Offst.AI is the leading platform for verified carbon credit trading, connecting project owners, 
            traders, and buyers in a transparent, secure marketplace that drives real environmental impact.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border bg-card p-6 text-center">
                <p className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Our Mission
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              To accelerate global climate action by creating the most trusted, transparent, and efficient 
              marketplace for carbon credits. We empower organizations and individuals to measurably reduce 
              their carbon footprint while supporting verified environmental projects worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The principles that guide everything we do at Offst.AI
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="border-border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
              How We Ensure Quality
            </h2>

            <div className="space-y-6">
              <Card className="border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Rigorous Verification
                </h3>
                <p className="text-muted-foreground">
                  Every project on our platform must be verified by internationally recognized registries 
                  including UCR, Verra VCS, and Gold Standard. We maintain direct integration with these 
                  registries to ensure real-time verification status.
                </p>
              </Card>

              <Card className="border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Complete Traceability
                </h3>
                <p className="text-muted-foreground">
                  Each carbon credit is tracked from issuance through retirement with complete documentation. 
                  Our digital certificates include QR codes linking directly to registry verification documents.
                </p>
              </Card>

              <Card className="border-border bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Transparent Marketplace
                </h3>
                <p className="text-muted-foreground">
                  Real-time pricing, clear project documentation, and detailed impact metrics ensure buyers 
                  can make informed decisions. All transactions are recorded and auditable.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
