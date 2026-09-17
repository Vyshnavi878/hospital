import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  PhoneCall,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building,
  Navigation,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Verified Department options based on actual hospital doctors
const INQUIRY_DEPARTMENTS = [
  { value: "general", label: "General Hospital Inquiry / Reception" },
  { value: "cardiology", label: "Cardiology Department" },
  { value: "neurology", label: "Neurology Department" },
  { value: "orthopedics", label: "Orthopedics Department" },
  { value: "pediatrics", label: "Pediatrics Department" },
  { value: "dermatology", label: "Dermatology Department" },
  { value: "general-medicine", label: "General Medicine Department" },
  { value: "dentistry", label: "Dentistry Department" },
  { value: "billing", label: "Billing, Insurance & TPA Desk" },
  { value: "records", label: "Medical Records & Diagnostic Reports" },
];

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}

const INITIAL_FORM_DATA: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  subject: "",
  message: "",
};

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquiryRef, setInquiryRef] = useState("");
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  const validateField = (name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@example.com)";
        }
        return "";
      case "phone":
        if (value.trim() && !/^[+0-9\s-]{7,16}$/.test(value.trim())) {
          return "Please enter a valid contact number or leave blank";
        }
        return "";
      case "department":
        if (!value) return "Please select an inquiry category or department";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 3) return "Subject must be at least 3 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message content is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Partial<Record<keyof ContactFormData, boolean>> = {
      fullName: true,
      email: true,
      phone: true,
      department: true,
      subject: true,
      message: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    let hasError = false;

    (Object.keys(formData) as (keyof ContactFormData)[]).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      // Scroll to first invalid field if needed
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`contact-${firstErrorKey}`);
      if (el) {
        el.focus();
      }
      return;
    }

    // Client-side simulated submission
    setIsSubmitting(true);
    setTimeout(() => {
      const randomId = Math.floor(10000 + Math.random() * 90000);
      setInquiryRef(`CP-INQ-${randomId}`);
      setSubmittedData(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 750);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({});
    setIsSuccess(false);
    setSubmittedData(null);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50/60 scroll-mt-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge
            variant="outline"
            className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
          >
            Get In Touch
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Contact CarePulse Health
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Connect with our hospital reception, department coordinators, or patient assistance desk.
          </p>
        </div>

        {/* Two-Column Layout on Desktop, Single-Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Hospital Details, Working Hours & Location Area */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Address Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Hospital Address</h4>
                    <span className="text-[11px] text-slate-500">Central Mumbai Campus</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                  CarePulse Medical Center<br />
                  123 Healthcare Boulevard<br />
                  Central Mumbai, PIN 400001
                </p>
              </div>

              {/* Working Hours Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Working Hours</h4>
                    <span className="text-[11px] text-slate-500">OPD & Casualty Schedules</span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13 space-y-1">
                  <p>
                    <strong className="text-slate-800">Outpatient (OPD):</strong> Mon – Sat: 8:00 AM – 8:00 PM
                  </p>
                  <p>
                    <strong className="text-slate-800">Sunday:</strong> Prior confirmed appointments only
                  </p>
                  <p className="text-rose-700 font-medium">
                    <strong className="text-rose-700">Emergency & Trauma:</strong> Open 24 Hours / 7 Days
                  </p>
                </div>
              </div>

              {/* Phone & Emergency Hotline Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Telephone Lines</h4>
                    <span className="text-[11px] text-slate-500">Casualty & General Inquiries</span>
                  </div>
                </div>
                <div className="pl-13 space-y-2 text-xs sm:text-sm">
                  <div>
                    <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wide">
                      24/7 Emergency Casualty Hotline
                    </p>
                    <a
                      href="tel:+919063584448"
                      className="inline-flex items-center gap-1.5 font-bold text-rose-700 hover:text-rose-800 hover:underline text-sm"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>+91 90635 84448</span>
                    </a>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Hospital Reception & General Inquiries
                    </p>
                    <span className="font-semibold text-slate-800">+91 90635 84448</span>
                  </div>
                </div>
              </div>

              {/* Email Communications Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Email Communications</h4>
                    <span className="text-[11px] text-slate-500">Official Hospital Inquiries</span>
                  </div>
                </div>
                <div className="pl-13 space-y-1 text-xs sm:text-sm text-slate-600">
                  <p>
                    <span className="text-slate-500">General:</span>{" "}
                    <a
                      href="mailto:info@carepulsehealth.com"
                      className="font-medium text-slate-900 hover:text-primary underline"
                    >
                      info@carepulsehealth.com
                    </a>
                  </p>
                  <p>
                    <span className="text-slate-500">Appointments:</span>{" "}
                    <a
                      href="mailto:appointments@carepulsehealth.com"
                      className="font-medium text-slate-900 hover:text-primary underline"
                    >
                      appointments@carepulsehealth.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Hospital Location & Map Area */}
            {/* ============================================================ */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Hospital Location & Directions
                  </h4>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold text-slate-600 bg-slate-100">
                  Central Mumbai
                </Badge>
              </div>

              {/* Stylized Visual Location Area */}
              <div className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-100 p-6 overflow-hidden">
                {/* Visual grid lines representing street layout */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  </svg>
                </div>

                {/* Simulated Road and Hospital Marker */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 py-4">
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg ring-4 ring-primary/20">
                      <Building className="h-6 w-6" />
                    </span>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white ring-2 ring-white">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  </div>

                  <div>
                    <h5 className="font-heading font-bold text-sm text-slate-900">
                      CarePulse Central Medical Campus
                    </h5>
                    <p className="text-xs text-slate-600 font-medium">
                      123 Healthcare Boulevard, Mumbai
                    </p>
                  </div>

                  {/* Campus Gate Access Indicators */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold bg-white/90 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md shadow-2xs">
                      Metro Line 3 (200m)
                    </span>
                    <span className="text-[10px] font-semibold bg-rose-50 border border-rose-200 text-rose-800 px-2 py-0.5 rounded-md">
                      East Gate: 24/7 Casualty Ramp
                    </span>
                    <span className="text-[10px] font-semibold bg-white/90 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md shadow-2xs">
                      West Gate: OPD & Parking
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Open Map Directions */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=123+Healthcare+Boulevard+Central+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Open in Map / Get Directions</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Contact CarePulse Health Form */}
          {/* ============================================================ */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Form Header */}
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                      Send an Inquiry or Feedback
                    </h3>
                    <Badge variant="outline" className="text-[11px] font-medium text-slate-600 bg-slate-50">
                      Response in 24h
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Have a question regarding clinical departments, patient admissions, or hospital services? Fill in the details below.
                  </p>
                </div>

                {/* Emergency Warning Banner within form */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Urgent medical situation?</strong> Do not use this contact form for emergencies. Please call our 24/7 Casualty Hotline directly at{" "}
                    <a
                      href="tel:+919063584448"
                      className="font-bold text-rose-700 underline hover:text-rose-800"
                    >
                      +91 90635 84448
                    </a>.
                  </div>
                </div>

                {/* Success State */}
                {isSuccess && submittedData ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center space-y-4 animate-fade-in">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-xs">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                        Inquiry Received Successfully
                      </h4>
                      <p className="text-xs font-semibold text-emerald-800">
                        Reference Number: <span className="font-mono">{inquiryRef}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-emerald-100 text-left text-xs space-y-1.5 text-slate-600 max-w-md mx-auto">
                      <p>
                        <strong className="text-slate-900">Name:</strong> {submittedData.fullName}
                      </p>
                      <p>
                        <strong className="text-slate-900">Email:</strong> {submittedData.email}
                      </p>
                      <p>
                        <strong className="text-slate-900">Department:</strong>{" "}
                        {INQUIRY_DEPARTMENTS.find((d) => d.value === submittedData.department)?.label ||
                          submittedData.department}
                      </p>
                      <p>
                        <strong className="text-slate-900">Subject:</strong> {submittedData.subject}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting CarePulse Health. Our patient coordination desk will review your inquiry and respond to{" "}
                      <strong>{submittedData.email}</strong> within 1 business day.
                    </p>

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="text-xs font-semibold h-9 px-5 border-slate-300 hover:bg-slate-100 cursor-pointer"
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Form Fields */
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-fullName" className="text-xs font-semibold text-slate-700">
                          Full Name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="contact-fullName"
                          name="fullName"
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          disabled={isSubmitting}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          onBlur={() => handleBlur("fullName")}
                          className={cn(
                            "h-10 text-xs sm:text-sm",
                            touched.fullName && errors.fullName && "border-rose-500 focus-visible:ring-rose-500"
                          )}
                          aria-invalid={!!(touched.fullName && errors.fullName)}
                          aria-describedby={touched.fullName && errors.fullName ? "fullName-error" : undefined}
                        />
                        {touched.fullName && errors.fullName && (
                          <p id="fullName-error" className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-email" className="text-xs font-semibold text-slate-700">
                          Email Address <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="e.g. rahul@example.com"
                          value={formData.email}
                          disabled={isSubmitting}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          className={cn(
                            "h-10 text-xs sm:text-sm",
                            touched.email && errors.email && "border-rose-500 focus-visible:ring-rose-500"
                          )}
                          aria-invalid={!!(touched.email && errors.email)}
                          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                        />
                        {touched.email && errors.email && (
                          <p id="email-error" className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone & Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone Number (Optional) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700">
                            Phone Number
                          </Label>
                          <span className="text-[10px] text-slate-400">Optional</span>
                        </div>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phone}
                          disabled={isSubmitting}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          className={cn(
                            "h-10 text-xs sm:text-sm",
                            touched.phone && errors.phone && "border-rose-500 focus-visible:ring-rose-500"
                          )}
                          aria-invalid={!!(touched.phone && errors.phone)}
                          aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                        />
                        {touched.phone && errors.phone && (
                          <p id="phone-error" className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Department / Category */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-department" className="text-xs font-semibold text-slate-700">
                          Inquiry Department <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={formData.department}
                          disabled={isSubmitting}
                          onValueChange={(val) => handleInputChange("department", val)}
                        >
                          <SelectTrigger
                            id="contact-department"
                            className={cn(
                              "h-10 text-xs sm:text-sm",
                              touched.department && errors.department && "border-rose-500 focus:ring-rose-500"
                            )}
                            onBlur={() => handleBlur("department")}
                          >
                            <SelectValue placeholder="Select hospital department" />
                          </SelectTrigger>
                          <SelectContent>
                            {INQUIRY_DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value} className="text-xs">
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {touched.department && errors.department && (
                          <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {errors.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700">
                        Inquiry Subject <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        placeholder="e.g. Question regarding Cardiology consultation schedule"
                        value={formData.subject}
                        disabled={isSubmitting}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        onBlur={() => handleBlur("subject")}
                        className={cn(
                          "h-10 text-xs sm:text-sm",
                          touched.subject && errors.subject && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                        aria-invalid={!!(touched.subject && errors.subject)}
                        aria-describedby={touched.subject && errors.subject ? "subject-error" : undefined}
                      />
                      {touched.subject && errors.subject && (
                        <p id="subject-error" className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contact-message" className="text-xs font-semibold text-slate-700">
                          Message Details <span className="text-rose-500">*</span>
                        </Label>
                        <span className="text-[10px] text-slate-400">Min 10 characters</span>
                      </div>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        placeholder="Please write your inquiry or feedback clearly so our patient desk can assist you accurately..."
                        value={formData.message}
                        disabled={isSubmitting}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        onBlur={() => handleBlur("message")}
                        className={cn(
                          "text-xs sm:text-sm resize-none",
                          touched.message && errors.message && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                        aria-invalid={!!(touched.message && errors.message)}
                        aria-describedby={touched.message && errors.message ? "message-error" : undefined}
                      />
                      {touched.message && errors.message && (
                        <p id="message-error" className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button with Loading State */}
                    <div className="pt-2">
                      <Button
                        id="contact-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto h-11 px-8 font-semibold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Submitting Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Hospital Inquiry</span>
                          </>
                        )}
                      </Button>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Your information is securely handled in accordance with hospital patient privacy protocols.
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
