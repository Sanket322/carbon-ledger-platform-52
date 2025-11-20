import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Building2, ShieldCheck, ArrowRight, Copy, LogIn, Loader2, CheckCircle2 } from "lucide-react";

const DemoLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: "Buyer",
      email: "buyer@demo.offst.ai",
      password: "Demo123!@#",
      icon: User,
      description: "Experience the buyer journey with full marketplace access",
      features: [
        "Browse verified carbon credit projects",
        "Purchase credits using demo wallet",
        "Track portfolio and transaction history",
        "Retire credits and generate certificates"
      ],
      color: "from-blue-500 to-blue-600",
      redirect: "/dashboard"
    },
    {
      role: "Project Owner",
      email: "owner@demo.offst.ai",
      password: "Demo123!@#",
      icon: Building2,
      description: "Manage projects and track carbon credit generation",
      features: [
        "Register and manage projects",
        "Track energy generation data",
        "Monitor credit issuance analytics",
        "View sales and revenue reports"
      ],
      color: "from-green-500 to-green-600",
      redirect: "/owner-analytics"
    },
    {
      role: "Admin",
      email: "admin@demo.offst.ai",
      password: "Demo123!@#",
      icon: ShieldCheck,
      description: "Full platform administration and oversight",
      features: [
        "Verify and approve projects",
        "Manage all users and wallets",
        "Monitor all transactions",
        "Access comprehensive analytics"
      ],
      color: "from-purple-500 to-purple-600",
      redirect: "/admin"
    }
  ];

  const handleDemoLogin = async (email: string, password: string, role: string, redirect: string) => {
    setLoading(role);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success(`Successfully logged in as ${role}!`, {
          description: "Redirecting to your dashboard..."
        });
        setTimeout(() => {
          navigate(redirect);
        }, 500);
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      console.error("Demo login error:", error);
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              Demo Environment
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Welcome to Offst.AI Demo
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Experience the full platform with pre-configured demo accounts. Click "Login as {'{Role}'}" to
              instantly access each user type's dashboard with live demo data.
            </p>
          </div>

          {/* Demo Accounts Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isLoading = loading === account.role;
              
              return (
                <Card key={account.role} className="relative overflow-hidden transition-all hover:shadow-xl">
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${account.color} p-6`}>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{account.role}</h2>
                    <p className="mt-2 text-sm text-white/80">{account.description}</p>
                  </div>

                  <CardContent className="p-6">
                    {/* Credentials */}
                    <div className="mb-6 space-y-3">
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Email</span>
                          <button
                            onClick={() => copyToClipboard(account.email, "Email")}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <code className="text-sm font-mono text-foreground">{account.email}</code>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Password</span>
                          <button
                            onClick={() => copyToClipboard(account.password, "Password")}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <code className="text-sm font-mono text-foreground">{account.password}</code>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        What you can do:
                      </p>
                      <ul className="space-y-2">
                        {account.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Direct Login Button */}
                    <Button
                      onClick={() => handleDemoLogin(account.email, account.password, account.role, account.redirect)}
                      disabled={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login as {account.role}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Choose a Role:</strong> Select the demo account that matches your interest
                </p>
                <p>
                  <strong className="text-foreground">2. Direct Login:</strong> Click "Login as {'{Role}'}" button for instant access
                </p>
                <p>
                  <strong className="text-foreground">3. Explore Features:</strong> All demo data is pre-populated and fully functional
                </p>
                <p>
                  <strong className="text-foreground">4. Switch Roles:</strong> Logout and try different accounts to see all perspectives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Demo Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Live Transactions:</strong> Purchase credits using demo wallet balance
                </p>
                <p>
                  <strong className="text-foreground">Real-time Analytics:</strong> View actual charts and reports with demo data
                </p>
                <p>
                  <strong className="text-foreground">Complete Workflows:</strong> From project registration to credit retirement
                </p>
                <p>
                  <strong className="text-foreground">No Payment Required:</strong> All transactions use demo balance (₹50,000 default)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Manual Login Option */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Prefer Manual Login?</CardTitle>
              <CardDescription>
                You can also use the credentials above to login manually through the standard login page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto"
              >
                Go to Login Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoLogin;
