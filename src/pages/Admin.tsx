import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users, 
  ShieldCheck, 
  FileCheck, 
  TrendingUp, 
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Shield
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    pendingProjects: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch users with their profiles and roles
      const { data: usersData } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles(role)
        `)
        .order("created_at", { ascending: false });

      // Fetch pending KYC requests
      const { data: kycData } = await supabase
        .from("profiles")
        .select("*")
        .not("kyc_submitted_at", "is", null)
        .is("kyc_verified_at", null)
        .order("kyc_submitted_at", { ascending: false });

      // Fetch pending projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select(`
          *,
          profiles(full_name)
        `)
        .eq("status", "pending_verification")
        .order("created_at", { ascending: false });

      // Fetch all transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select(`
          *,
          projects(title),
          profiles!transactions_buyer_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      // Calculate stats
      const totalRevenue = transactionsData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

      setUsers(usersData || []);
      setKycRequests(kycData || []);
      setProjects(projectsData || []);
      setTransactions(transactionsData || []);

      setStats({
        totalUsers: usersData?.length || 0,
        pendingKYC: kycData?.length || 0,
        pendingProjects: projectsData?.length || 0,
        totalTransactions: transactionsData?.length || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
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
      fetchAdminData();
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
      fetchAdminData();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC");
    }
  };

  const handleVerifyProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Project verified successfully");
      fetchAdminData();
    } catch (error) {
      console.error("Error verifying project:", error);
      toast.error("Failed to verify project");
    }
  };

  const handleRejectProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "rejected",
        })
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Project rejected");
      fetchAdminData();
    } catch (error) {
      console.error("Error rejecting project:", error);
      toast.error("Failed to reject project");
    }
  };

  const handleToggleRole = async (userId: string, role: string, hasRole: boolean) => {
    try {
      const validRole = role as "admin" | "buyer" | "trader" | "project_owner";
      
      if (hasRole) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", validRole);

        if (error) throw error;
        toast.success(`${role} role removed`);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert([{ 
            user_id: userId, 
            role: validRole 
          }]);

        if (error) throw error;
        toast.success(`${role} role added`);
      }

      fetchAdminData();
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Failed to update role");
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Super Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Complete platform management and operations control</p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Total Users"
              value={stats.totalUsers.toString()}
              icon={<Users className="h-6 w-6 text-primary" />}
            />
            <StatCard
              label="Pending KYC"
              value={stats.pendingKYC.toString()}
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            />
            <StatCard
              label="Pending Projects"
              value={stats.pendingProjects.toString()}
              icon={<FileCheck className="h-6 w-6 text-primary" />}
            />
            <StatCard
              label="Total Transactions"
              value={stats.totalTransactions.toString()}
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
            />
            <StatCard
              label="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 text-primary" />}
            />
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="kyc">KYC Approvals</TabsTrigger>
              <TabsTrigger value="projects">Project Verification</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* User Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const userRoles = user.user_roles?.map((r: any) => r.role) || [];
                        return (
                          <TableRow key={user.id}>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{user.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {["admin", "buyer", "trader", "project_owner"].map((role) => {
                                  const hasRole = userRoles.includes(role);
                                  return (
                                    <Badge
                                      key={role}
                                      variant={hasRole ? "default" : "outline"}
                                      className="cursor-pointer"
                                      onClick={() => handleToggleRole(user.id, role, hasRole)}
                                    >
                                      {role}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.kyc_verified ? (
                                <Badge variant="default">Verified</Badge>
                              ) : user.kyc_submitted_at ? (
                                <Badge variant="secondary">Pending</Badge>
                              ) : (
                                <Badge variant="outline">Not Submitted</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">View Profile</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* KYC Approvals */}
            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Approval Queue</CardTitle>
                  <CardDescription>Review and approve pending KYC requests</CardDescription>
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
                          <TableHead>Country</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kycRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.full_name}</TableCell>
                            <TableCell>{request.company_name || "N/A"}</TableCell>
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
            </TabsContent>

            {/* Project Verification */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Project Verification Queue</CardTitle>
                  <CardDescription>Review and verify carbon credit projects</CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No pending projects</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.profiles?.full_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{project.project_type}</Badge>
                            </TableCell>
                            <TableCell>{project.total_credits.toLocaleString()}</TableCell>
                            <TableCell>
                              {new Date(project.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleVerifyProject(project.id)}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Verify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectProject(project.id)}
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
            </TabsContent>

            {/* Transactions */}
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Monitor all platform transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.profiles?.full_name || "Unknown"}</TableCell>
                          <TableCell>{transaction.projects?.title || "N/A"}</TableCell>
                          <TableCell>{transaction.credits.toLocaleString()}</TableCell>
                          <TableCell>${transaction.total_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
