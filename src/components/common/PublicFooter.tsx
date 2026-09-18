import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import { LegalModal } from "@/components/common/LegalModal";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export const PublicFooter: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 text-xs sm:text-sm pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-left">
          {/* Column 1: TRUDENT Branding & Hospital Overview */}
          <div className="lg:col-span-4 space-y-4">
            <TrudentLogo variant="dark" size="md" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-1">
              TRUDENT Multispeciality Dental Hospital delivers tertiary-grade dental surgery, microscopic endodontics, orthodontics, and cosmetic smile architecture with pain-free technology and uncompromising hospital sterilization.
            </p>

            {/* Quick Contact & Address Card */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Hospital Location</p>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    1st Floor, Avani Plaza, Ramayya St, Surya Rao Peta, Kakinada, AP – 533001
                  </p>
                  <a
                    href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 mt-1 font-semibold text-[11px]"
                  >
                    <span>Google Maps Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Clean 2-Column Links on Mobile */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 text-left">
            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors py-0.5 block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors py-0.5 block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/doctors" className="hover:text-white transition-colors py-0.5 block">
                    Meet Doctor
                  </Link>
                </li>
                <li>
                  <Link to="/treatments" className="hover:text-white transition-colors py-0.5 block">
                    Treatments
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors py-0.5 block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/appointment" className="text-teal-300 hover:underline font-semibold py-0.5 block">
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Treatments Links */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Treatments
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link
                    to="/appointment?treatment=Dental%20Implants%20%26%20Restorations"
                    className="hover:text-white transition-colors py-0.5 block"
                  >
                    Dental Implants
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointment?treatment=Clear%20Aligners%20%26%20Orthodontics"
                    className="hover:text-white transition-colors py-0.5 block"
                  >
                    Clear Aligners
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointment?treatment=Microscopic%20Root%20Canal%20Therapy"
                    className="hover:text-white transition-colors py-0.5 block"
                  >
                    Root Canal Therapy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointment?treatment=Smile%20Design%20%26%20Ceramic%20Veneers"
                    className="hover:text-white transition-colors py-0.5 block"
                  >
                    Smile Design
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointment?treatment=Pediatric%20%26%20Preventive%20Dentistry"
                    className="hover:text-white transition-colors py-0.5 block"
                  >
                    Pediatric Care
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    to="/treatments"
                    className="text-teal-300 hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>All Procedures</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="lg:col-span-3 space-y-3.5 text-left">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Clinic Desk & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href="tel:+919063584448"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">OPD Phone Support</span>
                  <span className="font-mono font-bold text-xs">+91 90635 84448</span>
                </div>
              </a>

              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-teal-400" />
                  <span>Consultation Timings</span>
                </div>
                <div className="pl-5 text-slate-400 space-y-0.5">
                  <p>Mon – Sat: 9:00 AM – 8:30 PM</p>
                  <p>Sun: 10:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Legal Modals */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs text-center sm:text-left">
          <p>© 2026 TRUDENT Multispeciality Dental Hospital. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-slate-700">•</span>
            <Link to="/login" className="hover:text-slate-300 transition-colors text-teal-400 font-semibold">
              Portal Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Legal Modals */}
      <LegalModal
        type="privacy"
        open={isPrivacyOpen}
        onOpenChange={setIsPrivacyOpen}
      />
      <LegalModal
        type="terms"
        open={isTermsOpen}
        onOpenChange={setIsTermsOpen}
      />
    </footer>
  );
};

export default PublicFooter;
