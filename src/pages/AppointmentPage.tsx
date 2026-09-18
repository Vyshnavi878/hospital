import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PageHeader } from "@/components/common/PageHeader";
import { TrudentLogo } from "@/components/common/TrudentLogo";
import { useAppointments, Doctor, normalizeTime } from "@/context/AppointmentsContext";
import { TimeSlot } from "@/components/common/TimeSlot";
import { TREATMENTS_DATA } from "@/data/treatmentsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  Clock,
  User,
  UserCheck,
  UserPlus,
  Phone,
  Mail,
  Video,
  MapPin,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Building2,
  Check,
  ShieldCheck,
  MonitorSmartphone,
  ExternalLink,
  Info,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  XCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────────
const CLINIC_ADDRESS = "1st Floor, Avani Plaza, Ramayya Street, Kakinada, AP – 533001";
const CLINIC_PHONE = "+91 90635 84448";
const CLINIC_MAPS_URL = "https://maps.app.goo.gl/oS4FVYedV4wLi7vi9";
const DOCTOR_NAME = "Dr. Deepa Koduri";
const DOCTOR_QUALIFICATIONS = "Endodontist | Root Canal Specialist";
const DOCTOR_ROOM = "Dental Wing, Room 101";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM",
];

const EXTRA_REASONS = [
  { name: "General Dental Consultation & Checkup", description: "Routine oral health checkup and professional advice." },
  { name: "Tooth Pain / Toothache", description: "Evaluation and relief for acute or chronic tooth pain." },
  { name: "Dental Cleaning (Scaling & Polishing)", description: "Professional removal of tartar, stains, and plaque buildup." },
  { name: "Root Canal Consultation", description: "Diagnosis and pain relief for deep dental decay or tooth infection." },
  { name: "Emergency Dental Visit", description: "Urgent care for dental trauma, acute swelling, or severe toothache." },
  { name: "Other / Not Listed", description: "Describe your concern to the doctor directly during the visit." },
];

type ConsultationType = "in-clinic" | "online";
type AuthSelection = "gate" | "signin" | "new_patient";

const STEP_LABELS = [
  "Consultation Type",
  "Reason for Visit",
  "Select Date",
  "Select Time",
  "Patient Details",
  "Summary",
];

