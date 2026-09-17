import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, Doctor, Appointment, normalizeTime } from "@/context/AppointmentsContext";
import {
  Video,
  MapPin,
  CalendarDays,
  Clock,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Sun,
  Sunset,
  Printer,
  ExternalLink,
  User,
  Phone,
  Mail,
  Stethoscope,
  RotateCcw,
  AlertCircle,
  Check,
  Building2,
  Award,
} from "lucide-react";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────────
const CLINIC_ADDRESS = "1st Floor, Avani Plaza, Ramayya Street, Kakinada, AP – 533001";
const CLINIC_PHONE = "+91 9063584448";
const CLINIC_MAPS_URL = "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9";
const DOCTOR_NAME = "Dr. Deepa Koduri";
const DOCTOR_ROLE = "Endodontist";
const DOCTOR_SPECIALTY = "Root Canal Specialist";
const CONSULTATION_FEE = 600;

// Time Slots
const MORNING_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
const AFTERNOON_SLOTS = ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"];

// Dental Treatments specific to TRUDENT
interface DentalTreatmentOption {
  id: string;
  name: string;
  badge?: string;
  description: string;
}

const DENTAL_TREATMENTS: DentalTreatmentOption[] = [
  {
    id: "dental-consultation",
    name: "Dental Consultation",
    badge: "Routine Care",
    description: "Comprehensive dental examination and personalized oral hygiene evaluation.",
  },
  {
    id: "root-canal",
    name: "Root Canal Consultation",
    badge: "Specialist Care",
    description: "Expert endodontic assessment, pain diagnosis, and root canal therapy.",
  },
  {
    id: "tooth-pain",
    name: "Tooth Pain",
    badge: "Urgent Care",
    description: "Priority evaluation for acute or persistent toothache and dental discomfort.",
  },
  {
    id: "cleaning",
    name: "Dental Cleaning",
    badge: "Preventive",
    description: "Professional ultrasonic scaling, plaque removal, and tooth polishing.",
  },
  {
    id: "sensitivity",
    name: "Tooth Sensitivity",
    badge: "Evaluation",
    description: "Diagnostic check for enamel wear, gum recession, or nerve sensitivity.",
  },
  {
    id: "examination",
    name: "Dental Examination",
    badge: "Preventive",
    description: "Routine visual checkup, diagnostic x-ray guidance, and cavity detection.",
  },
  {
    id: "implants",
    name: "Implant Consultation",
    badge: "Advanced",
    description: "Permanent titanium implant consultation to restore missing teeth naturally.",
  },
  {
    id: "aligners",
    name: "Aligners Consultation",
    badge: "Orthodontics",
    description: "Clear aligner therapy assessment for seamless smile straightening.",
  },
  {
    id: "other",
    name: "Other",
    badge: "Inquiry",
    description: "Other dental concerns, emergency visits, or customized treatment plans.",
  },
];

type Step = "consultation" | "treatment_date" | "time" | "details" | "review" | "confirmed";

const STEP_ITEMS = [
  { id: "consultation", label: "1. Consultation Type" },
  { id: "treatment_date", label: "2. Treatment & Date" },
  { id: "time", label: "3. Pick Time" },
  { id: "details", label: "4. Patient Details" },
  { id: "review", label: "5. Review" },
] as const;

export interface BookAppointmentViewProps {
  onBooked: () => void;
  preselectedDoctor?: Doctor | null;
}

