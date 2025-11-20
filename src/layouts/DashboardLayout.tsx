import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserRole } from "@/hooks/useUserRole";

export default function DashboardLayout() {
  const { roles, isAdmin, isProjectOwner } = useUserRole();
  
  // Determine primary role for sidebar
  const primaryRole = isAdmin ? "admin" : isProjectOwner ? "project_owner" : "buyer";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        <AppSidebar userRole={primaryRole} />
        <div className="flex flex-1 flex-col w-full">
          <Navbar />
          <main className="flex-1 overflow-auto bg-background">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
