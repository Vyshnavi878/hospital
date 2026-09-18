import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorMobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  pendingCount?: number;
}

export const DoctorMobileBottomNav: React.FC<DoctorMobileBottomNavProps> = ({
  activeView,
  onViewChange,
  pendingCount = 0,
}) => {
  const handleTabClick = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Doctor Dashboard Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Overview Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("dashboard")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "dashboard" ? "text-teal-700 font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "dashboard"
                ? "bg-teal-600 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "dashboard" ? "font-bold text-teal-700" : "font-semibold text-slate-600"
            )}
          >
            Overview
          </span>
        </button>

        {/* 2. Appointment Management Tab with Pending Badge */}
        <button
          type="button"
          onClick={() => handleTabClick("appointments")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer relative",
            activeView === "appointments" ? "text-teal-700 font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all relative",
              activeView === "appointments"
                ? "bg-teal-600 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                {pendingCount}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "appointments" ? "font-bold text-teal-700" : "font-semibold text-slate-600"
            )}
          >
            Appt Mgmt
          </span>
        </button>

        {/* 3. Prescriptions Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("prescriptions")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "prescriptions" ? "text-teal-700 font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "prescriptions"
                ? "bg-teal-600 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <FileText className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "prescriptions" ? "font-bold text-teal-700" : "font-semibold text-slate-600"
            )}
          >
            Prescriptions
          </span>
        </button>

        {/* 4. Doctor Profile Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("profile")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "profile" ? "text-teal-700 font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "profile"
                ? "bg-teal-600 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <User className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "profile" ? "font-bold text-teal-700" : "font-semibold text-slate-600"
            )}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};

export default DoctorMobileBottomNav;
