import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  Bell,
  FlaskConical,
  FileCheck,
  MapPin,
  Activity,
  Cpu,
  FileBarChart,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Portfolio", url: "/portfolio", icon: TrendingUp },
  { title: "Digital Twin", url: "/digital-twin", icon: MapPin },
  { title: "Asset Detail", url: "/asset/asset-1", icon: Activity },
  { title: "Active Alerts", url: "/alerts", icon: Bell },
  { title: "Analytics Lab", url: "/analytics", icon: FlaskConical },
  { title: "Prescriptions & Workflows", url: "/prescriptions", icon: FileCheck },
  { title: "Sensor Hub", url: "/sensors", icon: Cpu },
  { title: "Reports & Analytics", url: "/reports", icon: FileBarChart },
  { title: "24x7 Support", url: "/support", icon: Headphones },
  { title: "Admin & Governance", url: "/admin", icon: ShieldCheck },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
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
