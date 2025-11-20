import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = {
    "project-owners": {
      title: "For Project Owners",
      questions: [
        {
          q: "How do I register my project?",
          a: "Click 'Register Project' from the homepage or dashboard. Fill in project details, upload required documents (PCN, monitoring reports, ownership proof), and submit for verification by our team and registry partners."
        },
        {
          q: "What documents are required for project registration?",
          a: "You'll need: Project Concept Note (PCN), ownership proof documents, monitoring plan, baseline and additionality demonstration, stakeholder consultation reports, and any existing registry documentation."
        },
        {
          q: "How long does the verification process take?",
          a: "Verification typically takes 2-4 weeks depending on project complexity and documentation completeness. Our team and registry partners (UCR, Verra, Gold Standard) review all submissions thoroughly."
        },
        {
          q: "How are carbon credits calculated for my project?",
          a: "Credits are calculated based on verified energy generation data and emission reduction estimates. Each project type has specific methodologies approved by registries like UCR, Verra, and Gold Standard."
        },
        {
          q: "Can I track my project's performance in real-time?",
          a: "Yes! Use the Energy Information System in your dashboard to track energy generation, carbon credits generated, and sync data from IoT devices or smart meters automatically."
        }
      ]
    },
    "buyers": {
      title: "For Buyers & Traders",
      questions: [
        {
          q: "How do I purchase carbon credits?",
          a: "Browse available projects in the Marketplace, select credits you want to purchase, complete KYC verification if not done, and proceed with payment via Razorpay (INR) or Stripe (USD/EUR)."
        },
        {
          q: "What is the KYC process?",
          a: "Complete your profile with business/individual details, upload identity documents, and await verification. KYC is required before purchasing credits to ensure marketplace integrity."
        },
        {
          q: "How do I retire carbon credits?",
          a: "Go to your Wallet, select credits to retire, provide a retirement reason, and confirm. You'll receive a digital certificate with a QR code linked to the registry for verification."
        },
        {
          q: "Can I trade credits on the marketplace?",
          a: "Yes, our trading engine supports limit and market orders. View the order book, historical prices, and execute trades through your Buyer/Trader dashboard."
        },
        {
          q: "How are carbon credits transferred?",
          a: "Credits are transferred digitally through our platform and reflected in your wallet. All transactions are recorded with serial numbers from registries (UCR, Verra, Gold Standard)."
        }
      ]
    },
    "verification": {
      title: "Verification & Certificates",
      questions: [
        {
          q: "Which registries does Offst.AI work with?",
          a: "We work with leading registries: Universal Carbon Registry (UCR), Verra (VCS), and Gold Standard. All projects must be verified by at least one of these registries."
        },
        {
          q: "What is the certification workflow?",
          a: "Projects go through: Application → Registration → Pre-Validation → Validation → Monitoring & Verification → Compliance → Crediting Period. Each stage requires specific documentation and reviews."
        },
        {
          q: "How can I verify a retirement certificate?",
          a: "Each certificate includes a QR code that links directly to the registry. Scan the code to verify authenticity, serial numbers, and project details on the official registry website."
        },
        {
          q: "Are the carbon credits certified?",
          a: "Yes, all credits on our platform are certified by UCR, Verra, or Gold Standard. We only list verified projects with valid registry documentation."
        }
      ]
    },
    "payments": {
      title: "Payments & Security",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept payments via Razorpay (for INR transactions in India) and Stripe (for international USD/EUR transactions). All payments are secure and encrypted."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard encryption (HTTPS, SSL/TLS). Payment processing is handled by Razorpay and Stripe, which are PCI DSS compliant."
        },
        {
          q: "What are the fees and commissions?",
          a: "Platform fees vary by transaction type. Check the Finance Reports section in Settings or contact our team for detailed fee structure information."
        },
        {
          q: "How does the escrow system work?",
          a: "Payments are held in escrow until credit transfer is confirmed on the registry. This protects both buyers and sellers, ensuring secure transactions."
        }
      ]
    },
    "technical": {
      title: "Technical & Support",
      questions: [
        {
          q: "Can I integrate IoT devices for automatic data sync?",
          a: "Yes! The Energy Information System supports API integration and webhook endpoints for real-time energy data from smart meters and IoT monitoring systems."
        },
        {
          q: "How do I export my data?",
          a: "All dashboards include export options. Download energy readings, transaction history, and reports in CSV or PDF format from your respective dashboard sections."
        },
        {
          q: "Is there an API for developers?",
          a: "Yes, we provide REST APIs for energy data sync. Contact support for API documentation and authentication credentials."
        },
        {
          q: "How can I get support?",
          a: "Visit our Support Center, email support@offst.ai, or use the in-app chat. Our team typically responds within 24 hours on business days."
        }
      ]
    }
  };

  const filterQuestions = (questions: any[]) => {
    if (!searchQuery) return questions;
    return questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about Offst.AI carbon credit platform
            </p>
          </div>

          <Card className="mb-8 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          <Tabs defaultValue="project-owners" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="project-owners">Project Owners</TabsTrigger>
              <TabsTrigger value="buyers">Buyers</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            {Object.entries(faqCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <Card className="p-6">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">{category.title}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {filterQuestions(category.questions).map((item, index) => (
                      <AccordionItem key={index} value={`${key}-${index}`}>
                        <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filterQuestions(category.questions).length === 0 && (
                    <p className="text-center text-muted-foreground">No matching questions found</p>
                  )}
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="mt-8 bg-primary/5 p-6">
            <h3 className="mb-2 text-xl font-bold text-foreground">Still have questions?</h3>
            <p className="mb-4 text-muted-foreground">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@offst.ai"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Contact Us
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
