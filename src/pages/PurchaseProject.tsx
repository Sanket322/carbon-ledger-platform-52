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
import { formatINR, convertUSDtoINR } from "@/utils/currency";

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
        .in("status", ["active", "verified"])
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

    const priceInINR = convertUSDtoINR(project.price_per_ton);
    const totalCost = creditAmount * priceInINR;
    
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
          price_per_ton: priceInINR,
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
      console.error("Error processing purchase:", error);
      toast.error("Failed to complete purchase");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or is not available for purchase.
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Projects</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const creditAmount = parseFloat(credits) || 0;
  const priceInINR = convertUSDtoINR(project.price_per_ton);
  const totalCost = creditAmount * priceInINR;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            asChild
          >
            <Link to={`/project/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Purchase Carbon Credits</h1>
            <p className="text-muted-foreground">
              Complete your purchase to offset your carbon footprint
            </p>
          </div>

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

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline">{project.project_type.replace(/_/g, " ")}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Registry:</span>
                    <Badge variant="secondary">{project.registry}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price per Credit:</span>
                    <span className="font-semibold">{formatINR(priceInINR)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Credits:</span>
                    <span className="font-semibold">{project.available_credits.toLocaleString()} tons</span>
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground mb-2">Environmental Impact:</p>
                  <p className="text-lg font-semibold text-primary">
                    Each credit offsets 1 ton of CO₂ emissions
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Maximum available: {project.available_credits.toLocaleString()} credits
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Price per Credit</span>
                    <span className="font-semibold">{formatINR(priceInINR)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-semibold">{creditAmount.toLocaleString()} tons</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <span className="text-lg font-semibold">Total Cost</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatINR(totalCost)}
                    </span>
                  </div>
                </div>

                {wallet && (
                  <div className={`rounded-lg p-4 ${wallet.balance < totalCost ? "bg-destructive/10" : "bg-muted"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wallet Balance</span>
                      <span className={`font-semibold ${wallet.balance < totalCost ? "text-destructive" : "text-green-600"}`}>
                        {formatINR(wallet.balance)}
                      </span>
                    </div>
                    {wallet.balance < totalCost && (
                      <p className="text-xs text-destructive mt-2">
                        Insufficient balance. Please add funds to your wallet.
                      </p>
                    )}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={
                    purchasing ||
                    !creditAmount ||
                    creditAmount <= 0 ||
                    creditAmount > project.available_credits ||
                    (wallet && wallet.balance < totalCost)
                  }
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

                <p className="text-xs text-center text-muted-foreground">
                  By completing this purchase, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
