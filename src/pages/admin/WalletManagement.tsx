import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Wallet, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/utils/currency";

export default function WalletManagement() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"add" | "deduct">("add");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wallets")
        .select(`
          *,
          profiles(full_name, company_name, country)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const newBalance =
        actionType === "add"
          ? selectedWallet.balance + amountValue
          : Math.max(0, selectedWallet.balance - amountValue);

      const { error } = await supabase
        .from("wallets")
        .update({ balance: newBalance })
        .eq("id", selectedWallet.id);

      if (error) throw error;

      toast.success(
        `Successfully ${actionType === "add" ? "added" : "deducted"} ${formatINR(amountValue)}`
      );
      setIsDialogOpen(false);
      setAmount("");
      setSelectedWallet(null);
      fetchWallets();
    } catch (error) {
      console.error("Error updating balance:", error);
      toast.error("Failed to update balance");
    }
  };

  const openDialog = (wallet: any, type: "add" | "deduct") => {
    setSelectedWallet(wallet);
    setActionType(type);
    setIsDialogOpen(true);
  };

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.profiles?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
  const totalCredits = wallets.reduce((sum, w) => sum + Number(w.total_credits), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Wallet Management</h2>
        <p className="text-muted-foreground">Manage user wallets and balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{wallets.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active user wallets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatINR(totalBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all wallets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Carbon credits held</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Wallets</CardTitle>
              <CardDescription>Manage user wallet balances</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead className="text-right">Escrow</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No wallets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">
                        {wallet.profiles?.full_name || "N/A"}
                      </TableCell>
                      <TableCell>{wallet.profiles?.company_name || "—"}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatINR(wallet.balance)}
                      </TableCell>
                      <TableCell className="text-right">{wallet.total_credits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatINR(wallet.escrow_balance)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(wallet, "add")}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(wallet, "deduct")}
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Deduct
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "add" ? "Add Funds" : "Deduct Funds"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "add"
                ? "Add funds to user's wallet balance"
                : "Deduct funds from user's wallet balance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>User</Label>
              <Input
                value={selectedWallet?.profiles?.full_name || ""}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label>Current Balance</Label>
              <Input
                value={formatINR(selectedWallet?.balance || 0)}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBalance}>
              {actionType === "add" ? "Add Funds" : "Deduct Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
