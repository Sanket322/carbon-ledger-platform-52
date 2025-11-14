import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RoleManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles(role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
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

      fetchUsers();
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Failed to update role");
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
        <h2 className="text-3xl font-bold text-foreground">Role Management</h2>
        <p className="text-muted-foreground">Assign and manage user roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Click on role badges to assign or remove roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userRoles = user.user_roles?.map((r: any) => r.role) || [];
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.company_name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {["admin", "buyer", "trader", "project_owner"].map((role) => {
                          const hasRole = userRoles.includes(role);
                          return (
                            <Badge
                              key={role}
                              variant={hasRole ? "default" : "outline"}
                              className="cursor-pointer transition-all hover:scale-105"
                              onClick={() => handleToggleRole(user.id, role, hasRole)}
                            >
                              {role.replace("_", " ")}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="default" className="mb-2">admin</Badge>
              <p className="text-sm text-muted-foreground">
                Full access to admin panel, can manage users, approve KYC, verify projects, and configure platform settings
              </p>
            </div>
            <div>
              <Badge variant="default" className="mb-2">project_owner</Badge>
              <p className="text-sm text-muted-foreground">
                Can register and manage carbon credit projects, upload documentation, and sell credits
              </p>
            </div>
            <div>
              <Badge variant="default" className="mb-2">buyer</Badge>
              <p className="text-sm text-muted-foreground">
                Can purchase carbon credits, retire credits, and view certificate history
              </p>
            </div>
            <div>
              <Badge variant="default" className="mb-2">trader</Badge>
              <p className="text-sm text-muted-foreground">
                Can buy and sell carbon credits on the marketplace with advanced trading features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
