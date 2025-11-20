import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/utils/currency";

export default function TransactionMonitoring() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          projects(title, project_type),
          profiles!transactions_buyer_id_fkey(full_name, company_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.projects?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.transaction_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.total_amount), 0);
  const totalCredits = transactions.reduce((sum, tx) => sum + Number(tx.credits), 0);

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
        <h2 className="text-3xl font-bold text-foreground">Transaction Monitoring</h2>
        <p className="text-muted-foreground">Monitor all platform transactions and sales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{transactions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">All completed purchases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatINR(totalVolume)}</p>
            <p className="text-xs text-muted-foreground mt-1">Revenue generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Traded</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCredits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Carbon credits sold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Complete transaction and sales history</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
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
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead className="text-right">Price/Ton</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Serial #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">
                        {new Date(tx.created_at).toLocaleDateString()}
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleTimeString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        {tx.profiles?.full_name || "N/A"}
                        {tx.profiles?.company_name && (
                          <p className="text-sm text-muted-foreground">{tx.profiles.company_name}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{tx.projects?.title || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            {tx.projects?.project_type?.replace(/_/g, " ")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{tx.credits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatINR(tx.price_per_ton)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{formatINR(tx.total_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{tx.serial_number || "Pending"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
