import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";
import { toast } from "sonner";
import { CertificateViewer } from "@/components/CertificateViewer";
import { formatINR, formatCreditPrice } from "@/utils/currency";

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [retireAmount, setRetireAmount] = useState("");
  const [retireReason, setRetireReason] = useState("");
  const [showRetireDialog, setShowRetireDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchWalletData();
    fetchTransactions();
    fetchCertificates();
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

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("retirement_certificates")
      .select("*, projects(title, project_type, registry, location_country, registry_id)")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setCertificates(data || []);
  };

  const handleRetireCredits = async () => {
    const amount = parseFloat(retireAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (wallet && amount > wallet.total_credits) {
      toast.error("Insufficient credits");
      return;
    }

    try {
      // Generate serial number (UCR format)
      const serialNumber = `UCR-${Date.now()}-${user?.id.substring(0, 8)}`;
      
      // Create retirement certificate
      const { data: certData, error: certError } = await supabase
        .from("retirement_certificates")
        .insert({
          user_id: user?.id,
          project_id: transactions[0]?.project_id || null, // Get from last transaction
          credits_retired: amount,
          serial_number: serialNumber,
          retirement_reason: retireReason || "Voluntary carbon offset",
        })
        .select()
        .single();

      if (certError) throw certError;

      // Update wallet
      const { error: walletError } = await supabase
        .from("wallets")
        .update({
          total_credits: wallet.total_credits - amount,
        })
        .eq("user_id", user?.id);

      if (walletError) throw walletError;

      toast.success("Credits retired successfully! Certificate generated.");
      setShowRetireDialog(false);
      setRetireAmount("");
      setRetireReason("");
      fetchWalletData();
      fetchCertificates();
    } catch (error: any) {
      toast.error("Failed to retire credits");
      console.error(error);
    }
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
    <div className="container mx-auto px-4 py-8">
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
                {formatINR(wallet?.balance || 0)}
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
                {formatINR(wallet?.escrow_balance || 0)}
              </p>
            </div>
            <Award className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-3xl font-bold text-foreground">
                {wallet?.total_credits?.toFixed(2) || "0"} tCO₂e
              </p>
            </div>
            <WalletIcon className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

        {/* Tabs */}
        <Card className="mb-8 p-6">
          <Tabs defaultValue="transactions">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {tx.transaction_type === "purchase" ? "Purchased" : "Sold"} {tx.credits} credits
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.projects?.title || "Unknown Project"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatINR(tx.total_amount)}</p>
                          <p className="text-xs text-muted-foreground">{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Retirement Certificates</h2>
                <Button onClick={() => setShowRetireDialog(true)} className="gap-2">
                  <Award className="h-4 w-4" />
                  Retire Credits
                </Button>
              </div>

              {certificates.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No retirement certificates yet</p>
                  <Button 
                    onClick={() => setShowRetireDialog(true)} 
                    className="mt-4"
                    variant="outline"
                  >
                    Retire Your First Credits
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{cert.credits_retired} tCO₂e Retired</p>
                          <p className="text-sm text-muted-foreground">
                            Serial: {cert.serial_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(cert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCertificate(cert);
                            setShowCertificateDialog(true);
                          }}
                        >
                          View Certificate
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deposit">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount">Amount (INR)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="1000.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full" variant="hero">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
                <p className="text-xs text-muted-foreground">
                  Payment integration (Razorpay for INR) will be available soon
                </p>
              </div>
            </TabsContent>

            <TabsContent value="withdraw">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Amount (INR)</Label>
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

        {/* Retire Credits Dialog */}
        <Dialog open={showRetireDialog} onOpenChange={setShowRetireDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retire Carbon Credits</DialogTitle>
              <DialogDescription>
                Permanently retire credits to offset your carbon footprint. You'll receive a UCR-verified certificate.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="retire-amount">Credits to Retire (tCO₂e)</Label>
                <Input
                  id="retire-amount"
                  type="number"
                  placeholder="0.00"
                  value={retireAmount}
                  onChange={(e) => setRetireAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Available: {wallet?.total_credits || 0} credits
                </p>
              </div>
              <div>
                <Label htmlFor="retire-reason">Retirement Reason (Optional)</Label>
                <Textarea
                  id="retire-reason"
                  placeholder="e.g., Annual carbon offset for company operations"
                  value={retireReason}
                  onChange={(e) => setRetireReason(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleRetireCredits} className="w-full">
                Retire Credits & Generate Certificate
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Certificate Viewer Dialog */}
        <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCertificate && (
              <CertificateViewer
                certificate={selectedCertificate}
                projectDetails={selectedCertificate.projects}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Wallet;
