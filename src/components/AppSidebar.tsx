import { 
  Home, 
  Leaf, 
  Wallet, 
  User, 
  FileText, 
  BarChart3, 
  Settings, 
  Package,
  ShoppingCart,
  TrendingUp,
  Award,
  FileCheck,
  Users,
  Shield,
  ChevronDown
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles?: string[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  roles?: string[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Marketplace", url: "/marketplace", icon: ShoppingCart },
      { title: "Wallet", url: "/wallet", icon: Wallet },
    ],
  },
  {
    title: "Project Owner",
    roles: ["project_owner"],
    items: [
      { title: "My Projects", url: "/dashboard", icon: Package },
      { title: "Register Project", url: "/register-project", icon: FileText },
      { title: "Energy Dashboard", url: "/energy", icon: BarChart3 },
      { title: "Analytics", url: "/owner-analytics", icon: TrendingUp },
    ],
  },
  {
    title: "Buyer",
    roles: ["buyer"],
    items: [
      { title: "My Credits", url: "/wallet", icon: Award },
      { title: "Certificates", url: "/wallet", icon: FileCheck },
    ],
  },
  {
    title: "Administration",
    roles: ["admin"],
    items: [
      { title: "Admin Panel", url: "/admin", icon: Shield },
      { title: "Users", url: "/admin/users", icon: Users },
      { title: "Projects", url: "/admin/projects", icon: Package },
    ],
  },
];

interface AppSidebarProps {
  userRole?: string;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  // Filter groups based on user role
  const filteredGroups = menuGroups.filter((group) => {
    if (!group.roles) return true;
    return group.roles.includes(userRole || "");
  });

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold text-primary">Offst.AI</h2>
            </div>
          )}
          {isCollapsed && <Leaf className="h-6 w-6 text-primary mx-auto" />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {filteredGroups.map((group, index) => {
          const hasActiveItem = group.items.some((item) => isActive(item.url));
          
          return (
            <Collapsible
              key={index}
              defaultOpen={hasActiveItem || index === 0}
              className="group/collapsible"
            >
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:bg-muted/50">
                    {!isCollapsed && (
                      <>
                        <span>{group.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.url}
                              end
                              className="hover:bg-muted/50 transition-colors"
                              activeClassName="bg-primary/10 text-primary font-medium"
                            >
                              <item.icon className="h-4 w-4" />
                              {!isCollapsed && <span className="ml-2">{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {/* Settings at bottom of content */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/profile"
                    className="hover:bg-muted/50 transition-colors"
                    activeClassName="bg-primary/10 text-primary font-medium"
                  >
                    <User className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Profile</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Settings className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Settings</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/profile" className="hover:bg-muted/50">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col flex-1 text-left">
                      <span className="text-sm font-medium truncate">
                        {user?.email?.split("@")[0] || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {userRole?.replace("_", " ") || "Member"}
                      </span>
                    </div>
                  )}
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
