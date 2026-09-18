import React from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  FileText,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import { cn } from "@/lib/utils";
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

const mainNavItems = [
  { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { title: "Book Appointment", value: "book", icon: CalendarPlus },
  { title: "My Appointments", value: "appointments", icon: CalendarDays },
];

const healthNavItems = [
  { title: "Medical Documents", value: "documents", icon: FileText },
  { title: "My Profile", value: "profile", icon: User },
];

interface PatientSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

const PatientSidebar = ({ activeView, onViewChange, onLogout }: PatientSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Sarah Johnson";

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
      {/* Header with official TRUDENT branding */}
      <SidebarHeader
        className={cn(
          "border-b border-border/60 transition-all",
          collapsed ? "p-1.5 flex items-center justify-center" : "p-4"
        )}
      >
        <div className="flex items-center justify-center">
          {collapsed ? (
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-border/80 shadow-2xs p-1"
              title="TRUDENT Multispeciality Dental Hospital"
            >
              <img
                src="/favicon.png"
                alt="TRUDENT"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <TrudentLogo size="sm" clickable={false} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary/80 pl-1">
                Patient Portal
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn("py-3 space-y-4", collapsed ? "px-1" : "px-2")}>
        {/* MAIN SECTION */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              MAIN
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {mainNavItems.map((item) => {
                const isActive = activeView === item.value;
                return (
                  <SidebarMenuItem key={item.value} className={collapsed ? "flex justify-center" : ""}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.value)}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl transition-all cursor-pointer",
                        collapsed
                          ? "h-9 w-9 p-0 flex items-center justify-center mx-auto"
                          : "gap-3 px-3 py-2.5 text-sm font-medium",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* HEALTH SECTION */}
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              HEALTH
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {healthNavItems.map((item) => {
                const isActive = activeView === item.value;
                return (
                  <SidebarMenuItem key={item.value} className={collapsed ? "flex justify-center" : ""}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.value)}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl transition-all cursor-pointer",
                        collapsed
                          ? "h-9 w-9 p-0 flex items-center justify-center mx-auto"
                          : "gap-3 px-3 py-2.5 text-sm font-medium",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
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
      <SidebarFooter
        className={cn(
          "border-t border-border/60 bg-muted/20 transition-all",
          collapsed ? "p-1.5 flex flex-col items-center gap-1.5" : "p-3 space-y-2"
        )}
      >
        <div className={cn("w-full", collapsed ? "flex flex-col items-center gap-2" : "space-y-2")}>
          {/* Profile row */}
          <button
            type="button"
            onClick={() => onViewChange("profile")}
            title="View Patient Profile"
            className={cn(
              "flex items-center rounded-xl transition-colors cursor-pointer group",
              collapsed
                ? "h-9 w-9 justify-center mx-auto hover:bg-muted/80"
                : "w-full gap-3 p-2 hover:bg-muted/80 text-left"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-xs">
              {username.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {username}
                </p>
                <p className="text-[10px] text-muted-foreground">My Profile</p>
              </div>
            )}
            {!collapsed && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors" />
            )}
          </button>

          {/* Logout row */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className={cn(
              "flex items-center rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer",
              collapsed
                ? "h-9 w-9 justify-center mx-auto hover:bg-destructive/10"
                : "w-full gap-3 px-2 py-2"
            )}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PatientSidebar;
