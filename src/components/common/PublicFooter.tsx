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
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 text-xs sm:text-sm">
      {/* Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-left">
          {/* Column 1: TRUDENT Branding & Hospital Description */}
          <div className="lg:col-span-4 space-y-4">
            <TrudentLogo variant="dark" size="md" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-1">
              TRUDENT Multispeciality Dental Hospital delivers tertiary-grade dental surgery, microscopic endodontics, orthodontics, and cosmetic smile architecture with pain-free technology and uncompromising hospital sterilization.
            </p>

            {/* Location & Map Link */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Hospital Location</p>
                  <p className="text-slate-400">1st Floor, Avani Plaza, Ramayya Street, Surya Rao Peta, Kakinada, AP – 533001</p>
                  <a
                    href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline mt-1 font-semibold"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
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
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/treatments" className="hover:text-white transition-colors py-0.5 block">
                  Treatments
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors py-0.5 block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Treatments Links */}
          <div className="lg:col-span-3 space-y-3">
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
                  Clear Aligners & Braces
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment?treatment=Microscopic%20Root%20Canal%20Therapy"
                  className="hover:text-white transition-colors py-0.5 block"
                >
                  Microscopic Root Canal
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment?treatment=Smile%20Design%20%26%20Ceramic%20Veneers"
                  className="hover:text-white transition-colors py-0.5 block"
                >
                  Smile Design & Veneers
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment?treatment=Pediatric%20%26%20Preventive%20Dentistry"
                  className="hover:text-white transition-colors py-0.5 block"
                >
                  Pediatric Dentistry
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/treatments"
                  className="text-accent hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>All 8 Dental Procedures</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>
                  Clinic:{" "}
                  <a href="tel:+919063584448" className="text-white hover:text-accent font-medium">
                    +91 90635 84448
                  </a>
                </span>
              </p>

              <div className="flex items-start gap-2 pt-1 border-t border-slate-800 text-[11px]">
                <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300">Mon – Sat: 9:00 AM – 8:30 PM</p>
                  <p className="text-slate-300">Sun: 10:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar with Copyright and Legal Modals */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs text-center sm:text-left">
          <p>© 2026 TRUDENT Multispeciality Dental Hospital. All rights reserved.</p>

          <div className="flex items-center gap-6">
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
            <Link to="/login" className="hover:text-slate-300 transition-colors">
              Staff Sign In
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
