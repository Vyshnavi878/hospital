import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";

interface AppointmentCTAProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AppointmentCTA: React.FC<AppointmentCTAProps> = ({
  title = "Ready for a Healthier, Confident Smile?",
  subtitle = "Schedule your consultation with TRUDENT's experienced dental specialists. Gentle pain-free treatments, digital smile design, and convenient online tokens.",
  className,
}) => {
  return (
    <section className={`py-16 sm:py-20 bg-white ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-slate-900 text-white p-8 sm:p-12 lg:p-14 shadow-lg text-left relative overflow-hidden">
          {/* Subtle background dental graphic accents */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-80 h-80" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>TRUDENT • Healthy Smiles, Happy Hearts</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/appointment">
                <Button
                  size="lg"
                  className="h-12 px-7 rounded-xl bg-white hover:bg-slate-100 text-primary font-bold text-sm sm:text-base shadow-sm gap-2 cursor-pointer transition-all hover:translate-y-[-1px]"
                >
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>Book Appointment</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
              </Link>

              <a
                href="tel:+919063584448"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 text-rose-300" />
                <span>Emergency Dental: +91 90635 84448</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-5 text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>Strict Hospital Sterilization</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Painless Anesthesia</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-300" />
                <span>Instant Digital Token</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