// ─── Date Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function inNDaysISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ─── Progress Bar ───────────────────────────────────────────────────────────────
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => (
  <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
    <div className="flex items-center justify-between gap-1 text-xs mb-3">
      <span className="font-bold text-primary">
        Step {currentStep} of {totalSteps}: {STEP_LABELS[currentStep - 1]}
      </span>
      <span className="text-slate-500 font-medium">
        {Math.round((currentStep / totalSteps) * 100)}% Completed
      </span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300 rounded-full"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
    <div
      className="hidden sm:grid mt-3 pt-3 border-t border-slate-100 text-center"
      style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)`, gap: "6px" }}
    >
      {STEP_LABELS.map((label, idx) => {
        const n = idx + 1;
        return (
          <div
            key={label}
            className={cn(
              "text-[10px] font-semibold py-1 rounded-lg truncate px-1",
              currentStep === n
                ? "bg-primary/10 text-primary font-bold"
                : currentStep > n
                ? "text-emerald-600"
                : "text-slate-400"
            )}
          >
            {n}. {label.split(" ")[0]}
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Nav Buttons ────────────────────────────────────────────────────────────────
interface NavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isConfirm?: boolean;
  loading?: boolean;
}
const NavButtons: React.FC<NavButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  isConfirm = false,
  loading = false,
}) => (
  <div className="pt-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100 mt-2">
    {onBack ? (
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm gap-2 border-slate-300 text-slate-700 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
    ) : (
      <div />
    )}
    {onNext && (
      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className={cn(
          "w-full sm:w-auto h-11 px-7 rounded-xl font-semibold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer text-white",
          isConfirm
            ? "bg-emerald-600 hover:bg-emerald-700 h-12 px-8 font-bold text-sm"
            : "bg-primary hover:bg-primary/90"
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
        {isConfirm && !loading ? <CheckCircle2 className="h-4 w-4" /> : null}
        <span>{nextLabel}</span>
        {!isConfirm && !loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    )}
  </div>
);

// ─── Summary Row ─────────────────────────────────────────────────────────────────
const SRow = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="space-y-0.5">
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    <p className="font-bold text-sm text-slate-900">{value}</p>
    {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
  </div>
);

// ─── Field Error Component ───────────────────────────────────────────────────────
const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
      <XCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  ) : null;

// ─── Main Component ────────────────────────────────────────────────────────────
export const AppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctors, addAppointment, isSlotBooked, getBookedSlots } = useAppointments();
  const { toast } = useToast();

  const preselectedTreatment = searchParams.get("treatment") || "";
  const authQuery = searchParams.get("auth") || "";

  // The ONE doctor
  const doctor: Doctor = useMemo(
    () =>
      doctors.find((d) => d.name === DOCTOR_NAME) ||
      doctors.find((d) => d.specialty?.toLowerCase() === "dentistry") ||
      doctors[0],
    [doctors]
  );

  // ── Authentication Check & Initial State ────────────────────────────────────
  const existingToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const existingRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const isAlreadyLoggedIn = Boolean(existingToken && existingRole === "patient");

  // Initial Auth View Mode
  const [authSelection, setAuthSelection] = useState<AuthSelection>(() => {
    if (authQuery === "new" || authQuery === "register") return "new_patient";
    if (authQuery === "login" || authQuery === "signin") return "signin";
    return "gate";
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAlreadyLoggedIn);

  // ── Patient Profile State (Populated upon login/registration) ────────────────
  const [patientName, setPatientName] = useState(() => localStorage.getItem("username") || "");
  const [patientEmail, setPatientEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [patientMobile, setPatientMobile] = useState(() => localStorage.getItem("userPhone") || "");
  const [patientAge, setPatientAge] = useState(() => localStorage.getItem("userAge") || "");
  const [patientGender, setPatientGender] = useState(() => localStorage.getItem("userGender") || "Male");
  const [notes, setNotes] = useState("");

  // ── Login Form State (Inside Appointment Page) ──────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // ── Registration Form State (Inside Appointment Page) ────────────────────────
  const [regForm, setRegForm] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // ── Booking Steps State ─────────────────────────────────────────────────────
  // 1: Consultation Type, 2: Reason, 3: Date, 4: Time, 5: Patient Details, 6: Summary, 7: Confirmation
  const [bookingStep, setBookingStep] = useState(1);
  const TOTAL_STEPS = 6;

  // Step 1: Consultation type
  const [consultationType, setConsultationType] = useState<ConsultationType>("in-clinic");

  // Step 2: Treatment / reason
  const allReasons = useMemo(
    () => [
      ...EXTRA_REASONS.slice(0, 1),
      ...TREATMENTS_DATA.map((t) => ({ name: t.name, description: t.shortDescription })),
      ...EXTRA_REASONS.slice(1),
    ],
    []
  );

  const [selectedReason, setSelectedReason] = useState<string>(() => {
    if (preselectedTreatment) return preselectedTreatment;
    return allReasons[0]?.name || "";
  });
  const [customReason, setCustomReason] = useState("");

  // Step 3: Date
  const [date, setDate] = useState(tomorrowISO());

  // Step 4: Time (Starts empty so patient chooses an available slot)
  const [time, setTime] = useState("");

  // Step 5 validation
  const [detailsErrors, setDetailsErrors] = useState<{
    name?: string;
    phone?: string;
    age?: string;
    gender?: string;
    email?: string;
  }>({});

  // Step 7: Confirmation data
  const [confirmation, setConfirmation] = useState<{
    token: string;
    treatment: string;
    date: string;
    time: string;
    type: ConsultationType;
    patientName: string;
    patientMobile: string;
    patientAge: string;
    patientGender: string;
    patientEmail: string;
  } | null>(null);

  // Preselect treatment from URL
  useEffect(() => {
    if (!preselectedTreatment) return;
    const match = allReasons.find(
      (r) => r.name.toLowerCase() === preselectedTreatment.toLowerCase()
    );
    setSelectedReason(match ? match.name : preselectedTreatment);
  }, [preselectedTreatment, allReasons]);

  // Clear selected time if it becomes booked on date change
  useEffect(() => {
    if (time && isSlotBooked(date, time, doctor?.name)) {
      setTime("");
    }
  }, [date, time, isSlotBooked, doctor?.name]);

  // ── Authenticate Existing Patient ──────────────────────────────────────────
  const handleExistingPatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!loginEmail.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!loginPassword.trim()) {
      errs.password = "Password is required.";
    }
    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      // Establish patient session
      const matchedName =
        loginEmail.toLowerCase().includes("sarah")
          ? "Sarah Johnson"
          : loginEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      localStorage.setItem("authToken", "token_patient_" + Date.now());
      localStorage.setItem("userRole", "patient");
      localStorage.setItem("username", matchedName);
      localStorage.setItem("userId", "1");
      localStorage.setItem("userEmail", loginEmail.trim().toLowerCase());
      if (!localStorage.getItem("userPhone")) localStorage.setItem("userPhone", "9848022338");
      if (!localStorage.getItem("userAge")) localStorage.setItem("userAge", "32");
      if (!localStorage.getItem("userGender")) localStorage.setItem("userGender", "Female");

      // Populate booking patient state directly
      setPatientName(matchedName);
      setPatientEmail(loginEmail.trim().toLowerCase());
      setPatientMobile(localStorage.getItem("userPhone") || "9848022338");
      setPatientAge(localStorage.getItem("userAge") || "32");
      setPatientGender(localStorage.getItem("userGender") || "Female");

      setIsAuthenticated(true);
      setLoginLoading(false);
      toast({
        title: `Welcome back, ${matchedName}!`,
        description: "Continuing with your dental appointment booking.",
      });
      // Continue directly to Step 1 without dashboard redirection
      setBookingStep(1);
    }, 450);
  };

  // ── Register New Patient ───────────────────────────────────────────────────
  const handleNewPatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!regForm.fullName.trim()) errs.fullName = "Full name is required.";
    else if (regForm.fullName.trim().length < 2) errs.fullName = "Please enter your full name.";

    const ageNum = parseInt(regForm.age, 10);
    if (!regForm.age) errs.age = "Age is required.";
    else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) errs.age = "Please enter a valid age (1–120).";

    if (!regForm.gender) errs.gender = "Please select gender.";

    const cleanMobile = regForm.mobile.replace(/\D/g, "");
    if (!cleanMobile) errs.mobile = "Mobile number is required.";
    else if (cleanMobile.length !== 10) errs.mobile = "Please enter a valid 10-digit mobile number.";

    if (!regForm.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) errs.email = "Please enter a valid email address.";

    if (!regForm.password) errs.password = "Password is required.";
    else if (regForm.password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (!/[0-9]/.test(regForm.password)) errs.password = "Password must include at least one number.";

    if (!regForm.confirmPassword) errs.confirmPassword = "Confirm password is required.";
    else if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = "Passwords do not match.";

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      toast({
        title: "Please complete all required fields",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      const name = regForm.fullName.trim();
      const email = regForm.email.trim().toLowerCase();
      const phone = cleanMobile;
      const age = regForm.age.trim();
      const gender = regForm.gender;

      // Save user session
      localStorage.setItem("authToken", "token_patient_" + Date.now());
      localStorage.setItem("userRole", "patient");
      localStorage.setItem("username", name);
      localStorage.setItem("userId", String(Date.now()));
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPhone", phone);
      localStorage.setItem("userAge", age);
      localStorage.setItem("userGender", gender);

      // Pre-fill booking details automatically
      setPatientName(name);
      setPatientEmail(email);
      setPatientMobile(phone);
      setPatientAge(age);
      setPatientGender(gender);

      setIsAuthenticated(true);
      setRegLoading(false);
      toast({
        title: "Patient Account Registered!",
        description: "Continuing directly with your appointment booking.",
      });
      // Continue directly to Step 1 without dashboard redirection
      setBookingStep(1);
    }, 500);
  };

  // ── Switch/Logout Patient ──────────────────────────────────────────────────
  const handleSwitchPatient = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setAuthSelection("gate");
    setBookingStep(1);
  };

  // ── Step 5 Validation ──────────────────────────────────────────────────────
  const validatePatientDetails = () => {
    const errs: { name?: string; phone?: string; age?: string; gender?: string; email?: string } = {};
    if (!patientName.trim()) errs.name = "Full name is required.";
    const cleanPhone = patientMobile.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = "Valid 10-digit mobile number is required.";
    }
    const a = parseInt(patientAge, 10);
    if (!patientAge || isNaN(a) || a < 1 || a > 120) {
      errs.age = "Valid age (1–120) is required.";
    }
    if (!patientGender) {
      errs.gender = "Gender is required.";
    }
    if (patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    setDetailsErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Navigation between steps ───────────────────────────────────────────────
  const handleNext = () => {
    if (bookingStep === 1 && !consultationType) {
      toast({ title: "Select a consultation type", variant: "destructive" });
      return;
    }
    if (bookingStep === 2 && !selectedReason) {
      toast({ title: "Select a reason", description: "Please select a treatment or concern.", variant: "destructive" });
      return;
    }
    if (bookingStep === 3 && !date) {
      toast({ title: "Select an appointment date", variant: "destructive" });
      return;
    }
    if (bookingStep === 4) {
      if (!time) {
        toast({ title: "Select a time slot", description: "Please pick an available time slot.", variant: "destructive" });
        return;
      }
      if (isSlotBooked(date, time, doctor?.name)) {
        toast({
          title: "Slot unavailable",
          description: "This time slot is already booked. Please choose another available slot.",
          variant: "destructive",
        });
        return;
      }
    }
    if (bookingStep === 5 && !validatePatientDetails()) {
      toast({ title: "Incomplete details", description: "Please correct the highlighted fields.", variant: "destructive" });
      return;
    }
    setBookingStep((s) => s + 1);
  };

  const handleBack = () => setBookingStep((s) => Math.max(1, s - 1));

  // ── Confirm Appointment with Collision Guard ──────────────────────────────
  const handleConfirm = () => {
    // Final availability check right before confirmation
    if (isSlotBooked(date, time, doctor?.name)) {
      toast({
        title: "This time slot is no longer available",
        description: "Please select another available time.",
        variant: "destructive",
      });
      setBookingStep(4);
      return;
    }

    const patientId = Number(localStorage.getItem("userId") || "1");
    const token = `TRU-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalReason =
      selectedReason === "Other / Not Listed" && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    // Add appointment to context and persistent storage
    addAppointment({
      patient_name: patientName.trim(),
      patient_id: patientId,
      doctor_name: doctor?.name || DOCTOR_NAME,
      appointment_date: date,
      appointment_time: time,
      status: "confirmed",
      treatment: finalReason,
      appointment_type: consultationType === "in-clinic" ? "in-person" : "video",
      room: consultationType === "in-clinic" ? doctor?.roomNumber || DOCTOR_ROOM : undefined,
      patient_age: patientAge,
      patient_gender: patientGender,
      patient_phone: patientMobile.trim(),
      patient_email: patientEmail.trim(),
    });

    setConfirmation({
      token,
      treatment: finalReason,
      date: formatDate(date),
      time,
      type: consultationType,
      patientName: patientName.trim(),
      patientMobile: patientMobile.trim(),
      patientAge: patientAge.trim(),
      patientGender,
      patientEmail: patientEmail.trim(),
    });

    toast({
      title: "Appointment Confirmed!",
      description: `Your appointment token: ${token}.`,
    });

    setBookingStep(7); // Confirmation screen
  };

  const handleReset = () => {
    setBookingStep(1);
    setTime("");
    setConfirmation(null);
  };

  const formattedDate = useMemo(() => formatDate(date), [date]);
  const isOtherReason = selectedReason === "Other / Not Listed";

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-primary/10 selection:text-primary pb-16 md:pb-0">
      <PublicNavbar />

      <PageHeader
        badge="BOOK APPOINTMENT"
        title="Book Your Dental Appointment"
        subtitle="Schedule an in-clinic or online dental consultation with Dr. Deepa Koduri at TRUDENT."
        breadcrumbs={[{ label: "Book Appointment" }]}
      />

      <main className="flex-1 py-8 sm:py-12 bg-slate-50/50">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">

          {/* ═══════════════════════════════════════════════════════════════════
              AUTH IDENTIFICATION GATE (When not authenticated)
              "Are you already a TRUDENT patient?"
              [Yes, Sign In]  [I'm a New Patient]
          ═══════════════════════════════════════════════════════════════════ */}
          {!isAuthenticated && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              {/* Top Prompt */}
              <div className="text-center space-y-3 max-w-lg mx-auto">
                <div className="flex justify-center">
                  <TrudentLogo size="md" className="mx-auto" />
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-3 py-1">
                  PATIENT IDENTIFICATION
                </Badge>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Are you already a TRUDENT patient?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Sign in to load your patient profile or register once to continue your appointment booking in a single, seamless journey.
                </p>
              </div>

              {/* Selection cards when in "gate" mode */}
              {authSelection === "gate" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-2xl mx-auto">
                  {/* Option 1: Existing Patient */}
                  <button
                    type="button"
                    onClick={() => setAuthSelection("signin")}
                    className="group p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-primary/60 hover:bg-primary/5 hover:shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                        Yes, Sign In
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        I have visited TRUDENT before or already have an account. Sign in to load your details.
                      </p>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        Sign In & Book <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>

                  {/* Option 2: New Patient */}
                  <button
                    type="button"
                    onClick={() => setAuthSelection("new_patient")}
                    className="group p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-accent/60 hover:bg-accent/5 hover:shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                        <UserPlus className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-accent transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-accent transition-colors">
                        I'm a New Patient
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        First time visiting TRUDENT? Register your profile once and automatically continue booking.
                      </p>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                        Register & Book <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  INLINE PATIENT LOGIN (When "Yes, Sign In" is chosen)
              ───────────────────────────────────────────────────────────── */}
              {authSelection === "signin" && (
                <div className="max-w-md mx-auto space-y-5 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setAuthSelection("gate")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to options
                    </button>
                    <span className="text-xs font-bold text-primary">Patient Sign In</span>
                  </div>

                  <form onSubmit={handleExistingPatientLogin} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="auth-email" className="text-xs font-semibold text-slate-700">
                        Email Address <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="auth-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            setLoginErrors((p) => ({ ...p, email: undefined }));
                          }}
                          className={cn("h-11 pl-10 rounded-xl text-sm", loginErrors.email && "border-rose-500")}
                        />
                      </div>
                      <FieldError msg={loginErrors.email} />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="auth-password" className="text-xs font-semibold text-slate-700">
                        Password <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="auth-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                            setLoginErrors((p) => ({ ...p, password: undefined }));
                          }}
                          className={cn("h-11 pl-10 pr-10 rounded-xl text-sm", loginErrors.password && "border-rose-500")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FieldError msg={loginErrors.password} />
                    </div>

                    {/* Sign In button */}
                    <Button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full h-12 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-xs gap-2"
                    >
                      {loginLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                      <span>Sign In & Continue Booking</span>
                    </Button>

                    {/* Helper Links */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setShowForgotNotice((v) => !v)}
                        className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5" /> Forgot Password?
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthSelection("new_patient")}
                        className="font-semibold text-primary hover:underline cursor-pointer"
                      >
                        New patient? Register here
                      </button>
                    </div>

                    {/* Forgot password info */}
                    {showForgotNotice && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                        <p className="font-bold">Password Assistance</p>
                        <p className="text-amber-800">
                          Password resets are managed directly at the clinic. Please call TRUDENT reception:
                        </p>
                        <a href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`} className="font-bold text-primary underline block">
                          {CLINIC_PHONE}
                        </a>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  INLINE NEW PATIENT REGISTRATION (When "I'm a New Patient")
              ───────────────────────────────────────────────────────────── */}
              {authSelection === "new_patient" && (
                <div className="max-w-xl mx-auto space-y-5 pt-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setAuthSelection("gate")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to options
                    </button>
                    <span className="text-xs font-bold text-accent">New Patient Registration</span>
                  </div>

                  <div className="flex justify-center pt-1">
                    <TrudentLogo size="md" className="mx-auto" />
                  </div>

                  <form onSubmit={handleNewPatientRegister} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-name" className="text-xs font-semibold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="reg-name"
                          placeholder="e.g. Rahul Sharma"
                          value={regForm.fullName}
                          onChange={(e) => {
                            setRegForm((p) => ({ ...p, fullName: e.target.value }));
                            setRegErrors((p) => ({ ...p, fullName: "" }));
                          }}
                          className={cn("h-11 pl-10 rounded-xl text-sm", regErrors.fullName && "border-rose-500")}
                        />
                      </div>
                      <FieldError msg={regErrors.fullName} />
                    </div>

                    {/* Age & Gender in two columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-age" className="text-xs font-semibold text-slate-700">
                          Age <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="reg-age"
                          type="number"
                          min={1}
                          max={120}
                          placeholder="e.g. 28"
                          value={regForm.age}
                          onChange={(e) => {
                            setRegForm((p) => ({ ...p, age: e.target.value }));
                            setRegErrors((p) => ({ ...p, age: "" }));
                          }}
                          className={cn("h-11 rounded-xl text-sm", regErrors.age && "border-rose-500")}
                        />
                        <FieldError msg={regErrors.age} />
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">
                          Gender <span className="text-rose-500">*</span>
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Male", "Female", "Other"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setRegForm((p) => ({ ...p, gender: g }))}
                              className={cn(
                                "h-11 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                regForm.gender === g
                                  ? "bg-primary/10 border-primary text-primary"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Phone & Email in two columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-mobile" className="text-xs font-semibold text-slate-700">
                          Phone Number <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="reg-mobile"
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit number"
                            value={regForm.mobile}
                            onChange={(e) => {
                              setRegForm((p) => ({ ...p, mobile: e.target.value }));
                              setRegErrors((p) => ({ ...p, mobile: "" }));
                            }}
                            className={cn("h-11 pl-10 rounded-xl text-sm", regErrors.mobile && "border-rose-500")}
                          />
                        </div>
                        <FieldError msg={regErrors.mobile} />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-email" className="text-xs font-semibold text-slate-700">
                          Email Address <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={regForm.email}
                            onChange={(e) => {
                              setRegForm((p) => ({ ...p, email: e.target.value }));
                              setRegErrors((p) => ({ ...p, email: "" }));
                            }}
                            className={cn("h-11 pl-10 rounded-xl text-sm", regErrors.email && "border-rose-500")}
                          />
                        </div>
                        <FieldError msg={regErrors.email} />
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-password" className="text-xs font-semibold text-slate-700">
                          Password <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="reg-password"
                            type={showRegPassword ? "text" : "password"}
                            placeholder="Min 8 chars, 1 number"
                            value={regForm.password}
                            onChange={(e) => {
                              setRegForm((p) => ({ ...p, password: e.target.value }));
                              setRegErrors((p) => ({ ...p, password: "" }));
                            }}
                            className={cn("h-11 pl-10 pr-10 rounded-xl text-sm", regErrors.password && "border-rose-500")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <FieldError msg={regErrors.password} />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-700">
                          Confirm Password <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="reg-confirm"
                            type={showRegConfirm ? "text" : "password"}
                            placeholder="Repeat password"
                            value={regForm.confirmPassword}
                            onChange={(e) => {
                              setRegForm((p) => ({ ...p, confirmPassword: e.target.value }));
                              setRegErrors((p) => ({ ...p, confirmPassword: "" }));
                            }}
                            className={cn("h-11 pl-10 pr-10 rounded-xl text-sm", regErrors.confirmPassword && "border-rose-500")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirm((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {showRegConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <FieldError msg={regErrors.confirmPassword} />
                      </div>
                    </div>

                    {/* Submit Registration */}
                    <Button
                      type="submit"
                      disabled={regLoading}
                      className="w-full h-12 rounded-xl text-sm font-bold bg-accent hover:bg-accent/90 text-white cursor-pointer shadow-xs gap-2"
                    >
                      {regLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      <span>Create Account & Continue Booking</span>
                    </Button>

                    <div className="text-center text-xs pt-1">
                      <span className="text-slate-500">Already registered? </span>
                      <button
                        type="button"
                        onClick={() => setAuthSelection("signin")}
                        className="font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Sign In instead
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              AUTHENTICATED BOOKING FLOW (Steps 1–7)
          ═══════════════════════════════════════════════════════════════════ */}
          {isAuthenticated && (
            <>
              {/* Logged in patient pill */}
              <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Booking as: <strong className="text-slate-900 font-bold">{patientName}</strong>{" "}
                    <span className="text-slate-400">({patientEmail || patientMobile})</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchPatient}
                  className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  Not you? Switch
                </button>
              </div>

              {/* Progress Bar for steps 1–6 */}
              {bookingStep <= 6 && (
                <ProgressBar currentStep={bookingStep} totalSteps={TOTAL_STEPS} />
              )}

              {/* Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm">

                {/* ─────────────────────────────────────────────────────────────
                    STEP 1 — CONSULTATION TYPE
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                        Step 1: Consultation Type
                      </Badge>
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        How would you like to consult?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Choose your consultation mode with Dr. Deepa Koduri (Endodontist & Root Canal Specialist).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* In-Clinic */}
                      <button
                        type="button"
                        onClick={() => setConsultationType("in-clinic")}
                        className={cn(
                          "group p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer space-y-3",
                          consultationType === "in-clinic"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                            consultationType === "in-clinic"
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                          )}
                        >
                          <Building2 className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-heading font-bold text-base text-slate-900">
                              🏥 In-Clinic Consultation
                            </h3>
                            {consultationType === "in-clinic" && (
                              <Check className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Visit TRUDENT and consult the doctor at the hospital for physical examination and treatment.
                          </p>
                        </div>
                        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                          <span className="leading-snug">{CLINIC_ADDRESS}</span>
                        </div>
                      </button>

                      {/* Online */}
                      <button
                        type="button"
                        onClick={() => setConsultationType("online")}
                        className={cn(
                          "group p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer space-y-3",
                          consultationType === "online"
                            ? "border-accent bg-accent/5 ring-2 ring-accent/20 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                            consultationType === "online"
                              ? "bg-accent text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-accent/10 group-hover:text-accent"
                          )}
                        >
                          <MonitorSmartphone className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-heading font-bold text-base text-slate-900">
                              💻 Online Consultation
                            </h3>
                            {consultationType === "online" && (
                              <Check className="h-5 w-5 text-accent shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Consult the doctor remotely through a secure online consultation from home.
                          </p>
                        </div>
                        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
                          <span className="leading-snug">
                            Doctor will connect with you at your scheduled time.
                          </span>
                        </div>
                      </button>
                    </div>

                    <NavButtons onNext={handleNext} nextLabel="Next: Reason for Visit" />
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 2 — REASON FOR VISIT
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                        Step 2: Reason for Visit
                      </Badge>
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        What brings you to TRUDENT?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Select a treatment or describe your dental concern:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {allReasons.map((reason) => {
                        const isSelected = selectedReason === reason.name;
                        return (
                          <button
                            key={reason.name}
                            type="button"
                            onClick={() => setSelectedReason(reason.name)}
                            className={cn(
                              "p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3",
                              isSelected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-2xs"
                                : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                                isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                              )}
                            >
                              <Stethoscope className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-slate-900 leading-snug">
                                  {reason.name}
                                </span>
                                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                {reason.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {isOtherReason && (
                      <div className="space-y-1.5 pt-1">
                        <Label htmlFor="custom-concern" className="text-xs font-semibold text-slate-700">
                          Please describe your concern <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                          id="custom-concern"
                          rows={2}
                          placeholder="Describe your symptoms or specific requirements..."
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          className="rounded-xl text-xs resize-none"
                        />
                      </div>
                    )}

                    <NavButtons
                      onBack={handleBack}
                      onNext={handleNext}
                      nextLabel="Next: Select Date"
                      nextDisabled={!selectedReason || (isOtherReason && !customReason.trim())}
                    />
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 3 — SELECT DATE
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                        Step 3: Select Date
                      </Badge>
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        Choose Appointment Date
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Dr. Deepa Koduri is available Monday – Saturday:
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <Label htmlFor="date-picker" className="text-xs font-semibold text-slate-700">
                          Consultation Date
                        </Label>
                        <Input
                          id="date-picker"
                          type="date"
                          min={todayISO()}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="h-12 rounded-xl text-sm font-medium"
                        />
                      </div>

                      {formattedDate && (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide block">
                              Selected Date
                            </span>
                            <strong className="text-sm text-slate-900">{formattedDate}</strong>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-xs text-slate-500 font-medium block mb-2">Quick picks:</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Tomorrow", iso: tomorrowISO() },
                            { label: "In 2 Days", iso: inNDaysISO(2) },
                            { label: "20 Sep 2026", iso: "2026-09-20" },
                            { label: "Next Week", iso: inNDaysISO(7) },
                          ].map(({ label, iso }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setDate(iso)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer",
                                date === iso
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary"
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <NavButtons
                      onBack={handleBack}
                      onNext={handleNext}
                      nextLabel="Next: Select Time"
                      nextDisabled={!date}
                    />
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 4 — SELECT TIME (REAL AVAILABILITY)
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 4 && (() => {
                  const bookedSlotsForDate = new Set(getBookedSlots(date, doctor?.name));
                  const availableCount = TIME_SLOTS.filter((s) => !bookedSlotsForDate.has(normalizeTime(s))).length;
                  const bookedCount = TIME_SLOTS.filter((s) => bookedSlotsForDate.has(normalizeTime(s))).length;
                  const isCurrentTimeBooked = Boolean(time && isSlotBooked(date, time, doctor?.name));

                  return (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                          Step 4: Select Time
                        </Badge>
                        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                          Choose an Available Time Slot
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Doctor availability for <strong>{formattedDate || date}</strong> with {doctor?.name || DOCTOR_NAME}:
                        </p>
                      </div>

                      {/* Header counters and reminder */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border",
                            consultationType === "in-clinic"
                              ? "bg-primary/10 text-primary border-primary/25"
                              : "bg-accent/10 text-accent border-accent/25"
                          )}
                        >
                          {consultationType === "in-clinic" ? (
                            <>
                              <Building2 className="h-3.5 w-3.5" /> In-Clinic Consultation
                            </>
                          ) : (
                            <>
                              <MonitorSmartphone className="h-3.5 w-3.5" /> Online Consultation
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {availableCount} Available
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-lg">
                            <span className="h-2 w-2 rounded-full bg-rose-400" />
                            {bookedCount} Booked
                          </span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-end gap-3 text-[11px] text-slate-500 font-medium px-1">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Available
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <Check className="h-3 w-3" />
                          Selected
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                          <span className="inline-block px-1 py-0.2 bg-rose-100 rounded text-[9px]">Booked</span>
                          Disabled
                        </span>
                      </div>

                      {availableCount === 0 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                          <p className="font-bold">All slots booked for this date</p>
                          <p className="text-xs text-amber-800 mt-1">
                            Please select another date in Step 3 or call TRUDENT reception directly at{" "}
                            <a href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`} className="underline font-bold">
                              {CLINIC_PHONE}
                            </a>.
                          </p>
                        </div>
                      )}

                      {/* Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const isBooked = isSlotBooked(date, slot, doctor?.name);
                          const isSelected = time === slot;

                          return (
                            <TimeSlot
                              key={slot}
                              time={slot}
                              isBooked={isBooked}
                              isSelected={isSelected}
                              onSelect={(selectedSlot) => setTime(selectedSlot)}
                            />
                          );
                        })}
                      </div>

                      {time && !isCurrentTimeBooked && (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-slate-700 flex items-center justify-between">
                          <span>
                            Selected slot: <strong className="text-slate-900 font-bold">{time}</strong> on{" "}
                            <strong className="text-slate-900">{formattedDate || date}</strong>
                          </span>
                          <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Available
                          </span>
                        </div>
                      )}

                      <NavButtons
                        onBack={handleBack}
                        onNext={handleNext}
                        nextLabel="Next: Patient Details"
                        nextDisabled={!time || isCurrentTimeBooked}
                      />
                    </div>
                  );
                })()}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 5 — PATIENT DETAILS (Pre-filled from profile, NO PASSWORD)
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                        Step 5: Patient Details
                      </Badge>
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        Review Patient Information
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Information pre-filled from your patient profile. You may adjust contact details if required:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="p-name" className="text-xs font-semibold text-slate-700">
                          Full Name <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            id="p-name"
                            value={patientName}
                            onChange={(e) => {
                              setPatientName(e.target.value);
                              setDetailsErrors((p) => ({ ...p, name: undefined }));
                            }}
                            className={cn("h-11 pl-10 rounded-xl text-sm", detailsErrors.name && "border-rose-500")}
                          />
                        </div>
                        <FieldError msg={detailsErrors.name} />
                      </div>

                      {/* Age & Gender in two columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="p-age" className="text-xs font-semibold text-slate-700">
                            Age <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="p-age"
                            type="number"
                            min={1}
                            max={120}
                            value={patientAge}
                            onChange={(e) => {
                              setPatientAge(e.target.value);
                              setDetailsErrors((p) => ({ ...p, age: undefined }));
                            }}
                            className={cn("h-11 rounded-xl text-sm", detailsErrors.age && "border-rose-500")}
                          />
                          <FieldError msg={detailsErrors.age} />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-700">
                            Gender <span className="text-rose-500">*</span>
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Male", "Female", "Other"].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setPatientGender(g)}
                                className={cn(
                                  "h-11 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                  patientGender === g
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                )}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Phone & Email in two columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="p-phone" className="text-xs font-semibold text-slate-700">
                            Mobile Number <span className="text-rose-500">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                              id="p-phone"
                              type="tel"
                              maxLength={10}
                              value={patientMobile}
                              onChange={(e) => {
                                setPatientMobile(e.target.value);
                                setDetailsErrors((p) => ({ ...p, phone: undefined }));
                              }}
                              className={cn("h-11 pl-10 rounded-xl text-sm", detailsErrors.phone && "border-rose-500")}
                            />
                          </div>
                          <FieldError msg={detailsErrors.phone} />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="p-email" className="text-xs font-semibold text-slate-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                              id="p-email"
                              type="email"
                              value={patientEmail}
                              onChange={(e) => {
                                setPatientEmail(e.target.value);
                                setDetailsErrors((p) => ({ ...p, email: undefined }));
                              }}
                              className={cn("h-11 pl-10 rounded-xl text-sm", detailsErrors.email && "border-rose-500")}
                            />
                          </div>
                          <FieldError msg={detailsErrors.email} />
                        </div>
                      </div>

                      {/* Symptoms/Notes */}
                      <div className="space-y-1.5">
                        <Label htmlFor="p-notes" className="text-xs font-semibold text-slate-700">
                          Symptoms or Specific Notes <span className="text-slate-400 font-normal">(optional)</span>
                        </Label>
                        <Textarea
                          id="p-notes"
                          rows={3}
                          placeholder="Describe any tooth pain, sensitivity, swelling, or prior treatments..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="rounded-xl text-sm resize-none"
                        />
                      </div>
                    </div>

                    <NavButtons
                      onBack={handleBack}
                      onNext={handleNext}
                      nextLabel="Review Summary"
                    />
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 6 — SUMMARY & CONFIRMATION
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold px-2.5 py-0.5">
                        Step 6: Summary
                      </Badge>
                      <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        Review Appointment Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Please review your consultation details before confirming:
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-5">
                      {/* Badge */}
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border",
                          consultationType === "in-clinic"
                            ? "bg-primary/10 text-primary border-primary/25"
                            : "bg-accent/10 text-accent border-accent/25"
                        )}
                      >
                        {consultationType === "in-clinic" ? (
                          <>
                            <Building2 className="h-3.5 w-3.5" /> In-Clinic Consultation
                          </>
                        ) : (
                          <>
                            <MonitorSmartphone className="h-3.5 w-3.5" /> Online Consultation
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SRow
                          label="Doctor"
                          value={doctor?.name || DOCTOR_NAME}
                          sub={`${DOCTOR_QUALIFICATIONS} · Lead Dental Surgeon`}
                        />
                        <SRow
                          label="Reason for Visit"
                          value={isOtherReason && customReason ? customReason : selectedReason}
                        />
                        <SRow label="Date" value={formattedDate || date} />
                        <SRow label="Time" value={time} />

                        {consultationType === "in-clinic" ? (
                          <div className="sm:col-span-2 space-y-0.5 pt-3 border-t border-slate-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Hospital Location
                            </span>
                            <p className="font-bold text-sm text-slate-900">
                              TRUDENT Multispeciality Dental Hospital
                            </p>
                            <p className="text-[11px] text-slate-500">{CLINIC_ADDRESS}</p>
                            <p className="text-[11px] text-slate-500">{doctor?.roomNumber || DOCTOR_ROOM}</p>
                            <a
                              href={CLINIC_MAPS_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline mt-1"
                            >
                              <MapPin className="h-3 w-3" /> View on Google Maps
                            </a>
                          </div>
                        ) : (
                          <div className="sm:col-span-2 space-y-0.5 pt-3 border-t border-slate-200">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Online Video Consultation
                            </span>
                            <p className="font-bold text-sm text-slate-900">Remote Consultation</p>
                            <p className="text-[11px] text-slate-500">
                              Your online consultation link will be shared by the hospital before the scheduled time.
                            </p>
                          </div>
                        )}

                        <div className="sm:col-span-2 pt-3 border-t border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Patient
                          </span>
                          <p className="font-bold text-sm text-slate-900">
                            {patientName} · {patientAge} yrs ({patientGender})
                          </p>
                          <p className="text-xs text-slate-600">
                            Phone: {patientMobile} {patientEmail && `· Email: ${patientEmail}`}
                          </p>
                          {notes && <p className="text-[11px] text-slate-500 italic mt-1">"{notes}"</p>}
                        </div>
                      </div>
                    </div>

                    <NavButtons
                      onBack={handleBack}
                      onNext={handleConfirm}
                      nextLabel="Confirm Appointment"
                      isConfirm
                    />
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 7 — APPOINTMENT CONFIRMATION
                ───────────────────────────────────────────────────────────── */}
                {bookingStep === 7 && confirmation && (
                  <div className="text-center space-y-6 py-2">
                    <div className="flex justify-center pb-1">
                      <TrudentLogo size="lg" className="mx-auto" />
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto shadow-sm">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <Check className="h-3 w-3" /> Booking Confirmed
                      </span>
                      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Your Appointment is Scheduled!
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-slate-900">{confirmation.patientName}</strong>. Your dental consultation with Dr. Deepa Koduri has been registered at TRUDENT.
                      </p>
                    </div>

                    {/* Confirmation summary card */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 text-left max-w-lg mx-auto space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Appointment ID
                        </span>
                        <strong className="text-base font-mono font-extrabold text-primary">
                          {confirmation.token}
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <SRow label="Doctor" value={doctor?.name || DOCTOR_NAME} sub={DOCTOR_QUALIFICATIONS} />
                        <SRow
                          label="Consultation"
                          value={confirmation.type === "in-clinic" ? "In-Clinic" : "Online"}
                        />
                        <SRow label="Treatment / Reason" value={confirmation.treatment} />
                        <SRow label="Date & Time" value={confirmation.date} sub={confirmation.time} />
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-1.5">
                        {confirmation.type === "in-clinic" ? (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Hospital Location
                            </span>
                            <p className="font-bold text-sm text-slate-900">
                              TRUDENT Multispeciality Dental Hospital
                            </p>
                            <p className="text-[11px] text-slate-500">{CLINIC_ADDRESS}</p>
                            <a
                              href={CLINIC_MAPS_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1"
                            >
                              <ExternalLink className="h-3 w-3" /> Get Directions
                            </a>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Online Video Call Details
                            </span>
                            <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs text-slate-600 leading-relaxed">
                              Your online consultation link will be shared by the hospital before the scheduled time. Please keep your phone ({confirmation.patientMobile}) available.
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <Link to="/patientdashboard" className="w-full sm:w-auto">
                        <Button className="w-full h-11 px-7 rounded-xl font-semibold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white cursor-pointer">
                          View in My Appointments
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm border-slate-300 cursor-pointer"
                      >
                        Book Another Appointment
                      </Button>
                      <Link to="/" className="w-full sm:w-auto">
                        <Button variant="ghost" className="w-full h-11 px-5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AppointmentPage;
