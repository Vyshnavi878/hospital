import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
  LogOut,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { title: "Appointment Management", value: "appointments", icon: CalendarDays },
  { title: "Prescriptions", value: "prescriptions", icon: FileText },
  { title: "My Profile", value: "profile", icon: User },
];

interface DoctorSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

const DoctorSidebar = ({ activeView, onViewChange, onLogout }: DoctorSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/80 bg-card">
      {/* Official TRUDENT Branding Header */}
      <SidebarHeader className="p-4 border-b border-border/60">
        <div className="flex items-center">
          {collapsed ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <TrudentLogo size="sm" clickable={false} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent/90 pl-1">
                Doctor Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-4">
        {/* MAIN SECTION */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              MAIN
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeView === item.value;
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.value)}
                      isActive={isActive}
                      tooltip={item.title}
                      className="gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold data-[active=true]:shadow-xs"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* BOTTOM FOOTER */}
      <SidebarFooter className="p-3 border-t border-border/60 bg-muted/20">
        <div className="space-y-2">
          {/* Profile row */}
          <button
            type="button"
            onClick={() => onViewChange("profile")}
            title="View Doctor Profile"
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-colors text-left cursor-pointer group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white text-xs font-bold shadow-xs">
              DK
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate group-hover:text-accent transition-colors">
                  Dr. Deepa Koduri
                </p>
                <p className="text-[10px] text-muted-foreground truncate">Endodontist</p>
              </div>
            )}
            {!collapsed && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-accent shrink-0 transition-colors" />
            )}
          </button>

          {/* Logout row */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DoctorSidebar;
