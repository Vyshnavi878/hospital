import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TREATMENTS_DATA, DentalTreatment } from "@/data/treatmentsData";
import {
  CalendarDays,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const TreatmentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive visible cards count based on viewport width
  const [visibleCards, setVisibleCards] = useState(() => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    if (w < 1280) return 3;
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setVisibleCards(1);
      } else if (w < 1024) {
        setVisibleCards(2);
      } else if (w < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extract supported categories present in the actual clinic dataset
  const categories = useMemo(() => {
    const set = new Set<string>();
    TREATMENTS_DATA.forEach((t) => set.add(t.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredTreatments = useMemo(() => {
    if (selectedCategory === "all") return TREATMENTS_DATA;
    return TREATMENTS_DATA.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Reset index to start whenever category filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const maxIndex = Math.max(0, filteredTreatments.length - visibleCards);

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

  // Keyboard accessibility: Left/Right arrow keys navigate when carousel is focused
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
        badge="COMPREHENSIVE DENTAL CARE"
        title="Dental Treatments & Services"
        subtitle="TRUDENT Multispeciality Dental Hospital provides comprehensive dental care across essential specialties. From preventive care to advanced restorations, our clinic is dedicated to your oral health and comfort."
        breadcrumbs={[{ label: "Treatments" }]}
      />

      {/* ========================================================================= */}
      {/* CATEGORY FILTER PILLS (SUPPORTED CLINIC CATEGORIES ONLY)                   */}
      {/* ========================================================================= */}
      <section className="py-6 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const label = cat === "all" ? `All Services (${TREATMENTS_DATA.length})` : cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HORIZONTAL TREATMENT CAROUSEL                                             */}
      {/* ========================================================================= */}
      <main className="py-10 sm:py-14 bg-white flex-1 overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-12">
          
          {/* Carousel Section Container */}
          <div className="relative">
            {/* Header / Subtitle row */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Clinical Services Catalog
                </p>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Explore Specialized Procedures
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>
                  Showing {currentIndex + 1}–{Math.min(currentIndex + visibleCards, filteredTreatments.length)} of {filteredTreatments.length}
                </span>
              </div>
            </div>

            {/* Carousel Row: Left Arrow + Carousel Track + Right Arrow */}
            <div className="flex items-center gap-2 sm:gap-4 w-full">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={isAtStart}
                aria-label="Previous treatments"
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
                className="flex-1 overflow-hidden min-w-0 py-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Dental Treatments and Services Carousel"
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Horizontal Sliding Track */}
                <div
                  className="flex transition-transform duration-500 ease-out will-change-transform"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  }}
                >
                  {filteredTreatments.map((treatment: DentalTreatment, index: number) => {
                    const Icon = treatment.icon;

                    return (
                      <div
                        key={treatment.slug}
                        style={{
                          flex: `0 0 ${100 / visibleCards}%`,
                          maxWidth: `${100 / visibleCards}%`,
                        }}
                        className="px-1.5 sm:px-2.5 flex shrink-0 box-border"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${filteredTreatments.length}: ${treatment.name}`}
                      >
                        <div className="w-full h-full group relative rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 text-left shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between space-y-5">
                          <div className="space-y-4">
                            {/* Header with Icon and Category */}
                            <div className="flex items-center justify-between">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-2xs">
                                <Icon className="h-6 w-6" />
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-semibold text-slate-600 bg-slate-50 border-slate-200"
                              >
                                {treatment.category}
                              </Badge>
                            </div>

                            {/* Title and Duration */}
                            <div>
                              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-primary transition-colors leading-snug">
                                {treatment.name}
                              </h3>
                              <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-medium">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>{treatment.estimatedDuration}</span>
                              </p>
                            </div>

                            {/* Short Description */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-4">
                              {treatment.shortDescription}
                            </p>
                          </div>

                          {/* Actions: View Details & Book Appointment */}
                          <div className="pt-4 border-t border-slate-100 space-y-2.5">
                            <Link
                              to={`/treatments/${treatment.slug}`}
                              className="w-full block"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-between h-9 px-3.5 text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 border-slate-200 rounded-xl group/btn transition-colors cursor-pointer"
                              >
                                <span>View Details</span>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>

                            <Link
                              to={`/appointment?treatment=${encodeURIComponent(treatment.name)}`}
                              className="w-full block"
                            >
                              <Button
                                size="sm"
                                className="w-full h-9 px-3.5 text-xs font-semibold rounded-xl gap-1.5 shadow-2xs bg-primary hover:bg-primary/90 text-white cursor-pointer"
                              >
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>Book Appointment</span>
                              </Button>
                            </Link>
                          </div>
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
                aria-label="Next treatments"
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

            {/* Pagination Dots / Counter Indicator */}
            {maxIndex > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 pt-6">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        currentIndex === idx
                          ? "w-6 bg-primary"
                          : "w-2 bg-slate-200 hover:bg-slate-300"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-medium text-slate-400 sm:hidden">
                  Showing {currentIndex + 1}–{Math.min(currentIndex + visibleCards, filteredTreatments.length)} of {filteredTreatments.length}
                </p>
              </div>
            )}
          </div>

          {/* Clinical Commitment Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-teal-50/10 to-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-xs">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>UNSURE WHICH TREATMENT YOU NEED?</span>
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                Book a Diagnostic Consultation with Dr. Deepa Koduri
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                During your visit, Dr. Deepa Koduri will conduct a comprehensive clinical examination, evaluate your symptoms, and explain all suitable treatment options with full fee transparency.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link to="/appointment" className="w-full md:w-auto block">
                <Button
                  size="lg"
                  className="w-full md:w-auto font-semibold text-xs sm:text-sm h-11 px-7 rounded-xl shadow-xs gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Consultation</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default TreatmentsPage;
