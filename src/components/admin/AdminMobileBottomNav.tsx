import React from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const AdminMobileBottomNav: React.FC<AdminMobileBottomNavProps> = ({
  activeView,
  onViewChange,
}) => {
  const handleTabClick = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Admin Dashboard Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center h-16 max-w-md mx-auto px-4">
        {/* 1. Overview */}
        <button
          type="button"
          onClick={() => handleTabClick("dashboard")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "dashboard" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "dashboard"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "dashboard" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            Overview
          </span>
        </button>

        {/* 2. Doctors Management */}
        <button
          type="button"
          onClick={() => handleTabClick("doctors")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "doctors" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "doctors"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <Users className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "doctors" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            Doctors
          </span>
        </button>

        {/* 3. Appointments */}
        <button
          type="button"
          onClick={() => handleTabClick("appointments")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "appointments" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "appointments"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <CalendarDays className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "appointments" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            Appointments
          </span>
        </button>
      </div>
    </nav>
  );
};

export default AdminMobileBottomNav;
