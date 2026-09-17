import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import consultationImage from "@/assets/hospital-consultation.jpg";
import {
  Sparkles,
  ShieldCheck,
  Microscope,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Stethoscope,
  Smile,
  ArrowRight,
  Clock,
  MapPin,
  CalendarDays,
  PhoneCall,
  UserRound,
  FileCheck2,
  Eye,
  Shield,
  Heart,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface WhyChooseReason {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
}

const WHY_CHOOSE_REASONS: WhyChooseReason[] = [
  {
    id: "multispeciality",
    icon: Building2,
    iconColor: "bg-primary/10 text-primary",
    title: "Multispeciality Care Under One Roof",
    description:
      "Access a full spectrum of dental treatments — from routine hygiene cleanings and restorative fillings to dental implants and clear aligners — all within our centralized hospital.",
  },
  {
    id: "dedicated-doctor",
    icon: UserRound,
    iconColor: "bg-accent/10 text-accent",
    title: "Dedicated Doctor Attention",
    description:
      "Patients receive direct, uninterrupted consultations and procedure execution from our lead dental specialist, ensuring consistent clinical oversight from start to finish.",
  },
  {
    id: "sterilization",
    icon: ShieldCheck,
    iconColor: "bg-emerald-500/10 text-emerald-600",
    title: "Hospital-Grade Sterilization",
    description:
      "We adhere strictly to hospital autoclave sterilization protocols, disposable protective barriers, and surface disinfection routines for every patient appointment.",
  },
  {
    id: "transparent-planning",
    icon: FileCheck2,
    iconColor: "bg-purple-500/10 text-purple-600",
    title: "Transparent Treatment Plans",
    description:
      "You will always receive clear diagnostic explanations and written fee breakdowns upfront. We never initiate procedures without your full informed consent.",
  },
  {
    id: "modern-equipment",
    icon: Microscope,
    iconColor: "bg-teal-500/10 text-teal-600",
    title: "Modern Clinical Equipment",
    description:
      "Our operatories are equipped with contemporary digital imaging and dental precision instruments designed to make procedures efficient, accurate, and comfortable.",
  },
  {
    id: "central-location",
    icon: MapPin,
    iconColor: "bg-blue-500/10 text-blue-600",
    title: "Convenient Central Location",
    description:
      "Located at 1st Floor, Avani Plaza, Ramayya Street, Surya Rao Peta, Kakinada, Andhra Pradesh – 533001. Easily accessible by road, with on-site parking. Open Monday to Saturday: 9:00 AM – 8:30 PM. Sunday: 10:00 AM – 1:00 PM.",
  },
];

export const AboutPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1); // mobile
      } else if (width < 1024) {
        setVisibleCards(2); // tablet
      } else {
        setVisibleCards(3); // desktop
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, WHY_CHOOSE_REASONS.length - visibleCards);

  // Keep index within bounds if window resize changes visibleCards
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= maxIndex;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe support for smooth mobile experience
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45 && !isAtEnd) {
      handleNext();
    } else if (distance < -45 && !isAtStart) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary">
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <PageHeader
        badge="ABOUT OUR CLINIC"
        title="About TRUDENT"
        subtitle="TRUDENT Multispeciality Dental Hospital is dedicated to delivering professional, patient-focused dental care and healthy smiles in a modern, hygienic clinical environment."
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* ========================================================================= */}
      {/* SECTION 1: WHO WE ARE                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Building2 className="h-3.5 w-3.5" />
                <span>WHO WE ARE</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                A Dedicated Multispeciality Dental Hospital
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  <strong className="text-slate-900 font-semibold">TRUDENT Multispeciality Dental Hospital</strong> is an established dental healthcare center dedicated to providing comprehensive oral treatments under one roof. We combine specialized clinical departments, patient-centric facilities, and strict hygiene protocols to serve patients seeking reliable dental care.
                </p>
                <p>
                  As a multispeciality hospital, our clinical practice covers essential dental fields including preventive checkups, restorative dentistry, dental implants, pain-free root canals, clear orthodontic aligners, and cosmetic smile care.
                </p>
                <p>
                  We are committed to demystifying dental visits. From the front desk reception to the dental operatory, our staff ensures a calm, transparent, and respectful setting where your questions are always answered before any procedure begins.
                </p>
              </div>

              {/* Quick attribute tags */}
              <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Multispeciality Dental Departments
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Hospital-Grade Infection Control
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  In-Person Consultations
                </span>
              </div>
            </div>

            {/* Visual consultation card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 group">
                  <img
                    src={consultationImage}
                    alt="Doctor and patient consultation at TRUDENT Multispeciality Dental Hospital"
                    className="w-full h-[360px] sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-sm text-left">
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      TRUDENT Dental Consultation
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Personalized examinations, open discussion, and clinical care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: OUR APPROACH TO DENTAL CARE                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>CLINICAL METHODOLOGY</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Approach to Dental Care
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We structure every patient visit around four foundational principles that guarantee attentive care, clinical thoroughness, and personal peace of mind.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Patient-Focused Care */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all space-y-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Patient-Focused Care
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We prioritize your concerns, comfort, and preferences. Our clinical team takes time to understand your dental history and any past anxieties, ensuring you feel respected and heard.
              </p>
            </div>

            {/* Pillar 2: Professional Consultation */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-accent/40 transition-all space-y-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Professional Consultation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every visit begins with a systematic clinical evaluation. We explain our clinical observations clearly and provide transparent guidance on suitable treatment options.
              </p>
            </div>

            {/* Pillar 3: Personalized Treatment */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all space-y-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Personalized Treatment
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                There are no one-size-fits-all solutions. Treatment plans are customized specifically to your oral health requirements, personal lifestyle, and functional smile goals.
              </p>
            </div>

            {/* Pillar 4: Comfortable Dental Experience */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-purple-500/40 transition-all space-y-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Smile className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Comfortable Dental Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We make your visit as gentle and relaxing as possible. Using pain-minimizing techniques, ergonomic operatory chairs, and a supportive team, we ensure you feel at ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: OUR DENTAL CARE PHILOSOPHY                                     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Shield className="h-3.5 w-3.5" />
                <span>CORE PRINCIPLES</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Dental Care Philosophy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Realistic, ethical, and patient-first dentistry anchored in long-term oral well-being.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Principle 1: Conservative Dentistry */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Microscope className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Preserving Natural Teeth
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  We believe in conservative dentistry. Whenever possible, we focus on preserving natural tooth enamel and biological structure rather than unnecessary extraction.
                </p>
              </div>

              {/* Principle 2: Prevention First */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Prevention & Education
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Effective dental care starts before disease occurs. We emphasize routine cleanings, early diagnostic checkups, and practical oral hygiene education for home care.
                </p>
              </div>

              {/* Principle 3: Clinical Integrity */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Eye className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Honest Communication
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  We recommend only procedures that are genuinely beneficial for your oral health. You receive transparent cost estimates and clear explanations before any treatment starts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHY PATIENTS CHOOSE TRUDENT (HORIZONTAL CAROUSEL)               */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>AUTHENTIC STANDARDS</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Patients Choose TRUDENT
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Verified clinical standards, hygienic facilities, and sincere patient care that you can count on.
            </p>
          </div>

          {/* Carousel Container with Side Arrows */}
          <div className="relative flex items-center gap-2 sm:gap-4 max-w-7xl mx-auto">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isAtStart}
              aria-label="Previous reasons patients choose TRUDENT"
              className={cn(
                "shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border bg-white shadow-xs transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none",
                isAtStart
                  ? "opacity-30 cursor-not-allowed text-slate-300 border-slate-200 bg-slate-50"
                  : "cursor-pointer text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-primary hover:border-primary/40 hover:shadow-md hover:scale-105 active:scale-95"
              )}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Carousel Viewport */}
            <div
              ref={carouselRef}
              className="flex-1 overflow-hidden min-w-0 py-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl touch-pan-y"
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Why Patients Choose TRUDENT Carousel"
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Horizontal Sliding Track */}
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform items-stretch"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {WHY_CHOOSE_REASONS.map((reason, index) => {
                  const Icon = reason.icon;

                  return (
                    <div
                      key={reason.id}
                      style={{
                        flex: `0 0 ${100 / visibleCards}%`,
                        maxWidth: `${100 / visibleCards}%`,
                      }}
                      className="px-2 sm:px-3 flex shrink-0 box-border h-full"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${WHY_CHOOSE_REASONS.length}: ${reason.title}`}
                    >
                      <div className="w-full h-full rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow text-left space-y-3 flex flex-col justify-start">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", reason.iconColor)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading font-bold text-base text-slate-900">
                          {reason.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isAtEnd}
              aria-label="Next reasons patients choose TRUDENT"
              className={cn(
                "shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border bg-white shadow-xs transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary select-none",
                isAtEnd
                  ? "opacity-30 cursor-not-allowed text-slate-300 border-slate-200 bg-slate-50"
                  : "cursor-pointer text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-primary hover:border-primary/40 hover:shadow-md hover:scale-105 active:scale-95"
              )}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Carousel Position Indicator / Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
                  currentIndex === idx
                    ? "w-6 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: MEET OUR DOCTOR (PRIMARY DOCTOR)                               */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>PRIMARY DOCTOR</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Meet Our Doctor
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Meet Dr. Deepa Koduri, the primary doctor leading clinical care at TRUDENT Multispeciality Dental Hospital.
              </p>
            </div>

            {/* Single Doctor Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-teal-50/20 shadow-md p-6 sm:p-9 text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                {/* Doctor Monogram */}
                <div className="relative shrink-0">
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-teal-600 to-accent text-white font-heading font-extrabold text-3xl shadow-md">
                    DK
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-2.5 py-0.5">
                      Endodontist
                    </Badge>
                    <Badge variant="outline" className="text-xs font-semibold text-slate-700 border-slate-300 bg-white">
                      Root Canal Specialist
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Dr. Deepa Koduri
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                      Endodontist • Root Canal Specialist
                    </p>
                  </div>

                  {/* Professional Approach */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200/60 text-xs font-medium text-teal-900">
                    <span>Gentle</span>
                    <span className="text-teal-400">•</span>
                    <span>Stress-free</span>
                    <span className="text-teal-400">•</span>
                    <span>Evidence-based</span>
                  </div>

                  {/* Advanced Technology */}
                  <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                    <span className="font-medium text-slate-700 block">
                      Advanced dental care with modern technology, including:
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-slate-800">
                      <span>Laser Dentistry</span>
                      <span className="text-slate-300">•</span>
                      <span>Implants</span>
                      <span className="text-slate-300">•</span>
                      <span>Aligners</span>
                    </div>
                  </div>

                  {/* Location, Phone & Instagram */}
                  <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Kakinada</span>
                    </span>
                    <a
                      href="tel:+919063584448"
                      className="flex items-center gap-1.5 text-slate-700 hover:text-primary transition-colors"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-primary" />
                      <span>+91 9063584448</span>
                    </a>
                    <a
                      href="https://www.instagram.com/trudent_kakinada/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      <span>@trudent_kakinada</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3.5">
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <Link to="/doctors" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto text-xs sm:text-sm font-semibold rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 gap-2 h-11 px-5 cursor-pointer"
                    >
                      <UserRound className="h-4 w-4 text-slate-500" />
                      <span>Meet Our Doctor</span>
                    </Button>
                  </Link>

                  <a
                    href="https://www.instagram.com/trudent_kakinada/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/70 text-xs sm:text-sm font-semibold text-pink-700 transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span>@trudent_kakinada</span>
                  </a>
                </div>

                <Link to="/appointment?doctor=Dr.%20Deepa%20Koduri" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto text-xs sm:text-sm font-semibold rounded-xl gap-2 shadow-xs bg-primary hover:bg-primary/90 text-white h-11 px-6 cursor-pointer">
                    <CalendarDays className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;
