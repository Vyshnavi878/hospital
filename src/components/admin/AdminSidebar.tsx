import { LayoutDashboard, UserCog, CalendarDays } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { title: "Doctor Management", value: "doctors", icon: UserCog },
  { title: "All Appointments", value: "appointments", icon: CalendarDays },
];

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const AdminSidebar = ({ activeView, onViewChange }: AdminSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/80 bg-card">
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
              title="TRUDENT Admin Center"
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
              <span className="text-[10px] text-muted-foreground font-medium pl-1">
                Admin Center
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className={cn("py-3 space-y-4", collapsed ? "px-1" : "px-2")}>
        <SidebarGroup className="p-0">
          {!collapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              ADMINISTRATION
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.value} className={collapsed ? "flex justify-center" : ""}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.value)}
                    isActive={activeView === item.value}
                    tooltip={item.title}
                    className={cn(
                      "rounded-xl transition-all cursor-pointer",
                      collapsed
                        ? "h-9 w-9 p-0 flex items-center justify-center mx-auto"
                        : "gap-3 px-3 py-2.5 text-sm font-medium",
                      activeView === item.value
                        ? "bg-primary/10 text-primary font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

