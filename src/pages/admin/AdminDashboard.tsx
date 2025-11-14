import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { 
  Users, 
  ShieldCheck, 
  FileCheck, 
  TrendingUp, 
  DollarSign,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    pendingProjects: 0,
    activeProjects: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch pending KYC count
      const { count: kycCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("kyc_submitted_at", "is", null)
        .is("kyc_verified_at", null);

      // Fetch pending projects count
      const { count: pendingCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_verification");

      // Fetch active projects count
      const { count: activeCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .in("status", ["active", "verified"]);

      // Fetch transactions
      const { data: transactionsData, count: transCount } = await supabase
        .from("transactions")
        .select("*", { count: "exact" });

      const totalRevenue = transactionsData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

      // Fetch recent activity (last 10 transactions)
      const { data: recentTx } = await supabase
        .from("transactions")
        .select(`
          *,
          projects(title),
          profiles!transactions_buyer_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        totalUsers: usersCount || 0,
        pendingKYC: kycCount || 0,
        pendingProjects: pendingCount || 0,
        activeProjects: activeCount || 0,
        totalTransactions: transCount || 0,
        totalRevenue,
      });

      setRecentActivity(recentTx || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
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
        <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor platform activity and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          label="Active Projects"
          value={stats.activeProjects.toString()}
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.profiles?.full_name || "Unknown User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.projects?.title || "Unknown Project"} • {activity.credits} credits
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${activity.total_amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
