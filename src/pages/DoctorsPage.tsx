import React from "react";
import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import doctorImage from "@/assets/hospital-consultation.jpg";
import {
  Stethoscope,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Microscope,
  Award,
  PhoneCall,
  ArrowRight,
  Smile,
  HeartHandshake,
  FileCheck2,
  Activity,
  Layers,
  Instagram,
} from "lucide-react";

export const DoctorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary">
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <PageHeader
        badge="CLINICAL LEADERSHIP"
        title="Meet Our Doctor"
        subtitle="Dedicated dental healthcare leadership at TRUDENT Multispeciality Dental Hospital. Experience attentive, professional, and patient-focused oral treatment."
        breadcrumbs={[{ label: "Meet Our Doctor" }]}
      />

      {/* ========================================================================= */}
      {/* LARGE EXECUTIVE DOCTOR PROFILE SECTION                                    */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Heroic Doctor Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-teal-50/20 p-6 sm:p-10 lg:p-12 shadow-md relative overflow-hidden text-left">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Doctor Visual / Portrait Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative mx-auto max-w-sm lg:max-w-none">
                  {/* Photo Frame */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 group">
                    <img
                      src={doctorImage}
                      alt="Dr. Deepa Koduri conducting a patient dental consultation at TRUDENT"
                      className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                    {/* Verified Status Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Accepting New Patients</span>
                      </span>
                    </div>

                    {/* Bottom Photo Overlay Tag */}
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-sm text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white font-bold text-sm shadow-2xs">
                          DK
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                            Dr. Deepa Koduri
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Endodontist • Root Canal Specialist
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Desk Quick Badge */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      Mon – Sat: 9:00 AM – 8:30 PM
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      Kakinada
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Details & Biography Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
                      Endodontist
                    </Badge>
                    <Badge variant="outline" className="text-xs font-semibold text-slate-700 border-slate-300 bg-white">
                      Root Canal Specialist
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200">
                      TRUDENT Kakinada
                    </Badge>
                  </div>

                  <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Dr. Deepa Koduri
                  </h1>

                  <p className="text-sm sm:text-base text-primary font-semibold">
                    Endodontist • Root Canal Specialist
                  </p>
                </div>

                {/* Professional Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-y border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                        Specialization
                      </span>
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                        Endodontist
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                        Professional Focus
                      </span>
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                        Root Canal Specialist
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 font-bold">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                        Clinical Approach
                      </span>
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                        Gentle • Stress-free
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Professional Description */}
                <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  <p>
                    Dr. Deepa Koduri is the Endodontist and Root Canal Specialist at TRUDENT Multispeciality Dental Hospital. Dedicated to patient comfort and conservative clinical dentistry, she leads dental care with a gentle, stress-free, and evidence-based approach.
                  </p>
                  <p>
                    TRUDENT provides advanced dental care powered by modern technology, specializing in Laser Dentistry, Dental Implants, and Clear Aligners for precise, comfortable treatments.
                  </p>
                </div>

                {/* Clinical Areas of Practice Checklist */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Advanced Technology & Services:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Laser Dentistry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Dental Implants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Clear Aligners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>Root Canal Specialist Care</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link to="/appointment?doctor=Dr.%20Deepa%20Koduri" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto font-bold text-sm h-12 px-7 rounded-xl shadow-md hover:shadow-lg gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer transition-all"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>Book Appointment</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <a
                    href="tel:+919063584448"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 text-primary" />
                    <span>+91 9063584448</span>
                  </a>

                  <a
                    href="https://www.instagram.com/trudent_kakinada/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-pink-200 bg-pink-50/60 hover:bg-pink-100 text-xs sm:text-sm font-semibold text-pink-700 shadow-2xs transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span>@trudent_kakinada</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPREHENSIVE CONSULTATION STANDARDS                                       */}
          {/* ========================================================================= */}
          <div className="space-y-6 text-left pt-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>WHAT TO EXPECT</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Consultation Standards with Dr. Deepa Koduri
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                How every appointment is conducted to protect your oral health, time, and comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Thorough Clinical Assessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Dr. Deepa Koduri takes time to inspect teeth, gums, and bite alignment, explaining clinical findings on digital displays so you see what needs attention.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Transparent Treatment Plan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  You receive clear recommendations and itemized procedural plans before any work begins. There are no surprises or pressure to undergo unneeded procedures.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Strict Hospital Sterilization
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  All dental handpieces and instruments undergo multi-cycle autoclave sterilization in compliance with hospital hygiene protocols for your safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default DoctorsPage;
