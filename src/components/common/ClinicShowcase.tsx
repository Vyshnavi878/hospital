import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  PhoneCall,
  CheckCircle2,
  Maximize2,
  Building2,
  Stethoscope,
  Microscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ClinicImage {
  id: string;
  title: string;
  category: "all" | "treatment" | "operatory" | "reception" | "facility";
  tag: string;
  description: string;
  highlights: string[];
  src: string;
  alt: string;
}

export const CLINIC_PHOTOS: ClinicImage[] = [
  {
    id: "treatment",
    title: "Micro-Endodontics & Precision Care",
    category: "treatment",
    tag: "Doctor In Action",
    description:
      "Dr. Deepa Koduri, BDS, MDS (Micro-Endodontics), conducting root canal therapy with real-time digital radiograph monitoring and dental nursing assistance.",
    highlights: [
      "Real-time Digital X-Ray Monitoring",
      "Hospital Sterilization & Full PPE",
      "Painless Micro-Endodontic Therapy",
    ],
    src: "/images/clinic/dr-deepa-treatment.png",
    alt: "Dr. Deepa Koduri treating a patient with micro-endodontics at TRUDENT",
  },
  {
    id: "operatory",
    title: "High-Tech Dental Operatory",
    category: "operatory",
    tag: "Modern Operatory",
    description:
      "Modern ergonomic dental chair with integrated UV disinfection systems, shadowless surgical lighting, and precision instruments for maximum patient comfort.",
    highlights: [
      "Ergonomic Memory Contour Chair",
      "Integrated UV Sterilization Unit",
      "Shadowless LED Operatory Light",
    ],
    src: "/images/clinic/trudent-operatory-chair.png",
    alt: "Modern dental operatory chair and UV sterilization unit at TRUDENT",
  },
  {
    id: "reception",
    title: "Reception & Hospitality Desk",
    category: "reception",
    tag: "Front Desk",
    description:
      "Elegant fluted paneling and Italian marble front desk where patients are warmly received, with organized scheduling and friendly staff.",
    highlights: [
      "Paperless Digital Check-in",
      "Warm & Respectful Atmosphere",
      "Zero-Wait Scheduled Appointments",
    ],
    src: "/images/clinic/trudent-reception.png",
    alt: "TRUDENT Dental Hospital reception desk with fluted gold and marble finish",
  },
  {
    id: "lounge",
    title: "Air-Conditioned Patient Lounge",
    category: "reception",
    tag: "Patient Lounge",
    description:
      "Spacious, stress-free waiting lounge with plush leather seating, soothing indoor plants, and a calm, quiet ambiance for accompanying family members.",
    highlights: [
      "Comfortable Leather Couches",
      "Clean, Peaceful Air-Conditioned Environment",
      "Family-Friendly Seating",
    ],
    src: "/images/clinic/trudent-waiting-lounge.png",
    alt: "TRUDENT Dental Hospital patient waiting lounge with comfortable seating",
  },
  {
    id: "signboard",
    title: "Hospital Board & Multispeciality Wings",
    category: "facility",
    tag: "Hospital Facade",
    description:
      "Official TRUDENT Multispeciality Dental Hospital identity at Avani Plaza, Ramayya Street, Kakinada — listing all 14 specialized dental care wings.",
    highlights: [
      "14 Specialized Dental Treatments",
      "Central Location on Ramayya Street",
      "Dedicated OPD & Emergency Facility",
    ],
    src: "/images/clinic/trudent-exterior-sign.png",
    alt: "TRUDENT Multispeciality Dental Hospital official signboard and specialities",
  },
];

interface ClinicShowcaseProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  showAllLink?: boolean;
}

export const ClinicShowcase: React.FC<ClinicShowcaseProps> = ({
  title = "Explore Our Hospital Facilities",
  subtitle = "Step inside TRUDENT Multispeciality Dental Hospital in Kakinada. Experience our modern operatory, micro-endodontic suite, and welcoming patient lounge.",
  badge = "GENUINE CLINIC TOUR",
  showAllLink = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos =
    selectedCategory === "all"
      ? CLINIC_PHOTOS
      : CLINIC_PHOTOS.filter((p) => p.category === selectedCategory);

  const activePhoto =
    lightboxIndex !== null ? CLINIC_PHOTOS[lightboxIndex] : null;

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % CLINIC_PHOTOS.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + CLINIC_PHOTOS.length) % CLINIC_PHOTOS.length
      );
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <Building2 className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919063584448"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors shrink-0"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
              <span>+91 90635 84448</span>
            </a>
            <Link
              to="/appointment"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs shrink-0"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Book Visit</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills (Mobile horizontally scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { key: "all", label: "All Facilities (5)" },
            { key: "treatment", label: "Doctor In Action" },
            { key: "operatory", label: "Dental Operatory" },
            { key: "reception", label: "Reception & Lounge" },
            { key: "facility", label: "Hospital Identity" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedCategory(tab.key)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 active:scale-95",
                selectedCategory === tab.key
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid (Uniform fixed-size photo display cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
          {filteredPhotos.map((photo) => {
            const originalIndex = CLINIC_PHOTOS.findIndex(
              (p) => p.id === photo.id
            );
            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(originalIndex)}
                className="group cursor-pointer rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-[390px] sm:h-[410px]"
              >
                {/* Fixed Height Image Frame */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border-white/20">
                      {photo.tag}
                    </Badge>
                  </div>

                  {/* Zoom indicator button */}
                  <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-sm opacity-90 group-hover:scale-110 transition-transform">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Fixed Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base group-hover:text-primary transition-colors leading-snug line-clamp-1">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  {/* Highlight pills */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {photo.highlights.slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Location & Direct Visit Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-teal-50/50 to-primary/5 border border-primary/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Experience These Facilities In Person
              </h4>
              <p className="text-xs text-slate-600">
                1st Floor, Avani Plaza, Ramayya Street, Surya Rao Peta, Kakinada, AP – 533001
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
            >
              View on Google Maps
            </a>
            <Link
              to="/appointment"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {lightboxIndex !== null && activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center shadow-md transition-colors"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Photo Column */}
            <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[260px] sm:min-h-[380px]">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="w-full h-full max-h-[60vh] md:max-h-[85vh] object-contain"
              />

              {/* Prev / Next Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Details Column */}
            <div className="md:w-2/5 p-5 sm:p-6 flex flex-col justify-between text-left space-y-4 overflow-y-auto bg-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                    {activePhoto.tag}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {lightboxIndex + 1} of {CLINIC_PHOTOS.length}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
                  {activePhoto.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activePhoto.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Facility Highlights:
                  </h4>
                  <ul className="space-y-1.5">
                    {activePhoto.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/appointment"
                  onClick={() => setLightboxIndex(null)}
                  className="w-full block"
                >
                  <Button className="w-full h-11 font-semibold text-xs sm:text-sm rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white shadow-xs">
                    <CalendarDays className="h-4 w-4" />
                    <span>Book Appointment Here</span>
                  </Button>
                </Link>

                <a
                  href="tel:+919063584448"
                  className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Call Hospital (+91 90635 84448)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClinicShowcase;
