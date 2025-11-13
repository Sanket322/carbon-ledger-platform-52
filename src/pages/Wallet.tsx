import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { toast } from "sonner";

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    if (!user) return;

    fetchWalletData();
    fetchTransactions();
  }, [user]);

  const fetchWalletData = async () => {
    const { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user?.id)
      .single();
    setWallet(data);
  };

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*, projects(title)")
      .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
      .order("created_at", { ascending: false });
    setTransactions(data || []);
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.info("Payment integration coming soon!");
    setDepositAmount("");
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    toast.info("Withdrawal processing will be available soon");
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Balance Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-foreground">
                  ${wallet?.balance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escrow Balance</p>
                <p className="text-3xl font-bold text-foreground">
                  ${wallet?.escrow_balance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-3xl font-bold text-foreground">
                  {wallet?.total_credits?.toFixed(2) || "0"}
                </p>
              </div>
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Deposit/Withdraw */}
        <Card className="mb-8 p-6">
          <Tabs defaultValue="deposit">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount">Amount (USD)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="100.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full" variant="hero">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
                <p className="text-xs text-muted-foreground">
                  Payment integration (Stripe/Razorpay) will be available soon
                </p>
              </div>
            </TabsContent>

            <TabsContent value="withdraw">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="50.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleWithdraw} className="w-full" variant="outline-primary">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Transaction History */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Transaction History</h2>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.buyer_id === user?.id ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {tx.buyer_id === user?.id ? (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {tx.projects?.title || "Project"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tx.credits} credits @ ${tx.price_per_ton}/ton
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.buyer_id === user?.id ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {tx.buyer_id === user?.id ? "-" : "+"}$
                      {tx.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No transactions yet</p>
            )}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Wallet;
