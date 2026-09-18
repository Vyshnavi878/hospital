import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import {
  Menu,
  X,
  CalendarDays,
  LogIn,
  ChevronRight,
  PhoneCall,
  Clock,
  MapPin,
  Stethoscope,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
}

// Strictly the 5 required navigation links
const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Doctors", to: "/doctors" },
  { label: "Treatments", to: "/treatments" },
  { label: "Contact", to: "/contact" },
];

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll detection for elevation & subtle glass effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TOP HOSPITAL UTILITY RIBBON (Clinical Status, Doctor Badge & Emergency Hotline)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 text-slate-200 border-b border-white/10 text-xs py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Live Clinic OPD Status */}
          <div className="flex items-center gap-2 font-medium text-[11px] text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">OPD Open Today:</span>
            <span>9:00 AM – 8:30 PM • Ramayya St, Surya Rao Peta, Kakinada</span>
          </div>

          {/* Center: Chief Specialist Badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
            <span className="text-teal-300 font-semibold">Chief Specialist:</span>
            <span className="text-white font-bold">Dr. Deepa Koduri, BDS, MDS</span>
            <span className="text-slate-400 font-normal">• Micro-Endodontics</span>
          </div>

          {/* Right: Direct Emergency Helpline */}
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+919063584448"
              className="inline-flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-semibold transition-colors"
            >
              <PhoneCall className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Helpline: +91 90635 84448</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium">Surya Rao Peta, Kakinada</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MAIN HOSPITAL NAVIGATION HEADER (Bespoke Glass Island Design)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "w-full transition-all duration-300 bg-white/95 backdrop-blur-xl border-b",
          isScrolled
            ? "border-teal-500/20 shadow-[0_4px_25px_-4px_rgba(13,148,136,0.12)]"
            : "border-slate-200"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: TRUDENT Brand Logo */}
          <div className="shrink-0">
            <TrudentLogo variant="light" size="md" />
          </div>

          {/* Center: Desktop Navigation - Bespoke Segmented Clinical Capsule */}
          <nav
            className="hidden md:flex items-center bg-slate-100/80 border border-slate-200/90 p-1 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
            aria-label="Main Public Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-white text-primary font-bold shadow-xs border border-primary/20 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions ([Book Appointment] prominent gradient pill, [Sign In] secondary) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Direct Phone Chip on Large Displays */}
            <a
              href="tel:+919063584448"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-teal-800 bg-teal-50/80 hover:bg-teal-100/90 border border-teal-200/70 transition-colors mr-1"
            >
              <PhoneCall className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>+91 90635 84448</span>
            </a>

            {/* Secondary: Sign In */}
            <Link to="/login">
              <Button
                variant="outline"
                className="h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 hover:text-slate-900 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <LogIn className="h-4 w-4 text-slate-500" />
                <span>Sign In</span>
              </Button>
            </Link>

            {/* Prominent: Book Appointment */}
            <Link to="/appointment">
              <Button
                className="h-10 px-5 text-xs sm:text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 shadow-sm hover:shadow transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Book Appointment</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Right Controls: Direct Call Pill + Bespoke Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* 1-Tap Quick Phone Call on Mobile */}
            <a
              href="tel:+919063584448"
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 hover:bg-teal-100 transition-colors shrink-0 shadow-2xs"
              aria-label="Direct call hospital"
            >
              <PhoneCall className="h-4 w-4 text-primary" />
            </a>

            {/* Bespoke Mobile Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/70 cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-900" />
              ) : (
                <Menu className="h-5 w-5 text-slate-900" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. BESPOKE MOBILE NAVIGATION DRAWER (With Doctor Card & Clinical Links)
      ───────────────────────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[81px] z-50 bg-slate-950/60 backdrop-blur-xs md:hidden animate-fade-in overscroll-none"
          onClick={() => setMobileMenuOpen(false)}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          <div
            className="bg-white border-b border-slate-200 shadow-2xl max-h-[calc(100vh-81px)] overflow-y-auto overscroll-contain px-4 py-5 space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Authentic Lead Doctor Card in Mobile Drawer */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/40 to-slate-50 border border-teal-200/70 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-primary/25 shadow-xs shrink-0 bg-slate-100">
                <img
                  src="/images/clinic/dr-deepa-portrait.png"
                  alt="Dr. Deepa Koduri, BDS, MDS"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-bold text-xs text-slate-900 leading-tight truncate">
                  Dr. Deepa Koduri, BDS, MDS
                </h3>
                <p className="text-[11px] text-primary font-semibold truncate mt-0.5">
                  Micro-Endodontist & Root Canal Specialist
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Consultations Available Today</span>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1">
                Hospital Navigation
              </p>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    )
                  }
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </NavLink>
              ))}
            </div>

            {/* Direct Connect & Hospital Address Strip */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span>Direct Desk:</span>
                </div>
                <a
                  href="tel:+919063584448"
                  className="font-bold text-primary hover:underline font-mono text-[11px]"
                >
                  +91 90635 84448
                </a>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>9:00 AM – 8:30 PM</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Surya Rao Peta, Kakinada</span>
                </span>
              </div>
            </div>

            {/* Mobile Actions: Book Appointment & Sign In */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button className="w-full h-11 font-bold text-xs rounded-xl gap-2 shadow-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white cursor-pointer">
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Button>
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full h-11 font-semibold text-xs rounded-xl gap-2 border-slate-300 text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <LogIn className="h-4 w-4 text-slate-500" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
