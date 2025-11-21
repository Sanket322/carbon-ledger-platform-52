import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, FileText, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      articles: [
        {
          title: "What are Carbon Credits? (Simple Guide)",
          description: "Easy explanation: Think of carbon credits like certificates. 1 credit = 1 ton of CO₂ removed from the air.",
          tags: ["Basics", "Carbon Credits"],
          content: "Carbon credits are like certificates that prove you've helped reduce pollution.\n\n🌍 Simple Example:\nIf your business emits 100 tons of CO₂ per year, you can buy 100 carbon credits to become 'carbon neutral'. These credits come from projects that reduce or capture CO₂ (like solar farms or tree planting).\n\n💰 In India:\n- Credits are priced in INR (₹)\n- 1 credit = 1 ton of CO₂ offset\n- Projects are verified by international bodies (UCR, Verra, Gold Standard)"
        },
        {
          title: "How to Buy Credits in 3 Easy Steps",
          description: "Simple process: Sign up → Browse projects → Buy with INR → Get certificate",
          tags: ["Tutorial", "Buying"],
          content: "**Step 1: Sign Up (2 minutes)**\n- Click 'Sign Up' → Enter your details → Verify email\n\n**Step 2: Browse Projects**\n- Go to Marketplace → See Indian & global projects\n- Filter by type: Solar, Wind, Forest\n- Check price per ton in INR\n\n**Step 3: Buy & Get Certificate**\n- Choose how many tons to offset\n- Pay in INR (UPI/Card/Net Banking coming soon)\n- Instant retirement certificate with QR code"
        },
        {
          title: "Types of Projects (Explained Simply)",
          description: "Different ways to reduce CO₂: Solar panels, planting trees, wind farms, etc.",
          tags: ["Projects", "Categories"],
          content: "**☀️ Solar/Wind Projects (Renewable Energy)**\nClean electricity instead of coal/diesel. Common in India.\n\n**🌳 Forest Projects (Tree Planting)**\nTrees absorb CO₂. Popular in rural India.\n\n**⚡ Energy Efficiency**\nUsing less power to do the same work.\n\n**♻️ Waste Management**\nConverting garbage into energy or capturing methane gas."
        },
      ],
    },
    {
      id: "verification",
      title: "Verification & Registries",
      icon: <FileText className="h-5 w-5" />,
      articles: [
        {
          title: "Registry Standards",
          description: "Understanding different carbon credit registries and their standards",
          tags: ["Registries", "Standards"],
          content: "We work with internationally recognized registries:\n- Verra VCS: Verified Carbon Standard\n- Gold Standard: High-quality climate and sustainable development projects\n- UCR: Universal Carbon Registry\n- Climate Action Reserve: North American offset projects..."
        },
        {
          title: "Project Verification Process",
          description: "How projects are verified and approved on our platform",
          tags: ["Verification", "Process"],
          content: "Our verification process includes:\n1. Initial project submission and documentation review\n2. Third-party validation by accredited auditors\n3. Admin review and approval\n4. Continuous monitoring and reporting\n5. Annual re-verification..."
        },
        {
          title: "Quality Assurance",
          description: "How we ensure the quality and authenticity of carbon credits",
          tags: ["Quality", "Assurance"],
          content: "Quality assurance measures:\n- Independent third-party verification\n- Regular monitoring reports\n- Transparent documentation\n- Additionality verification\n- Permanence guarantees..."
        },
      ],
    },
    {
      id: "account",
      title: "Account & Wallet",
      icon: <HelpCircle className="h-5 w-5" />,
      articles: [
        {
          title: "Managing Your Wallet",
          description: "How to add funds, track balance, and manage transactions",
          tags: ["Wallet", "Finance"],
          content: "Your wallet features:\n- Real-time balance tracking\n- Transaction history\n- Credit portfolio management\n- Escrow protection for pending transactions\n- Secure payment processing..."
        },
        {
          title: "KYC Verification",
          description: "Why KYC is required and how to complete verification",
          tags: ["KYC", "Compliance"],
          content: "KYC (Know Your Customer) verification:\n- Required for regulatory compliance\n- Protects against fraud\n- Enables full platform features\n- Process: Submit ID, proof of address, selfie verification\n- Typically completed within 24-48 hours..."
        },
        {
          title: "Transaction Security",
          description: "How we protect your transactions and personal information",
          tags: ["Security", "Privacy"],
          content: "Security measures:\n- End-to-end encryption\n- Two-factor authentication\n- Secure payment processing\n- Regular security audits\n- GDPR compliant data handling..."
        },
      ],
    },
    {
      id: "projects",
      title: "For Project Owners",
      icon: <FileText className="h-5 w-5" />,
      articles: [
        {
          title: "Listing Your Project",
          description: "Requirements and process for project owners to list carbon credit projects",
          tags: ["Project Owners", "Listing"],
          content: "Requirements for project listing:\n- Valid registry certification\n- Complete project documentation\n- Monitoring and verification plans\n- Legal compliance documentation\n- Project methodology approval..."
        },
        {
          title: "Project Documentation",
          description: "Required documents and information for project approval",
          tags: ["Documentation", "Requirements"],
          content: "Required documentation:\n- Project Design Document (PDD)\n- Validation report from accredited validator\n- Monitoring reports\n- Verification certificates\n- Registry issuance documentation\n- Legal ownership proof..."
        },
        {
          title: "Managing Your Credits",
          description: "How to track, price, and sell your carbon credits",
          tags: ["Credits", "Sales"],
          content: "Credit management:\n- Set competitive pricing\n- Track available inventory\n- Monitor sales and revenue\n- Update project information\n- Retirement tracking\n- Batch management..."
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "What happens after I purchase carbon credits?",
      answer: "After purchase, the credits are added to your account's credit portfolio. You can choose to retire them to offset your carbon footprint or hold them for future use. Retired credits generate a certificate with a unique serial number for your records.",
    },
    {
      question: "Can I get a refund after purchasing credits?",
      answer: "Due to the nature of carbon credits representing real environmental impact, purchases are generally final. However, if there's an issue with the transaction or project verification, please contact our support team immediately.",
    },
    {
      question: "How are carbon credits priced?",
      answer: "Prices vary based on project type, location, verification standards, co-benefits (like biodiversity protection), and market demand. Premium projects with additional sustainability benefits may have higher prices.",
    },
    {
      question: "What is credit retirement?",
      answer: "Retiring a credit means permanently removing it from circulation to offset your carbon emissions. Once retired, the credit cannot be resold and represents a permanent offset of one ton of CO₂.",
    },
    {
      question: "How do I know projects are legitimate?",
      answer: "All projects on our platform are verified by internationally recognized registries and undergo rigorous third-party validation. We provide complete transparency with project documentation, monitoring reports, and verification certificates.",
    },
    {
      question: "What roles are available on the platform?",
      answer: "We support multiple roles: Buyers (purchase and retire credits), Project Owners (list and sell credits), Traders (buy and sell credits), and Admins (manage platform operations). Users can have multiple roles.",
    },
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Knowledge Center
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-foreground">Learn About Carbon Credits</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-6">
            Simple guides in plain language. No jargon. Learn how carbon credits work, how to buy them in India, and make a real environmental impact.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border">
              <span>🇮🇳</span>
              <span>Indian Context</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border">
              <span>💰</span>
              <span>Prices in INR</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border">
              <span>✅</span>
              <span>Easy to Understand</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for 'how to buy', 'what is carbon credit', 'pricing in INR'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="articles" className="mx-auto max-w-6xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">Articles & Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.articles.map((article, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="text-left">
                            <div>
                              <div className="font-medium">{article.title}</div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {article.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4">
                              <p className="text-sm text-muted-foreground">{article.description}</p>
                              <div className="whitespace-pre-line text-sm text-foreground">
                                {article.content}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No articles found matching your search.
              </div>
            )}
          </TabsContent>

          <TabsContent value="faq" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* External Resources */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>External Resources</CardTitle>
                <CardDescription>Learn more from industry-leading organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://docs.decarb.earth" target="_blank" rel="noopener noreferrer">
                    <span>Decarb.earth Documentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://verra.org" target="_blank" rel="noopener noreferrer">
                    <span>Verra Registry</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="https://www.goldstandard.org" target="_blank" rel="noopener noreferrer">
                    <span>Gold Standard</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
