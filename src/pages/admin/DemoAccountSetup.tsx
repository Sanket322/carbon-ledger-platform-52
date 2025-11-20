import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/utils/currency";

export default function DemoAccountSetup() {
  const [loading, setLoading] = useState<string | null>(null);

  const demoAccounts = [
    {
      email: "buyer@demo.offst.ai",
      password: "Demo123!@#",
      full_name: "Demo Buyer",
      company_name: "Green Earth Corp",
      role: "buyer",
      phone: "+919876543210",
      country: "India"
    },
    {
      email: "owner@demo.offst.ai",
      password: "Demo123!@#",
      full_name: "Universal Team",
      company_name: "Demo Project Company",
      role: "project_owner",
      phone: "+911111111111",
      country: "India"
    },
    {
      email: "admin@demo.offst.ai",
      password: "Demo123!@#",
      full_name: "Platform Admin",
      company_name: "Offst.AI",
      role: "admin",
      phone: "+919999999999",
      country: "India"
    }
  ];

  const createAccount = async (account: any) => {
    setLoading(account.email);
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.full_name,
            company_name: account.company_name,
            phone: account.phone,
            country: account.country,
            user_role: account.role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast.info(`Account already exists: ${account.email}`);
        } else {
          throw signUpError;
        }
      } else if (authData.user) {
        // Update wallet balance for demo account
        await supabase
          .from("wallets")
          .update({ balance: 50000, total_credits: 100 })
          .eq("user_id", authData.user.id);

        toast.success(`Demo account created successfully!`, {
          description: account.email
        });
      }
    } catch (error: any) {
      toast.error(`Failed to create account: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const createAllAccounts = async () => {
    setLoading("all");
    for (const account of demoAccounts) {
      await createAccount(account);
      // Add delay between creations
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Demo Account Setup</h2>
        <p className="text-muted-foreground">
          Create and manage demo accounts for testing the platform
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={createAllAccounts}
          disabled={loading !== null}
          size="lg"
        >
          {loading === "all" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating All Accounts...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create All Demo Accounts
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demo Accounts</CardTitle>
          <CardDescription>
            Pre-configured accounts for testing different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Initial Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoAccounts.map((account) => {
                const isLoading = loading === account.email;
                
                return (
                  <TableRow key={account.email}>
                    <TableCell className="font-mono text-sm">{account.email}</TableCell>
                    <TableCell className="font-mono text-sm">{account.password}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.role}</Badge>
                    </TableCell>
                    <TableCell>{account.full_name}</TableCell>
                    <TableCell className="font-semibold">
                      {formatINR(50000)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => createAccount(account)}
                        disabled={loading !== null}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg">📋 Account Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong className="text-foreground">Buyer:</strong> Browse marketplace, purchase credits, manage portfolio
            </p>
            <p>
              • <strong className="text-foreground">Project Owner:</strong> Register projects, track energy, view analytics
            </p>
            <p>
              • <strong className="text-foreground">Admin:</strong> Verify projects, manage users, monitor transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-lg">⚠️ Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • All accounts use the same password for easy testing
            </p>
            <p>
              • Each account gets {formatINR(50000)} initial demo balance
            </p>
            <p>
              • Admin role must be assigned manually via role management
            </p>
            <p>
              • If account exists, it will show info message (not an error)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
