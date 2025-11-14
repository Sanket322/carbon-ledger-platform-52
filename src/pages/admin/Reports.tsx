import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, TrendingUp, Users, DollarSign, FileCheck } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch all data for reports
      const [usersRes, projectsRes, transactionsRes, kycRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("projects").select("*"),
        supabase.from("transactions").select("*"),
        supabase.from("profiles").select("*").not("kyc_verified_at", "is", null)
      ]);

      const totalRevenue = transactionsRes.data?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;
      const totalCredits = transactionsRes.data?.reduce((sum, t) => sum + Number(t.credits), 0) || 0;
      
      const activeProjects = projectsRes.data?.filter(p => 
        p.status === "active" || p.status === "verified"
      ).length || 0;

      const projectsByType = projectsRes.data?.reduce((acc, p) => {
        acc[p.project_type] = (acc[p.project_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalUsers: usersRes.count || 0,
        verifiedUsers: kycRes.data?.length || 0,
        totalProjects: projectsRes.data?.length || 0,
        activeProjects,
        totalTransactions: transactionsRes.data?.length || 0,
        totalRevenue,
        totalCredits,
        projectsByType,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Report exported successfully");
  };

  const handleExportUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) exportToCSV(data, "users-report");
  };

  const handleExportTransactions = async () => {
    const { data } = await supabase.from("transactions").select("*");
    if (data) exportToCSV(data, "transactions-report");
  };

  const handleExportProjects = async () => {
    const { data } = await supabase.from("projects").select("*");
    if (data) exportToCSV(data, "projects-report");
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
        <h2 className="text-3xl font-bold text-foreground">Reports & Analytics</h2>
        <p className="text-muted-foreground">Platform performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedUsers} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Credits Traded</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total tons CO₂
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed reports in CSV format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
            <Button onClick={handleExportTransactions}>
              <Download className="mr-2 h-4 w-4" />
              Export Transactions
            </Button>
            <Button onClick={handleExportProjects}>
              <Download className="mr-2 h-4 w-4" />
              Export Projects
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Projects by Type</CardTitle>
          <CardDescription>Distribution of project types on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.projectsByType || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {type.replace(/_/g, " ")}
                </span>
                <span className="text-2xl font-bold">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
