import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, ShoppingCart, Award, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { roles, isProjectOwner, isBuyer, isAdmin } = useUserRole();
  const [wallet, setWallet] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch wallet data
    const fetchWallet = async () => {
      const { data } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setWallet(data);
    };

    // Fetch recent transactions
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*, projects(title)")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentTransactions(data || []);
    };

    // Fetch user's projects if project owner
    const fetchProjects = async () => {
      if (isProjectOwner) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setProjects(data || []);
      }
    };

    fetchWallet();
    fetchTransactions();
    fetchProjects();
  }, [user, isProjectOwner]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Welcome back, {user?.user_metadata?.full_name || "User"}
          </h1>
          <p className="text-muted-foreground">
            Your roles: {roles.join(", ") || "buyer"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Wallet className="h-6 w-6 text-primary" />}
            label="Wallet Balance"
            value={`$${wallet?.balance?.toFixed(2) || "0.00"}`}
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            label="Total Credits"
            value={wallet?.total_credits?.toFixed(2) || "0"}
          />
          <StatCard
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
            label="Transactions"
            value={recentTransactions.length.toString()}
          />
          <StatCard
            icon={<Award className="h-6 w-6 text-primary" />}
            label="Credits Retired"
            value="0"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {isProjectOwner && (
              <Button asChild variant="hero">
                <Link to="/register-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Project
                </Link>
              </Button>
            )}
            <Button asChild variant={isProjectOwner ? "outline-primary" : "hero"}>
              <Link to="/marketplace">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Link>
            </Button>
            <Button asChild variant="outline-primary">
              <Link to="/wallet">
                <Wallet className="mr-2 h-4 w-4" />
                Manage Wallet
              </Link>
            </Button>
            {isProjectOwner && (
              <Button asChild variant="success">
                <Link to="/register-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Project
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin">Admin Panel</Link>
              </Button>
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {tx.projects?.title || "Project"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tx.credits} credits @ ${tx.price_per_ton}/ton
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      ${tx.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No transactions yet</p>
          )}
        </Card>

        {/* Project Owner Section */}
        {isProjectOwner && (
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">My Projects</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {project.status}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/project/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't registered any projects yet
                </p>
                <Button asChild variant="hero">
                  <Link to="/register-project">
                    <Plus className="mr-2 h-4 w-4" />
                    Register Your First Project
                  </Link>
                </Button>
              </div>
            )}
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
