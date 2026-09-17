import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Search, Bell } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPopover } from "@/components/common/NotificationPopover";
import AdminSidebar from "./AdminSidebar";
import AdminOverviewTab from "./AdminOverviewTab";
import AdminDoctorsTab from "./AdminDoctorsTab";
import AdminAppointmentsTab from "./AdminAppointmentsTab";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 w-64 h-9 bg-muted/50 border-0 focus-visible:ring-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <NotificationPopover />
                <div className="flex items-center gap-2.5 pl-2 border-l border-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold shadow-sm">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-foreground leading-tight">{username}</p>
                    <p className="text-[10px] text-muted-foreground">Admin Center</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {activeView === "dashboard" && <AdminOverviewTab />}
            {activeView === "doctors" && <AdminDoctorsTab />}
            {activeView === "appointments" && <AdminAppointmentsTab />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
