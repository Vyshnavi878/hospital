import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientMobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  upcomingCount?: number;
}

export const PatientMobileBottomNav: React.FC<PatientMobileBottomNavProps> = ({
  activeView,
  onViewChange,
  upcomingCount = 0,
}) => {
  const handleTabClick = (view: string) => {
    onViewChange(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Patient Dashboard Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center h-16 max-w-md mx-auto px-1">
        {/* 1. Overview Tab */}
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

        {/* 2. My Visits Tab with Badge */}
        <button
          type="button"
          onClick={() => handleTabClick("appointments")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer relative",
            activeView === "appointments" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all relative",
              activeView === "appointments"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            {upcomingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                {upcomingCount}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "appointments" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            My Visits
          </span>
        </button>

        {/* 3. Centerpiece Action: Book Visit */}
        <button
          type="button"
          onClick={() => handleTabClick("book")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "book" ? "text-blue-800 font-extrabold" : "text-blue-700 font-bold"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl shadow-xs transition-transform active:scale-95",
              activeView === "book"
                ? "bg-blue-700 text-white ring-2 ring-blue-500/30 scale-105"
                : "bg-gradient-to-r from-primary to-blue-600 text-white shadow-sm"
            )}
          >
            <CalendarPlus className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "book" ? "font-extrabold text-blue-800" : "font-bold text-blue-700"
            )}
          >
            Book Visit
          </span>
        </button>

        {/* 4. Medical Documents Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("documents")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "documents" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "documents"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <FileText className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "documents" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            Records
          </span>
        </button>

        {/* 5. Patient Profile Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("profile")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer",
            activeView === "profile" ? "text-primary font-bold" : "text-slate-600 font-medium"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
              activeView === "profile"
                ? "bg-primary text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <User className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
              activeView === "profile" ? "font-bold text-primary" : "font-semibold text-slate-600"
            )}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};

export default PatientMobileBottomNav;