export const BookAppointmentView: React.FC<BookAppointmentViewProps> = ({ onBooked }) => {
  const { appointments, addAppointment, isSlotBooked } = useAppointments();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("consultation");

  // Step 1: Consultation Type
  const [consultationType, setConsultationType] = useState<"in-clinic" | "online">("in-clinic");

  // Step 2: Treatment & Date
  const [selectedTreatment, setSelectedTreatment] = useState<string>("Dental Consultation");
  const [treatmentNotes, setTreatmentNotes] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Step 3: Pick Time
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Step 4: Patient Details (Pre-populated from profile, strictly NO password)
  const [patientDetails, setPatientDetails] = useState(() => {
    const savedName = localStorage.getItem("username") || "Sarah Johnson";
    const savedEmail = localStorage.getItem("userEmail") || "sarah.johnson@example.com";
    const savedPhone = localStorage.getItem("userPhone") || "+91 98480 22338";
    const savedAge = localStorage.getItem("userAge") || "32";
    const savedGender = localStorage.getItem("userGender") || "Female";
    return {
      fullName: savedName,
      age: savedAge,
      gender: savedGender,
      phone: savedPhone,
      email: savedEmail,
      additionalNotes: "",
    };
  });

  // Step 5 / Confirmed State
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const today = startOfDay(new Date());

  // Step index for progress indicator
  const stepIndex = ["consultation", "treatment_date", "time", "details", "review"].indexOf(step);

  // Selected date formatted as yyyy-MM-dd string
  const selectedDateStr = useMemo(() => {
    return selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  }, [selectedDate]);

  // Check if a time slot is already booked across ANY appointment type for Dr. Deepa Koduri
  const checkSlotOccupied = (timeStr: string): boolean => {
    if (!selectedDateStr) return false;
    return isSlotBooked(selectedDateStr, timeStr, DOCTOR_NAME);
  };

  // Handle slot selection
  const handleSelectTime = (slot: string) => {
    if (checkSlotOccupied(slot)) return;
    setSelectedTime(slot);
  };

  // Final confirmation with availability verification
  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Please select both date and time", variant: "destructive" });
      setStep("time");
      return;
    }

    if (!patientDetails.fullName.trim() || !patientDetails.phone.trim()) {
      toast({ title: "Please fill in patient name and phone number", variant: "destructive" });
      setStep("details");
      return;
    }

    // Backend availability check right before booking to prevent race conditions
    if (isSlotBooked(selectedDateStr, selectedTime, DOCTOR_NAME)) {
      toast({
        title: "Slot No Longer Available",
        description: "This time slot was just booked. Please choose an available time slot.",
        variant: "destructive",
      });
      setSelectedTime("");
      setStep("time");
      return;
    }

    setIsSubmitting(true);

    const patientId = Number(localStorage.getItem("userId") || "1");
    const newAppointmentId = Date.now();

    const newAppt: Appointment = {
      id: newAppointmentId,
      patient_name: patientDetails.fullName.trim(),
      patient_id: patientId,
      doctor_name: DOCTOR_NAME,
      appointment_date: selectedDateStr,
      appointment_time: selectedTime,
      status: "confirmed",
      treatment: selectedTreatment,
      appointment_type: consultationType === "in-clinic" ? "in-person" : "video",
      room: consultationType === "in-clinic" ? "TRUDENT Multispeciality Dental Hospital, Room 101" : undefined,
      fee: CONSULTATION_FEE,
      notes: [treatmentNotes, patientDetails.additionalNotes].filter(Boolean).join(" | ") || undefined,
      patient_age: patientDetails.age,
      patient_gender: patientDetails.gender,
      patient_phone: patientDetails.phone.trim(),
      patient_email: patientDetails.email.trim(),
      // Real valid consultation links only exist once generated or provided by clinic
      meet_link: undefined,
    };

    addAppointment(newAppt);
    setConfirmedAppt(newAppt);
    setIsSubmitting(false);

    toast({
      title: "Appointment Confirmed!",
      description: `Your dental appointment with ${DOCTOR_NAME} on ${format(selectedDate, "MMM d, yyyy")} at ${selectedTime} is confirmed.`,
    });

    setStep("confirmed");
  };

  const resetBookingFlow = () => {
    setStep("consultation");
    setConsultationType("in-clinic");
    setSelectedTreatment("Dental Consultation");
    setTreatmentNotes("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setConfirmedAppt(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* ─── Compact Doctor Profile Card (Always visible across booking flow, informational only) ─── */}
      {step !== "confirmed" && (
        <Card className="border border-sky-100 bg-gradient-to-r from-sky-50/70 via-white to-teal-50/40 shadow-sm overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-lg font-bold text-slate-900">{DOCTOR_NAME}</h2>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
                      {DOCTOR_ROLE}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[11px]">
                      {DOCTOR_SPECIALTY}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                    <span>Gentle • Stress-free • Evidence-based</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="font-medium text-slate-700">Advanced Technology: Laser Dentistry • Implants • Aligners</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>Kakinada</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <a href={`tel:${CLINIC_PHONE}`} className="hover:text-primary transition-colors font-mono">
                    {CLINIC_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Main Header & Steps Indicator ─── */}
      {step !== "confirmed" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Book an Appointment</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Schedule your dental consultation with {DOCTOR_NAME}.
              </p>
            </div>

            {/* Stepper Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-medium text-muted-foreground overflow-x-auto pb-1 max-w-full no-scrollbar">
              {STEP_ITEMS.map((item, idx) => {
                const isActive = step === item.id;
                const isPassed = idx < stepIndex;
                return (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      disabled={!isPassed && !isActive}
                      onClick={() => isPassed && setStep(item.id as Step)}
                      className={cn(
                        "px-2.5 py-1 rounded-full whitespace-nowrap transition-all",
                        isActive && "bg-primary text-primary-foreground font-semibold shadow-xs",
                        isPassed && "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer",
                        !isActive && !isPassed && "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                      )}
                    >
                      {item.label}
                    </button>
                    {idx < STEP_ITEMS.length - 1 && <span className="text-muted-foreground/40">→</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i <= stepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 1: CONSULTATION TYPE                                                 */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "consultation" && (
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Select Consultation Type</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose how you would like to consult with {DOCTOR_NAME} at TRUDENT Dental Hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* In-Clinic Option */}
              <div
                onClick={() => setConsultationType("in-clinic")}
                className={cn(
                  "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 text-left relative",
                  consultationType === "in-clinic"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card hover:bg-muted/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] bg-sky-50 text-sky-700 border-sky-200">
                      Standard OPD
                    </Badge>
                    {consultationType === "in-clinic" && (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    1. In-Clinic Consultation
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Visit TRUDENT Multispeciality Dental Hospital for a comprehensive in-person dental evaluation, clinical diagnostics, and treatment planning.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{CLINIC_ADDRESS}</span>
                </div>
              </div>

              {/* Online Consultation Option */}
              <div
                onClick={() => setConsultationType("online")}
                className={cn(
                  "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 text-left relative",
                  consultationType === "online"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card hover:bg-muted/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] bg-teal-50 text-teal-700 border-teal-200">
                      Telehealth
                    </Badge>
                    {consultationType === "online" && (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    2. Online Consultation
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Secure video consultation with {DOCTOR_NAME}. Consult remotely for second opinions, symptom assessment, or post-treatment reviews.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Private & encrypted remote telehealth session</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                onClick={() => setStep("treatment_date")}
                className="gap-2 px-6 font-semibold"
              >
                Continue to Treatment & Date
                <span>→</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 2: TREATMENT & DATE                                                  */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "treatment_date" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("consultation")}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Consultation Type
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Selected Format:</span>
              <Badge variant="outline" className="text-xs font-semibold capitalize bg-primary/10 text-primary border-primary/20">
                {consultationType === "in-clinic" ? "In-Clinic Consultation" : "Online Video Consultation"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Treatment Selection (7 cols) */}
            <Card className="lg:col-span-7 border border-border bg-card shadow-sm">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-base text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Select Dental Treatment / Reason
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose the primary dental concern or service required for this appointment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {DENTAL_TREATMENTS.map((item) => {
                    const isSelected = selectedTreatment === item.name;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTreatment(item.name)}
                        className={cn(
                          "p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                            : "border-border hover:border-primary/40 bg-card hover:bg-muted/10"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs text-foreground leading-tight">
                            {item.name}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Notes input */}
                <div className="space-y-1.5 pt-2 border-t border-border/70">
                  <Label className="text-xs font-semibold text-foreground">
                    Specific Symptoms or Additional Notes (Optional)
                  </Label>
                  <Textarea
                    placeholder="e.g., Pain in lower right molar, sensitive to cold liquids, routine follow-up"
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Right: Date Picker (5 cols) */}
            <Card className="lg:col-span-5 border border-border bg-card shadow-sm flex flex-col justify-between">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-base text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" /> Select Available Date
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    TRUDENT operates Monday to Saturday (Sundays closed).
                  </p>
                </div>

                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date)}
                    disabled={(date) => date < today || date.getDay() === 0}
                    className="p-2 pointer-events-auto rounded-xl border border-border/60 bg-muted/20"
                  />
                </div>

                {selectedDate ? (
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-center">
                    <p className="text-xs font-semibold text-primary">
                      Selected Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-xs text-muted-foreground italic">
                    Click an available date on the calendar above
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setStep("consultation")}>
              Back
            </Button>
            <Button
              disabled={!selectedDate || !selectedTreatment}
              onClick={() => {
                setSelectedTime("");
                setStep("time");
              }}
              className="gap-2 px-6 font-semibold"
            >
              Continue to Pick Time
              <span>→</span>
            </Button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 3: PICK TIME                                                         */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "time" && selectedDate && (
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("treatment_date")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 -ml-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Treatment & Date
                </Button>
                <h2 className="font-heading text-lg font-bold text-foreground">Select Appointment Time Slot</h2>
                <p className="text-xs text-muted-foreground">
                  Available slots for <strong>{format(selectedDate, "EEEE, MMMM d, yyyy")}</strong> with {DOCTOR_NAME}
                </p>
              </div>

              {/* Slot Legend */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-muted-foreground">Booked (Occupied)</span>
                </div>
              </div>
            </div>

            {/* Single Doctor Notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                TRUDENT operates with dedicated single-doctor availability ({DOCTOR_NAME}). In-clinic visits and online consultations share the same schedule. Booked slots are locked for all consultation types.
              </span>
            </div>

            {/* Morning Sessions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Sun className="h-3.5 w-3.5 text-amber-500" /> Morning Sessions (09:00 AM – 12:00 PM)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {MORNING_SLOTS.map((time) => {
                  const isBooked = checkSlotOccupied(time);
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={isSelected ? "default" : isBooked ? "secondary" : "outline"}
                      size="sm"
                      disabled={isBooked}
                      onClick={() => handleSelectTime(time)}
                      className={cn(
                        "h-12 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all relative",
                        !isBooked && !isSelected && "hover:border-primary hover:text-primary hover:bg-primary/5",
                        isSelected && "shadow-xs font-bold ring-2 ring-primary ring-offset-1",
                        isBooked && "opacity-50 cursor-not-allowed border-dashed bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <span className={cn(isBooked && "line-through")}>{time}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider">
                        {isBooked ? (
                          <span className="text-destructive font-bold">Booked</span>
                        ) : isSelected ? (
                          "Selected"
                        ) : (
                          "Available"
                        )}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Sessions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Sunset className="h-3.5 w-3.5 text-orange-500" /> Afternoon Sessions (02:00 PM – 06:00 PM)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {AFTERNOON_SLOTS.map((time) => {
                  const isBooked = checkSlotOccupied(time);
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={isSelected ? "default" : isBooked ? "secondary" : "outline"}
                      size="sm"
                      disabled={isBooked}
                      onClick={() => handleSelectTime(time)}
                      className={cn(
                        "h-12 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all relative",
                        !isBooked && !isSelected && "hover:border-primary hover:text-primary hover:bg-primary/5",
                        isSelected && "shadow-xs font-bold ring-2 ring-primary ring-offset-1",
                        isBooked && "opacity-50 cursor-not-allowed border-dashed bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <span className={cn(isBooked && "line-through")}>{time}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider">
                        {isBooked ? (
                          <span className="text-destructive font-bold">Booked</span>
                        ) : isSelected ? (
                          "Selected"
                        ) : (
                          "Available"
                        )}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep("treatment_date")}>
                Back
              </Button>
              <Button
                disabled={!selectedTime}
                onClick={() => setStep("details")}
                className="gap-2 px-6 font-semibold"
              >
                Continue to Patient Details
                <span>→</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 4: PATIENT DETAILS                                                   */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "details" && (
        <Card className="border border-border bg-card shadow-sm max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("time")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 -ml-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Pick Time
                </Button>
                <h2 className="font-heading text-lg font-bold text-foreground">Patient Information</h2>
                <p className="text-xs text-muted-foreground">
                  Information automatically retrieved from your patient profile. Edit if needed.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="pt_name" className="text-xs font-semibold">
                    Full Legal Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="pt_name"
                      value={patientDetails.fullName}
                      onChange={(e) => setPatientDetails({ ...patientDetails, fullName: e.target.value })}
                      placeholder="e.g. Sarah Johnson"
                      className="pl-9 h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="pt_phone" className="text-xs font-semibold">
                    Contact Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="pt_phone"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                      placeholder="e.g. +91 98480 22338"
                      className="pl-9 h-9 text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Email */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="pt_email" className="text-xs font-semibold">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="pt_email"
                      type="email"
                      value={patientDetails.email}
                      onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                      placeholder="e.g. sarah.johnson@example.com"
                      className="pl-9 h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <Label htmlFor="pt_age" className="text-xs font-semibold">
                    Age
                  </Label>
                  <Input
                    id="pt_age"
                    value={patientDetails.age}
                    onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                    placeholder="32"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Gender</Label>
                <div className="flex gap-2">
                  {["Female", "Male", "Other"].map((gen) => (
                    <Button
                      key={gen}
                      type="button"
                      variant={patientDetails.gender.toLowerCase() === gen.toLowerCase() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPatientDetails({ ...patientDetails, gender: gen })}
                      className="text-xs flex-1 h-8"
                    >
                      {gen}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Note on security - no password asked */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Your patient details are secured under TRUDENT HIPAA/NABH health privacy standards. No login credentials or passwords are ever requested here.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep("time")}>
                Back
              </Button>
              <Button
                disabled={!patientDetails.fullName.trim() || !patientDetails.phone.trim()}
                onClick={() => setStep("review")}
                className="gap-2 px-6 font-semibold"
              >
                Continue to Review
                <span>→</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 5: REVIEW & SUMMARY                                                  */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "review" && selectedDate && selectedTime && (
        <Card className="border border-border bg-card shadow-sm max-w-2xl mx-auto overflow-hidden">
          <div className="bg-primary/5 p-5 border-b border-border flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Step 5 of 5
              </span>
              <h2 className="font-heading text-lg font-bold text-foreground">Review Appointment Details</h2>
            </div>
            <Badge variant="outline" className="bg-white border-primary/20 text-primary text-xs font-bold">
              Fee: ₹{CONSULTATION_FEE}
            </Badge>
          </div>

          <CardContent className="p-6 space-y-5">
            <div className="divide-y divide-border/60 text-xs sm:text-sm">
              {/* Doctor */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Doctor</span>
                <div className="text-right">
                  <p className="font-bold text-foreground">{DOCTOR_NAME}</p>
                  <p className="text-xs text-muted-foreground">{DOCTOR_ROLE} • {DOCTOR_SPECIALTY}</p>
                </div>
              </div>

              {/* Specialization */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Specialization</span>
                <span className="font-semibold text-foreground">{DOCTOR_ROLE}</span>
              </div>

              {/* Consultation */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Consultation</span>
                <Badge variant="secondary" className="font-semibold capitalize">
                  {consultationType === "in-clinic" ? "In-Clinic Consultation" : "Online Video Consultation"}
                </Badge>
              </div>

              {/* Treatment / Reason */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Treatment / Reason</span>
                <span className="font-semibold text-foreground text-right">{selectedTreatment}</span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Date</span>
                <span className="font-semibold text-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Time</span>
                <span className="font-bold text-primary">{selectedTime}</span>
              </div>

              {/* Patient */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Patient</span>
                <span className="font-semibold text-foreground">{patientDetails.fullName}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Phone</span>
                <span className="font-mono text-foreground">{patientDetails.phone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Email</span>
                <span className="text-foreground">{patientDetails.email}</span>
              </div>

              {/* Location or Mode */}
              <div className="flex items-start justify-between py-2.5">
                <span className="text-muted-foreground font-medium">Hospital Location</span>
                <span className="text-right text-xs max-w-xs text-foreground">
                  {consultationType === "in-clinic" ? CLINIC_ADDRESS : "Secure Telehealth Room"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep("details")}
                className="w-1/3"
              >
                Back to Edit
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleConfirmAppointment}
                className="w-2/3 shadow-sm font-semibold gap-2"
              >
                {isSubmitting ? "Confirming..." : "Confirm Appointment"}
                {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* STEP 6: CONFIRMATION SCREEN                                               */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {step === "confirmed" && confirmedAppt && (
        <Card className="max-w-xl mx-auto border border-emerald-200 bg-card shadow-lg text-center p-6 sm:p-8 animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-2 hover:bg-emerald-100 font-semibold">
            Appointment Confirmed
          </Badge>

          <h2 className="font-heading text-2xl font-bold text-foreground">
            Appointment Confirmed
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Your dental consultation with {DOCTOR_NAME} at TRUDENT Multispeciality Dental Hospital is scheduled.
          </p>

          {/* Details Summary Box */}
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <span className="text-muted-foreground">Appointment ID:</span>
              <strong className="font-mono text-primary font-bold">
                #TRU-APT-{confirmedAppt.id.toString().slice(-6)}
              </strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Doctor:</span>
              <span className="font-bold text-foreground">{DOCTOR_NAME}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Consultation Type:</span>
              <Badge variant="outline" className="font-semibold capitalize text-xs">
                {confirmedAppt.appointment_type === "in-person" ? "In-Clinic Consultation" : "Online Consultation"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Treatment:</span>
              <span className="font-semibold text-foreground">{confirmedAppt.treatment}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">
                {confirmedAppt.appointment_date}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-bold text-primary">{confirmedAppt.appointment_time}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/60">
              <span className="text-muted-foreground">Patient:</span>
              <span className="font-semibold text-foreground">{confirmedAppt.patient_name}</span>
            </div>
          </div>

          {/* In-Clinic vs Online Specific Information */}
          {confirmedAppt.appointment_type === "in-person" ? (
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 text-left space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-900">
                <MapPin className="h-4 w-4 text-sky-700 shrink-0" />
                <span>TRUDENT Multispeciality Dental Hospital Location</span>
              </div>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {CLINIC_ADDRESS}
              </p>
              <div className="pl-6 pt-1 flex flex-wrap gap-2">
                <a
                  href={CLINIC_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Get Directions on Google Maps
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-left space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-900">
                <Video className="h-4 w-4 text-teal-700 shrink-0" />
                <span>Online Video Consultation Information</span>
              </div>
              {confirmedAppt.meet_link ? (
                <div className="pl-6 pt-1">
                  <a
                    href={confirmedAppt.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Join Consultation
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  Your consultation link will be available before the appointment.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs"
            >
              <Printer className="h-3.5 w-3.5" /> Print Appointment Slip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetBookingFlow}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Book Another
            </Button>
            <Button
              size="sm"
              onClick={onBooked}
              className="gap-1.5 text-xs font-semibold"
            >
              View My Appointments
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookAppointmentView;