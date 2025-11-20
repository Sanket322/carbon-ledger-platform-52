import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Building2, ShieldCheck, ArrowRight } from "lucide-react";

const DemoLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: "Buyer",
      email: "buyer@demo.offst.ai",
      password: "Demo123!@#",
      icon: User,
      description: "Browse projects, purchase carbon credits, track portfolio, retire credits",
      color: "bg-blue-500"
    },
    {
      role: "Project Owner",
      email: "owner@demo.offst.ai",
      password: "Demo123!@#",
      icon: Building2,
      description: "Register projects, track energy data, manage credits, view analytics",
      color: "bg-green-500"
    },
    {
      role: "Admin",
      email: "admin@demo.offst.ai",
      password: "Demo123!@#",
      icon: ShieldCheck,
      description: "Verify projects, manage users, monitor transactions, access all features",
      color: "bg-purple-500"
    }
  ];

  const handleDemoLogin = async (email: string, password: string, role: string) => {
    setLoading(role);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success(`Logged in as ${role}`);
        navigate("/dashboard");
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
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Demo Login Portal</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore Offst.AI platform with pre-configured demo accounts for each user role. Click any button below to
              instantly login and experience the full functionality.
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Card key={account.role} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className={`${account.color} p-6`}>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{account.role}</h2>
                  </div>

                  <div className="p-6">
                    <p className="mb-6 text-sm text-muted-foreground">{account.description}</p>

                    <div className="mb-6 space-y-3">
                      <div className="rounded-md border border-border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Email</p>
                        <div className="flex items-center justify-between">
                          <code className="text-sm text-foreground">{account.email}</code>
                          <button
                            onClick={() => copyToClipboard(account.email, "Email")}
                            className="text-xs text-primary hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="rounded-md border border-border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Password</p>
                        <div className="flex items-center justify-between">
                          <code className="text-sm text-foreground">{account.password}</code>
                          <button
                            onClick={() => copyToClipboard(account.password, "Password")}
                            className="text-xs text-primary hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDemoLogin(account.email, account.password, account.role)}
                      disabled={loading !== null}
                      className="w-full"
                      variant="hero"
                    >
                      {loading === account.role ? (
                        "Logging in..."
                      ) : (
                        <>
                          Login as {account.role}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-3 text-lg font-semibold text-foreground">📋 Demo Account Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All demo accounts are pre-configured with sample data and full permissions</li>
              <li>• Changes made in demo accounts won't affect production data</li>
              <li>• Demo accounts are reset periodically to maintain clean test environments</li>
              <li>• Feel free to explore all features without any restrictions</li>
            </ul>
          </Card>

          <div className="mt-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Want to create your own account?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => navigate("/signup")}>
                Sign Up as Buyer
              </Button>
              <Button variant="outline" onClick={() => navigate("/signup/project-owner")}>
                Sign Up as Project Owner
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoLogin;
