import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function KYCManagement() {
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCRequests();
  }, []);

  const fetchKYCRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("kyc_submitted_at", "is", null)
        .is("kyc_verified_at", null)
        .order("kyc_submitted_at", { ascending: false });

      if (error) throw error;
      setKycRequests(data || []);
    } catch (error) {
      console.error("Error fetching KYC requests:", error);
      toast.error("Failed to load KYC requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKYC = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          kyc_verified: true,
          kyc_verified_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success("KYC approved successfully");
      fetchKYCRequests();
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC");
    }
  };

  const handleRejectKYC = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          kyc_submitted_at: null,
          kyc_verified: false,
        })
        .eq("id", userId);

      if (error) throw error;
      toast.success("KYC rejected");
      fetchKYCRequests();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC");
    }
  };

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
        <h2 className="text-3xl font-bold text-foreground">KYC Management</h2>
        <p className="text-muted-foreground">Review and approve KYC verification requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Requests</CardTitle>
          <CardDescription>Total pending: {kycRequests.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {kycRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending KYC requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.full_name}</TableCell>
                    <TableCell>{request.company_name || "N/A"}</TableCell>
                    <TableCell>{request.phone || "N/A"}</TableCell>
                    <TableCell>{request.country || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(request.kyc_submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproveKYC(request.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectKYC(request.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
