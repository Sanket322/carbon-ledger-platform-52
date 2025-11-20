import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, DollarSign, BarChart3, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/utils/currency";

interface Project {
  id: string;
  title: string;
  status: string;
  total_credits: number;
  available_credits: number;
  price_per_ton: number;
  created_at: string;
  current_stage?: string;
}

interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  totalCreditsIssued: number;
  totalRevenue: number;
  creditsSold: number;
  pendingVerification: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OwnerAnalytics() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<ProjectAnalytics>({
    totalProjects: 0,
    activeProjects: 0,
    totalCreditsIssued: 0,
    totalRevenue: 0,
    creditsSold: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [creditStatusData, setCreditStatusData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchProjectData();
  }, [user]);

  const fetchProjectData = async () => {
    try {
      // Fetch all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      setProjects(projectsData || []);

      // Calculate analytics
      if (projectsData) {
        const totalCredits = projectsData.reduce((sum, p) => sum + Number(p.total_credits), 0);
        const creditsSold = projectsData.reduce((sum, p) => sum + (Number(p.total_credits) - Number(p.available_credits)), 0);
        const revenue = projectsData.reduce((sum, p) => {
          const sold = Number(p.total_credits) - Number(p.available_credits);
          return sum + (sold * Number(p.price_per_ton));
        }, 0);

        setAnalytics({
          totalProjects: projectsData.length,
          activeProjects: projectsData.filter(p => p.status === 'active' || p.status === 'verified').length,
          totalCreditsIssued: totalCredits,
          totalRevenue: revenue,
          creditsSold: creditsSold,
          pendingVerification: projectsData.filter(p => p.status === 'pending_verification' || p.status === 'application').length,
        });

        // Prepare revenue chart data
        const monthlyRevenue = projectsData.map(p => ({
          name: p.title.substring(0, 15) + "...",
          revenue: (Number(p.total_credits) - Number(p.available_credits)) * Number(p.price_per_ton),
          credits: Number(p.total_credits) - Number(p.available_credits),
        }));
        setRevenueData(monthlyRevenue);

        // Credit status pie chart
        const statusData = [
          { name: 'Available', value: projectsData.reduce((sum, p) => sum + Number(p.available_credits), 0) },
          { name: 'Sold', value: creditsSold },
        ];
        setCreditStatusData(statusData);
      }
    } catch (error: any) {
      toast.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Active" },
      verified: { variant: "default", label: "Verified" },
      pending_verification: { variant: "secondary", label: "Pending" },
      application: { variant: "secondary", label: "Application" },
      rejected: { variant: "destructive", label: "Rejected" },
    };

    const config = statusConfig[status] || { variant: "outline", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Project Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your projects, credits, and revenue performance
          </p>
        </div>
        <Link to="/register-project">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Register New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Issued</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalCreditsIssued.toLocaleString()} tCO₂e
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.creditsSold.toLocaleString()} sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {analytics.creditsSold.toLocaleString()} credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              In review process
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Project</CardTitle>
            <CardDescription>Income generated from credit sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: number) => formatINR(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (INR)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Distribution</CardTitle>
            <CardDescription>Available vs Sold credits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={creditStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {creditStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>Manage and monitor all your registered projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No projects registered yet</p>
                <Link to="/register-project">
                  <Button>Register Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Total Credits</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Available</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Price/ton</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const sold = Number(project.total_credits) - Number(project.available_credits);
                      const revenue = sold * Number(project.price_per_ton);
                      
                      return (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{project.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(project.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(project.status)}</td>
                          <td className="px-4 py-3 text-right">{Number(project.total_credits).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{Number(project.available_credits).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{formatINR(project.price_per_ton)}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatINR(revenue)}</td>
                          <td className="px-4 py-3 text-right">
                            <Link to={`/project/${project.id}`}>
                              <Button variant="ghost" size="sm">View</Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
