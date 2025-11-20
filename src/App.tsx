import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectOwnerSignup from "./pages/ProjectOwnerSignup";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import RegisterProject from "./pages/RegisterProject";
import Profile from "./pages/Profile";
import PurchaseProject from "./pages/PurchaseProject";
import Knowledge from "./pages/Knowledge";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import KYCManagement from "./pages/admin/KYCManagement";
import TransactionMonitoring from "./pages/admin/TransactionMonitoring";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import CertificationWorkflow from "./pages/admin/CertificationWorkflow";
import NotFound from "./pages/NotFound";
import EnergyDashboard from "./pages/EnergyDashboard";
import FAQ from "./pages/FAQ";
import Documentation from "./pages/Documentation";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Refund from "./pages/legal/Refund";
import Disclaimer from "./pages/legal/Disclaimer";
import DemoLogin from "./pages/DemoLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo-login" element={<DemoLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/project-owner" element={<ProjectOwnerSignup />} />
            
            {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/register-project" element={<ProtectedRoute><RegisterProject /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/purchase/:id" element={<ProtectedRoute><PurchaseProject /></ProtectedRoute>} />
              <Route path="/energy" element={<ProtectedRoute><EnergyDashboard /></ProtectedRoute>} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="/legal/refund" element={<Refund />} />
              <Route path="/legal/disclaimer" element={<Disclaimer />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
                <Route path="certification" element={<CertificationWorkflow />} />
                <Route path="kyc" element={<KYCManagement />} />
                <Route path="transactions" element={<TransactionMonitoring />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
