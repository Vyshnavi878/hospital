import React from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { DoctorReelsSection } from "@/components/common/DoctorReelsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dental.jpg";
import {
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles,
  Stethoscope,
  Smile,
  Microscope,
  PhoneCall,
  UserRound,
  ChevronRight,
  HeartHandshake,
  Activity,
  Layers,
  Award,
  Instagram,
} from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary pb-16 md:pb-0">
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-teal-50/20 to-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100">
        {/* Subtle decorative glowing background blurs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-32 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="tracking-wide uppercase font-bold text-[11px] sm:text-xs">
                  TRUDENT MULTISPECIALITY DENTAL HOSPITAL
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                  Complete Dental Care for a{" "}
                  <span className="bg-gradient-to-r from-primary via-teal-600 to-accent bg-clip-text text-transparent">
                    Healthier, Happier Smile
                  </span>
                </h1>
              </div>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Providing dedicated, professional dental care and patient-focused treatment across modern dental services. From preventive oral checkups to advanced restorations, our clinic is committed to your lifelong health, comfort, and confident smile.
              </p>

              {/* Primary & Secondary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link to="/appointment" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto font-semibold text-sm h-12 px-7 rounded-xl shadow-md hover:shadow-lg transition-all gap-2.5 bg-primary hover:bg-primary/90 text-white cursor-pointer group"
                  >
                    <CalendarDays className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>Book Appointment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link to="/doctors" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto font-semibold text-sm h-12 px-7 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 transition-all cursor-pointer gap-2"
                  >
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span>Meet Our Doctor</span>
                  </Button>
                </Link>
              </div>

              {/* Supporting Highlights Checklist */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-600 border-t border-slate-200/80">
                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-slate-800">Professional Dental Care</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-slate-800">Patient-Focused Treatment</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="h-6 w-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-slate-800">Modern Dental Services</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual (Authentic Hospital Visual) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-md -z-10" />

                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100 group">
                  <img
                    src={heroImage}
                    alt="TRUDENT Multispeciality Dental Hospital Operatory Suite"
                    className="w-full h-[380px] sm:h-[430px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle lighting gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                  {/* Top Live Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Consultations Open Today</span>
                    </span>
                  </div>

                  {/* Floating Trust Card featuring Dr. Deepa Koduri */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-left">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-primary/25 shadow-xs shrink-0 bg-slate-100">
                        <img
                          src="/images/clinic/dr-deepa-portrait.png"
                          alt="Dr. Deepa Koduri, BDS, MDS"
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                            Dr. Deepa Koduri, BDS, MDS
                          </h4>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2 py-0.5 shrink-0">
                            Chief Specialist
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                          Root Canal Treatment Specialist • Micro-Endodontics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. QUICK INTRODUCTION                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3 w-3" />
                <span>QUICK INTRODUCTION</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                About TRUDENT Multispeciality Dental Hospital
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                TRUDENT Multispeciality Dental Hospital is dedicated to delivering high-quality, compassionate dental care in a welcoming, hygienic clinical setting. We believe that good oral healthcare should be accessible, comfortable, and personalized for every patient.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                By combining contemporary dental equipment, hospital-grade autoclave sterilization, and a gentle, communicative clinical approach, our focus is helping you achieve healthy teeth and gums for life.
              </p>

              <div className="pt-2">
                <Link to="/about">
                  <Button
                    size="default"
                    className="font-semibold text-xs sm:text-sm px-6 h-11 rounded-xl shadow-xs gap-2 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white group"
                  >
                    <span>About Us</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Pillars Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all p-5 space-y-2.5 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Patient Comfort
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gentle treatment methods and clear explanations before every procedure to ensure an anxiety-free visit.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all p-5 space-y-2.5 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Microscope className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Modern Equipment
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Digital diagnostic tools and clinical precision instruments to support accurate, gentle care.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all p-5 space-y-2.5 text-left sm:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Strict Sterilization
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hospital-grade autoclave sterilization and clean infection-control protocols maintained for every single patient consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TREATMENTS PREVIEW                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Smile className="h-3.5 w-3.5" />
                <span>OUR SERVICES</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Selected Dental Treatments
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Explore key treatment categories offered at TRUDENT for your complete dental health and rehabilitation.
              </p>
            </div>

            <Link to="/treatments" className="shrink-0">
              <Button
                variant="outline"
                className="font-semibold text-xs sm:text-sm border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 rounded-xl gap-2 cursor-pointer h-11 px-5 shadow-2xs group transition-all"
              >
                <span>View All Treatments</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-600 group-hover:text-slate-900" />
              </Button>
            </Link>
          </div>

          {/* 4 Selected Treatment Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Dental Implants */}
            <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-600">
                    Restorative
                  </Badge>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-primary transition-colors">
                    Dental Implants
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Permanent tooth replacement designed to restore natural chewing function, jawbone support, and aesthetic appearance.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Clear Aligners */}
            <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-xs hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Smile className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-600">
                    Orthodontics
                  </Badge>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-accent transition-colors">
                    Clear Aligners
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Discreet orthodontic alignment using clear removable trays for comfortable, modern teeth straightening.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Root Canal Therapy */}
            <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-xs hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Microscope className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-600">
                    Endodontics
                  </Badge>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Root Canal Therapy
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Careful endodontic cleaning and disinfection to relieve acute pain, eliminate infection, and preserve your natural tooth structure.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 4: Cosmetic & Preventive */}
            <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-xs hover:shadow-lg hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide bg-slate-100 text-slate-600">
                    Preventive & Esthetics
                  </Badge>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                    Cosmetic & Preventive
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Professional scaling, polish, teeth whitening, ceramic veneers, and preventive cavity care for radiant oral health.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DOCTOR SUGGESTIONS & INSTAGRAM REELS SHOWCASE                          */}
      {/* ========================================================================= */}
      <DoctorReelsSection />

      {/* ========================================================================= */}
      {/* 4. WHY CHOOSE TRUDENT (GENUINE CLINICAL STANDARDS - NO FAKE STATS)         */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>OUR CLINICAL VALUES</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose TRUDENT
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear, capability-based standards that guide our clinical practice and care delivery every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Value 1: Professional Dental Care */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Professional Dental Care
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Thorough dental examinations, clear diagnostic assessments, and treatment plans focused on long-term oral health.
              </p>
            </div>

            {/* Value 2: Patient-Focused Treatment */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Patient-Focused Treatment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                We take time to listen to your dental symptoms, respect your comfort levels, and explain all procedural steps beforehand.
              </p>
            </div>

            {/* Value 3: Modern Equipment */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Microscope className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Modern Dental Equipment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Contemporary digital imaging and precision instruments to support accurate diagnoses and gentle treatment delivery.
              </p>
            </div>

            {/* Value 4: Hospital Sterilization */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-shadow space-y-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Hospital Sterilization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Hospital autoclave sterilization standards and stringent hygiene protocols to ensure absolute patient safety and clean operatory rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. APPOINTMENT CTA                                                       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-teal-200 backdrop-blur-xs">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>APPOINTMENTS & CONSULTATIONS</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ready to Take Care of Your Smile?
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Schedule your consultation with our dental team at a time that works best for you. We look forward to welcoming you to TRUDENT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/appointment" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold text-sm h-12 px-8 rounded-xl shadow-lg gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Book Appointment</span>
              </Button>
            </Link>

            <a
              href="tel:+919063584448"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-white transition-colors backdrop-blur-xs shadow-sm"
            >
              <PhoneCall className="h-4 w-4 text-teal-300" />
              <span>Reception: +91 90635 84448</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LOCATION PREVIEW                                                      */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-teal-50/10 to-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-xs">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <MapPin className="h-4 w-4 text-primary" />
                <span>CLINIC LOCATION</span>
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                1st Floor, Avani Plaza, Ramayya Street, Kakinada
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Situated at D.No. 12-1-15/16, Ramayya Street, Surya Rao Peta, opposite Pindala Cheruvu, near Balatripura Sundari Temple, Kakinada, Andhra Pradesh – 533001. Open Monday to Saturday: 9:00 AM – 8:30 PM. Sunday: 10:00 AM – 1:00 PM.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all cursor-pointer group"
              >
                <span>Get Directions</span>
                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default HomePage;
