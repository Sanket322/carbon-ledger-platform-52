import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function PurchaseProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [credits, setCredits] = useState("");

  useEffect(() => {
    fetchProjectAndWallet();
  }, [id, user]);

  const fetchProjectAndWallet = async () => {
    try {
      setLoading(true);

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("status", "active")
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch wallet
      if (user) {
        const { data: walletData, error: walletError } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (walletError) throw walletError;
        setWallet(walletData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase credits");
      navigate("/login");
      return;
    }

    const creditAmount = parseFloat(credits);
    if (!creditAmount || creditAmount <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    if (creditAmount > project.available_credits) {
      toast.error("Not enough credits available");
      return;
    }

    const totalCost = creditAmount * project.price_per_ton;
    if (totalCost > wallet.balance) {
      toast.error("Insufficient wallet balance");
      return;
    }

    try {
      setPurchasing(true);

      // Create transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          buyer_id: user.id,
          seller_id: project.owner_id,
          project_id: project.id,
          credits: creditAmount,
          price_per_ton: project.price_per_ton,
          total_amount: totalCost,
          transaction_type: "purchase",
          status: "completed",
        });

      if (transactionError) throw transactionError;

      // Update project available credits
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          available_credits: project.available_credits - creditAmount,
        })
        .eq("id", project.id);

      if (projectError) throw projectError;

      // Update buyer wallet
      const { error: walletError } = await supabase
        .from("wallets")
        .update({
          balance: wallet.balance - totalCost,
          total_credits: wallet.total_credits + creditAmount,
        })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      toast.success("Purchase completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to complete purchase");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Project not found</p>
        </div>
      </div>
    );
  }

  const creditAmount = parseFloat(credits) || 0;
  const totalCost = creditAmount * project.price_per_ton;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to={`/project/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Purchase Carbon Credits</h1>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.location_country}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{project.project_type}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Registry:</span>
                    <Badge variant="secondary">{project.registry}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per Ton:</span>
                    <span className="font-semibold">${project.price_per_ton}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Credits:</span>
                    <span className="font-semibold">{project.available_credits.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Form */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
                <CardDescription>Enter the amount of credits you want to purchase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="credits">Number of Credits (tons CO₂)</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="Enter credits"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    min="1"
                    max={project.available_credits}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{creditAmount.toLocaleString()} tons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per Ton:</span>
                    <span className="font-medium">${project.price_per_ton}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="text-xl font-bold text-primary">${totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {wallet && (
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Wallet Balance:</span>
                      <span className={`font-semibold ${wallet.balance < totalCost ? "text-destructive" : "text-foreground"}`}>
                        ${wallet.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={purchasing || !creditAmount || creditAmount > project.available_credits || (wallet && totalCost > wallet.balance)}
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Complete Purchase
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
