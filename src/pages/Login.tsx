import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, ShoppingCart, Building2 } from "lucide-react";

const Login = () => {
  const [userType, setUserType] = useState<"buyer" | "project_owner">("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md border-border p-8">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Offst.AI</span>
        </Link>

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        <Tabs value={userType} onValueChange={(value) => setUserType(value as "buyer" | "project_owner")} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="buyer" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Buyer</span>
            </TabsTrigger>
            <TabsTrigger value="project_owner" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Project Owner</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="buyer" className="space-y-4 mt-0">
              <div className="mb-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Sign in to purchase carbon credits and manage your portfolio
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="project_owner" className="space-y-4 mt-0">
              <div className="mb-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Sign in to manage your carbon credit projects
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email2">Email</Label>
                <Input
                  id="email2"
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password2">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password2"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Sign In as {userType === "buyer" ? "Buyer" : "Project Owner"}
            </Button>
          </form>
        </Tabs>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>

      </Card>
    </div>
  );
};

export default Login;
