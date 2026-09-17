import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Menu,
  X,
  PhoneCall,
  CalendarDays,
  LogIn,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Doctors", href: "#doctors", id: "doctors" },
  { label: "Departments", href: "#departments", id: "departments" },
  { label: "Services", href: "#services", id: "services" },
  { label: "About", href: "#about", id: "about" },
  { label: "Emergency", href: "#emergency", id: "emergency" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const HospitalNavbar = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll spy to highlight active section
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

  // Prevent background scrolling when mobile menu is open
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const navHeight = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
    setMobileMenuOpen(false);
  };

  const handleBookAppointment = () => {
    setMobileMenuOpen(false);
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/patientdashboard");
    } else {
      navigate("/login");
    }
  };

  const handleEmergencyClick = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById("emergency");
    if (el) {
      const navHeight = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs"
          : "bg-white border-b border-slate-200"
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
          aria-label="CAREPULSE HEALTH Homepage"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              CAREPULSE <span className="text-primary font-bold">HEALTH</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
              Multi-Specialty Hospital
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-1.5"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
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

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Emergency Action */}
          <button
            onClick={handleEmergencyClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/90 border border-rose-300 transition-colors shadow-2xs cursor-pointer"
            title="Emergency & Urgent Care assistance"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <PhoneCall className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>Emergency</span>
          </button>

          {/* Sign In */}
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 h-9 px-3"
            >
              Sign In
            </Button>
          </Link>

          {/* Primary CTA: Book Appointment */}
          <Button
            size="sm"
            onClick={handleBookAppointment}
            className="h-9 px-4 text-sm font-medium gap-1.5 shadow-xs"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Book Appointment</span>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={handleEmergencyClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
            <span>Emergency</span>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 text-slate-700"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-50 bg-slate-900/40 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="bg-white border-b border-slate-200 shadow-xl max-h-[calc(100vh-73px)] overflow-y-auto px-5 py-6 space-y-5">
            {/* Nav Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Navigation
              </p>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </a>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={handleEmergencyClick}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold shadow-2xs hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  <PhoneCall className="h-4 w-4 text-rose-600" />
                  <span>Emergency & Urgent Care</span>
                </div>
                <ChevronRight className="h-4 w-4 text-rose-400" />
              </button>

              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" className="w-full justify-center gap-2 h-10 text-sm">
                  <LogIn className="h-4 w-4 text-slate-500" />
                  <span>Sign In to Patient Portal</span>
                </Button>
              </Link>

              <Button
                onClick={handleBookAppointment}
                className="w-full justify-center gap-2 h-11 text-sm font-semibold shadow-xs"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Book Appointment</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
