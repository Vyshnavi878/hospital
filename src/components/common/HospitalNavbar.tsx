import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import {
  Home,
  Stethoscope,
  Grid3X3,
  Menu,
  X,
  PhoneCall,
  CalendarDays,
  LogIn,
  ChevronRight,
  Info,
  MessageSquare,
  Syringe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  mobileLabel?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home", icon: Home, mobileLabel: "Home" },
  { label: "Doctors", href: "#doctors", id: "doctors", icon: Stethoscope, mobileLabel: "Doctors" },
  { label: "Departments", href: "#departments", id: "departments", icon: Grid3X3, mobileLabel: "Depts" },
  { label: "Services", href: "#services", id: "services", icon: Syringe, mobileLabel: "Services" },
  { label: "About", href: "#about", id: "about", icon: Info, mobileLabel: "About" },
  { label: "Contact", href: "#contact", id: "contact", icon: MessageSquare, mobileLabel: "Contact" },
];

const BOTTOM_TAB_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home", icon: Home, mobileLabel: "Home" },
  { label: "Doctors", href: "#doctors", id: "doctors", icon: Stethoscope, mobileLabel: "Doctors" },
  { label: "Services", href: "#services", id: "services", icon: Syringe, mobileLabel: "Services" },
  { label: "About", href: "#about", id: "about", icon: Info, mobileLabel: "About" },
  { label: "Contact", href: "#contact", id: "contact", icon: MessageSquare, mobileLabel: "Contact" },
];

export const HospitalNavbar = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sectionIds = ["home", "doctors", "departments", "services", "about", "emergency", "contact"];
      const scrollPosition = window.scrollY + 120;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveSection(targetId);
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href.replace("#", ""));
  };

  const handleBookAppointment = () => {
    setMobileMenuOpen(false);
    const token = localStorage.getItem("authToken");
    navigate(token ? "/patientdashboard" : "/login");
  };

  return (
    <>
      {/* ─── Top Sticky Header ─── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm"
            : "bg-white border-b border-slate-200"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* TRUDENT Brand Logo */}
          <TrudentLogo size="sm" variant="light" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary font-semibold bg-primary/8"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="tel:+919063584448"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <PhoneCall className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>+91 90635 84448</span>
            </a>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium text-slate-700 h-9 px-3">
                Sign In
              </Button>
            </Link>
            <Button size="sm" onClick={handleBookAppointment} className="h-9 px-4 text-sm font-medium gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="tel:+919063584448"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200"
              aria-label="Call hospital"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
            </a>
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold active:scale-95 transition-transform"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-Down Drawer ─── */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-x-0 top-16 z-50 md:hidden bg-white border-b border-slate-200 shadow-xl animate-scale-in">
            <div className="max-h-screen overflow-y-auto pb-24">
              <div className="px-4 pt-4 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Navigate</p>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 flex items-center justify-center rounded-lg",
                          isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-300")} />
                    </a>
                  );
                })}
              </div>

              <div className="px-4 pt-4 border-t border-slate-100 mt-4 space-y-2.5">
                <a
                  href="tel:+919063584448"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-100">
                      <PhoneCall className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-800">Emergency / Call Now</p>
                      <p className="text-xs text-rose-600 font-medium">+91 90635 84448</p>
                    </div>
                  </div>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                </a>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full justify-center gap-2 h-11 text-sm">
                    <LogIn className="h-4 w-4 text-slate-500" />
                    <span>Sign In to Patient Portal</span>
                  </Button>
                </Link>
                <Button onClick={handleBookAppointment} className="w-full justify-center gap-2 h-12 text-sm font-semibold shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Mobile Bottom Navigation Tab Bar ─── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-stretch h-16">
          {BOTTOM_TAB_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all duration-200",
                  isActive ? "text-primary" : "text-slate-400 active:text-slate-700"
                )}
                aria-label={item.label}
              >
                <div className={cn(
                  "h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200",
                  isActive ? "bg-primary/12 scale-110" : ""
                )}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-primary font-bold" : "text-slate-500"
                )}>
                  {item.mobileLabel}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};
