import React from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  CalendarDays,
  Building2,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const googleMapsUrl = "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9";
  const embedMapUrl =
    "https://maps.google.com/maps?q=16.9592884,82.2340332&hl=en&z=17&output=embed";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary">
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <PageHeader
        badge="GET IN TOUCH"
        title="Contact TRUDENT"
        subtitle="Find our clinic location, verified contact numbers, operating hours, and directions to TRUDENT Multispeciality Dental Hospital."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN CONTACT LAYOUT: LEFT (INFO) & RIGHT (MAP)                   */}
      {/* ========================================================================= */}
      <main className="py-12 sm:py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch text-left">
            {/* LEFT COLUMN: CONTACT INFORMATION */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>HOSPITAL LOCATION & DESK</span>
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Trudent Multi Speciality Dental Hospital
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Visit us in person or reach our reception desk directly for appointment scheduling and clinical inquiries.
                  </p>
                </div>

                {/* 1. Clinic Address Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>Clinic Address</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    1st Floor, Avani Plaza, D.No. 12-1-15/16, Ramayya Street,
                    <br />
                    Opposite Pindala Cheruvu, Near Balatripura Sundari Temple,
                    <br />
                    Surya Rao Peta, Kakinada, Andhra Pradesh - 533001
                  </p>
                </div>

                {/* 2. Verified Phone Number Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>Phone Number</span>
                  </div>
                  <div>
                    <a
                      href="tel:+919063584448"
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-primary transition-colors inline-block"
                    >
                      +91 90635 84448
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Call our clinic reception to confirm timings or schedule your consultation.
                    </p>
                  </div>
                </div>

                {/* 3. Verified Opening Hours Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Opening Hours</span>
                  </div>
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                      <span className="text-slate-600">Monday – Saturday:</span>
                      <strong className="text-slate-900 font-semibold">9:00 AM – 8:30 PM</strong>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-600">Sunday:</span>
                      <strong className="text-slate-900 font-semibold">10:00 AM – 1:00 PM</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Get Directions & Book Appointment */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 rounded-xl font-semibold text-xs sm:text-sm border-slate-300 text-slate-800 hover:bg-slate-50 gap-2 cursor-pointer shadow-2xs"
                  >
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>Get Directions</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </a>

                <Link to="/appointment" className="w-full block">
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-xl font-semibold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white gap-2 shadow-xs cursor-pointer"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: GOOGLE MAPS EMBED & LOCATION PREVIEW */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-100 flex-1 min-h-[420px] lg:min-h-[520px] flex flex-col">
                {/* Embedded Map iframe */}
                <iframe
                  title="Trudent Multi Speciality Dental Hospital Kakinada Google Maps Location"
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  className="w-full flex-1 border-0 min-h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Bottom Overlay Summary Bar */}
                <div className="p-4 sm:p-5 bg-white border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-0 text-[11px] font-bold px-2 py-0.5">
                        Google Maps Location
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        Kakinada, Andhra Pradesh
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      Avani Plaza, Ramayya St, Surya Rao Peta
                    </p>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ContactPage;
