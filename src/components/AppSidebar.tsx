import { Home, Leaf, Wallet, User, FileText, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Projects", url: "/marketplace", icon: Leaf },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Energy Dashboard", url: "/energy", icon: BarChart3, roles: ["project_owner"] },
  { title: "Register Project", url: "/register-project", icon: FileText, roles: ["project_owner"] },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Admin", url: "/admin", icon: Settings, roles: ["admin"] },
];

interface AppSidebarProps {
  userRole?: string;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";

  // Filter menu items based on user role
  const filteredItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || "");
  });

  const isActive = (path: string) => currentPath === path;
  const hasActiveItem = filteredItems.some((i) => isActive(i.url));

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-primary">Offst.AI</h2>
          )}
          <SidebarTrigger />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
