import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TREATMENTS_DATA } from "@/data/treatmentsData";
import {
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  PhoneCall,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  HeartHandshake,
  FileCheck2,
} from "lucide-react";

export const TreatmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const treatment = TREATMENTS_DATA.find((t) => t.slug === slug);

  if (!treatment) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Treatment Not Found
            </h2>
            <p className="text-sm text-slate-600">
              The treatment you are looking for does not exist or has been relocated.
            </p>
            <Link to="/treatments">
              <Button className="rounded-xl font-semibold text-xs sm:text-sm">
                Back to All Treatments
              </Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const Icon = treatment.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary pb-16 md:pb-0">
      <PublicNavbar />

      {/* Hero Header */}
      <PageHeader
        badge={treatment.category}
        title={treatment.name}
        subtitle={treatment.shortDescription}
        breadcrumbs={[
          { label: "Treatments", href: "/treatments" },
          { label: treatment.name },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          {/* Top Quick Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  {treatment.category}
                </span>
                <h2 className="font-heading font-bold text-base sm:text-xl text-slate-900 leading-snug">
                  {treatment.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-white px-3 py-2 rounded-xl border border-slate-200">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                {treatment.estimatedDuration}
              </span>
              <Link to={`/appointment?treatment=${encodeURIComponent(treatment.name)}`}>
                <Button size="sm" className="w-full sm:w-auto h-10 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Book This Treatment</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Section 1: Treatment Overview */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>CLINICAL DETAILS</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              Treatment Overview
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {treatment.overview}
            </p>
          </section>

          {/* Section 2: Who It May Be Suitable For */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-bold text-accent">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>CANDIDACY & INDICATIONS</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              Who It May Be Suitable For
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              During your clinical consultation, Dr. Deepa Koduri will examine your oral health to confirm if this treatment is right for you. Common indications include:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {treatment.suitableFor.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: General Process */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>STEP-BY-STEP</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              General Process
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              A standard walkthrough of how this procedure is carefully performed at TRUDENT Multispeciality Dental Hospital:
            </p>

            <div className="space-y-4 pt-1">
              {treatment.generalProcess.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-mono font-bold text-sm shadow-xs">
                    {stepItem.step}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {stepItem.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {stepItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Important Considerations */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>PATIENT GUIDANCE</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              Important Considerations
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Key expectations, clinical variables, and home-care practices to keep in mind:
            </p>

            <div className="space-y-3 pt-1">
              {treatment.considerations.map((note, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 text-slate-800"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Lead Specialist Consultation Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-teal-50/20 to-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-left shadow-xs">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xs shrink-0 bg-slate-100">
                <img
                  src="/images/clinic/dr-deepa-portrait.png"
                  alt="Dr. Deepa Koduri, BDS, MDS"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary tracking-wide uppercase block">
                  Lead Clinical Specialist
                </span>
                <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  Consult Dr. Deepa Koduri for this Procedure
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  BDS, MDS (Micro-Endodontics) • Gentle, evidence-based care in Kakinada
                </p>
              </div>
            </div>
            <Link to="/appointment" className="shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 px-6 text-xs font-bold rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-xs">
                <CalendarDays className="h-4 w-4" />
                <span>Book This Treatment</span>
              </Button>
            </Link>
          </div>

          {/* Back to Treatments link */}
          <div className="pt-2">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Dental Treatments</span>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default TreatmentDetailPage;
