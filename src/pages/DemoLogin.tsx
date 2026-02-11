import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { User, Building2, ShieldCheck, ArrowRight, Copy, LogIn, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const DemoLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [settingUp, setSettingUp] = useState(false);
  const [accountsExist, setAccountsExist] = useState<boolean | null>(null);

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
      color: "from-primary to-primary-light",
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
      color: "from-accent to-accent/80",
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
      color: "from-primary-dark to-primary",
      redirect: "/admin"
    }
  ];

  useEffect(() => {
    checkDemoAccounts();
  }, []);

  const checkDemoAccounts = async () => {
    try {
      // Check by trying to query the profiles table for all demo emails
      // Since we can't query auth.users directly from client, we check profiles
      const demoEmails = ['buyer@demo.offst.ai', 'owner@demo.offst.ai', 'admin@demo.offst.ai'];
      
      // Try to get the current session to see if any demo user exists
      const { data: { session } } = await supabase.auth.getSession();
      
      // For now, we'll use a simple approach: check if profiles exist with specific pattern
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .ilike('full_name', '%Demo%');
      
      if (error) {
        console.error("Error checking profiles:", error);
        setAccountsExist(false);
        return;
      }
      
      // If we have at least 3 demo profiles, consider accounts exist
      setAccountsExist(count !== null && count >= 3);
    } catch (error) {
      console.error("Error checking demo accounts:", error);
      setAccountsExist(false);
    }
  };

  const createDemoAccounts = async () => {
    setSettingUp(true);
    try {
      const accounts = [
        { email: "buyer@demo.offst.ai", password: "Demo123!@#", fullName: "Demo Buyer", role: "buyer" },
        { email: "owner@demo.offst.ai", password: "Demo123!@#", fullName: "Demo Project Owner", role: "project_owner" },
        { email: "admin@demo.offst.ai", password: "Demo123!@#", fullName: "Demo Admin", role: "admin" }
      ];

      let successCount = 0;
      
      for (const account of accounts) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: account.email,
          password: account.password,
          options: {
            data: {
              full_name: account.fullName,
              user_role: account.role
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            console.log(`Account ${account.email} already exists`);
            successCount++;
          } else {
            console.error(`Error creating ${account.email}:`, signUpError);
          }
        } else if (data.user) {
          console.log(`Successfully created ${account.email}`);
          successCount++;
        }
      }

      if (successCount === accounts.length) {
        toast.success("Demo accounts ready!", {
          description: "All accounts are set up and ready to use"
        });
        setAccountsExist(true);
      } else {
        toast.error("Some accounts could not be created", {
          description: "Please check console for details"
        });
      }
    } catch (error: any) {
      toast.error(`Failed to create demo accounts: ${error.message}`);
      console.error("Demo account creation error:", error);
    } finally {
      setSettingUp(false);
    }
  };

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

          {/* Setup Alert */}
          {accountsExist === false && (
             <Alert className="mb-8 border-warning/50 bg-warning/10">
               <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">
                    Demo accounts need to be set up first. Click the button to create them automatically.
                  </span>
                  <Button 
                    onClick={createDemoAccounts}
                    disabled={settingUp}
                    size="sm"
                    className="ml-4"
                  >
                    {settingUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Setup Demo Accounts
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Accounts Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              const isLoading = loading === account.role;
              
              return (
                <Card key={account.role} className="relative overflow-hidden transition-all hover:shadow-xl">
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${account.color} p-6`}>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-foreground">{account.role}</h2>
                    <p className="mt-2 text-sm text-primary-foreground/80">{account.description}</p>
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
                      disabled={isLoading || accountsExist === false}
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
