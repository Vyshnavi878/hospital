import React, { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  Home,
  Sparkles,
  CalendarDays,
  PhoneCall,
  MessageSquare,
  X,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Authentic user-specified tooth checkup & examination icon
const DentalServicesCheckupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden="true"
    className={cn("inline-block bg-current", className)}
    style={{
      maskImage: `url('/images/dental-services-icon.png')`,
      WebkitMaskImage: `url('/images/dental-services-icon.png')`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Hide on role-based dashboard pages
  const isDashboard =
    location.pathname.startsWith("/patientdashboard") ||
    location.pathname.startsWith("/doctordashboard") ||
    location.pathname.startsWith("/admindashboard");

  if (isDashboard) {
    return null;
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────────────
          BESPOKE HOSPITAL QUICK-CARE MODAL SHEET (1-Tap Connect, WhatsApp & Directions)
      ───────────────────────────────────────────────────────────────────────────── */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center p-0 md:hidden animate-fade-in"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-[2rem] p-5 sm:p-6 shadow-2xl border-t border-slate-200 space-y-5 animate-slide-in-bottom text-left max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

            {/* Doctor & Hospital Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl overflow-hidden border-2 border-primary/25 shadow-sm shrink-0 bg-slate-100">
                  <img
                    src="/images/clinic/dr-deepa-portrait.png"
                    alt="Dr. Deepa Koduri, BDS, MDS"
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm text-slate-900 leading-tight truncate">
                    Dr. Deepa Koduri, BDS, MDS
                  </h3>
                  <p className="text-[11px] text-primary font-semibold">
                    TRUDENT Multispeciality Dental Hospital
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Open Today: 9:00 AM – 8:30 PM</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Close care sheet"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 1-Tap Quick Connect Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Direct Phone Call */}
              <a
                href="tel:+919063584448"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/90 text-emerald-900 font-semibold text-xs active:scale-95 transition-transform shadow-xs text-center"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-900">Direct Call</span>
                  <span className="text-[11px] text-emerald-700 font-mono font-bold block mt-0.5">
                    +91 90635 84448
                  </span>
                </div>
              </a>

              {/* WhatsApp Chat */}
              <a
                href="https://wa.me/919063584448?text=Hello%20Dr.%20Deepa%20Koduri%20/%20TRUDENT%20Hospital,%20I%20would%20like%20to%20inquire%20about%20a%20dental%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200/90 text-teal-900 font-semibold text-xs active:scale-95 transition-transform shadow-xs text-center"
              >
                <div className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-900">WhatsApp Chat</span>
                  <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                    Instant Clinical Query
                  </span>
                </div>
              </a>
            </div>

            {/* Hospital Physical Address & Google Maps */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="text-slate-900 font-bold block">Hospital Address</strong>
                  <span className="text-slate-600 text-[11px]">
                    1st Floor, Avani Plaza, Ramayya St, Surya Rao Peta, Kakinada – 533001
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Mon–Sat: 9:00 AM – 8:30 PM</span>
                <a
                  href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                to="/appointment"
                onClick={() => setIsContactOpen(false)}
                className="w-full block"
              >
                <Button className="w-full h-11 text-xs font-bold rounded-xl gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-xs">
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Visit</span>
                </Button>
              </Link>
              <Link
                to="/doctors"
                onClick={() => setIsContactOpen(false)}
                className="w-full block"
              >
                <Button
                  variant="outline"
                  className="w-full h-11 text-xs font-semibold rounded-xl gap-1.5 border-slate-300 text-slate-800 hover:bg-slate-50"
                >
                  <Stethoscope className="h-4 w-4 text-primary" />
                  <span>Meet Doctor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          CLEAN, SMOOTH, OPAQUE MOBILE BOTTOM NAVIGATION BAR
          Solid background (0% see-through bleed), perfectly aligned icons & single-line text
      ───────────────────────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-slate-200/95 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center h-16 max-w-md mx-auto px-1">
          {/* 1. Home Tab - Sky/Blue theme */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none",
                isActive ? "text-blue-700 font-bold" : "text-slate-600 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-xs scale-105"
                      : "bg-blue-50/90 text-blue-600 border border-blue-100/80"
                  )}
                >
                  <Home className="h-4.5 w-4.5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
                    isActive ? "font-bold text-blue-700" : "font-semibold text-slate-600"
                  )}
                >
                  Home
                </span>
              </>
            )}
          </NavLink>

          {/* 2. Services Tab - Dental Tooth Icon theme */}
          <NavLink
            to="/treatments"
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none",
                isActive ? "text-teal-700 font-bold" : "text-slate-600 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-teal-600 text-white shadow-xs scale-105"
                      : "bg-teal-50/90 text-teal-600 border border-teal-100/80"
                  )}
                >
                  <DentalServicesCheckupIcon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
                    isActive ? "font-bold text-teal-700" : "font-semibold text-slate-600"
                  )}
                >
                  Services
                </span>
              </>
            )}
          </NavLink>

          {/* 3. Centerpiece Action: Book OPD - Emerald/Teal Gradient theme */}
          <NavLink
            to="/appointment"
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none",
                isActive ? "text-teal-800 font-extrabold" : "text-teal-700 font-bold"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-xl shadow-xs transition-transform active:scale-95",
                    isActive
                      ? "bg-teal-700 text-white ring-2 ring-teal-500/30 scale-105"
                      : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                  )}
                >
                  <CalendarDays className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
                    isActive ? "font-extrabold text-teal-800" : "font-bold text-teal-700"
                  )}
                >
                  Book OPD
                </span>
              </>
            )}
          </NavLink>

          {/* 4. Doctor Tab - Amber/Gold Medical Specialist theme */}
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none",
                isActive ? "text-amber-700 font-bold" : "text-slate-600 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "h-7 w-7 rounded-full overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center shadow-xs",
                    isActive
                      ? "border-amber-500 ring-2 ring-amber-400/40 scale-105"
                      : "border-amber-400/90 hover:border-amber-500"
                  )}
                >
                  <img
                    src="/images/clinic/dr-deepa-portrait.png"
                    alt="Dr. Deepa Koduri"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap",
                    isActive ? "font-bold text-amber-700" : "font-semibold text-slate-600"
                  )}
                >
                  Doctor
                </span>
              </>
            )}
          </NavLink>

          {/* 5. Care Desk Tab - Clinical Emergency Mint/Green theme */}
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-1 min-w-0 transition-all select-none cursor-pointer"
            aria-label="Open hospital care options"
          >
            <div className="h-7 w-7 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 transition-colors">
              <PhoneCall className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap font-semibold text-emerald-700">
              Care Desk
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
