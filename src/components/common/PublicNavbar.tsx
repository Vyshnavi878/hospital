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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
}

// Exactly the 5 requested navigation links
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

  // Scroll detection for subtle elevation
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b",
        isScrolled ? "border-slate-200/90 shadow-xs" : "border-slate-200"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: TRUDENT Brand Logo */}
        <div className="shrink-0">
          <TrudentLogo variant="light" size="md" />
        </div>

        {/* Center: Desktop Navigation (Strictly the 5 required links) */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Main Public Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-150",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions ([Book Appointment] prominent, [Sign In] secondary) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Secondary: Sign In */}
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 h-10 px-3.5 rounded-xl cursor-pointer"
            >
              <LogIn className="h-4 w-4 mr-1.5 text-slate-500" />
              <span>Sign In</span>
            </Button>
          </Link>

          {/* Prominent: Book Appointment */}
          <Link to="/appointment">
            <Button
              size="sm"
              className="h-10 px-5 text-xs sm:text-sm font-semibold gap-2 shadow-xs rounded-xl bg-primary hover:bg-primary/90 text-white cursor-pointer"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger icon only */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-11 w-11 text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center justify-center shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[81px] z-50 bg-slate-900/40 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="bg-white border-b border-slate-200 shadow-xl max-h-[calc(100vh-81px)] overflow-y-auto px-5 py-6 space-y-6">
            {/* Nav Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2">
                Main Navigation
              </p>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-4 py-3.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Actions: Book Appointment & Sign In */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button className="w-full h-12 font-semibold text-sm rounded-xl gap-2 shadow-xs bg-primary hover:bg-primary/90 text-white cursor-pointer">
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
                  className="w-full h-12 font-semibold text-sm rounded-xl gap-2 border-slate-300 text-slate-800 hover:bg-slate-100 cursor-pointer"
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
