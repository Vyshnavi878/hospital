import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HospitalNavbar } from "@/components/common/HospitalNavbar";
import { DoctorCard } from "@/components/common/DoctorCard";
import { DoctorProfileModal } from "@/components/common/DoctorProfileModal";
import { EmergencyInfoModal } from "@/components/common/EmergencyInfoModal";
import { ContactSection } from "@/components/common/ContactSection";
import { LegalModal } from "@/components/common/LegalModal";
import { useAppointments, Doctor } from "@/context/AppointmentsContext";
import {
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldCheck,
  Sparkles,
  Clock,
  Phone,
  MapPin,
  Search,
  ArrowRight,
  ChevronRight,
  Star,
  Quote,
  Building,
  CheckCircle2,
  Users,
  CalendarDays,
  Shield,
  PhoneCall,
  Video,
  FileText,
  AlertTriangle,
  Heart,
  RotateCcw,
  X,
  Filter,
  FlaskConical,
  ClipboardCheck,
} from "lucide-react";
import heroImage from "@/assets/hospital-consultation.jpg";

// Clinical Departments (verified against actual application doctors)
const DEPARTMENTS = [
  {
    id: "cardiology",
    title: "Cardiology",
    specialty: "Cardiology",
    icon: HeartPulse,
    desc: "Comprehensive diagnostic cardiology, heart checkups, ECG evaluation, and cardiovascular disease management.",
  },
  {
    id: "neurology",
    title: "Neurology",
    specialty: "Neurology",
    icon: ShieldCheck,
    desc: "Advanced clinical care for migraines, chronic headaches, neuropathy, and neurological wellness.",
  },
  {
    id: "orthopedics",
    title: "Orthopedics",
    specialty: "Orthopedics",
    icon: Activity,
    desc: "Joint health, arthritis treatment, sports injury rehabilitation, and spine & musculoskeletal consultations.",
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    specialty: "Pediatrics",
    icon: Users,
    desc: "Comprehensive child healthcare, infant wellness checkups, immunizations, and developmental monitoring.",
  },
  {
    id: "dermatology",
    title: "Dermatology",
    specialty: "Dermatology",
    icon: Sparkles,
    desc: "Clinical evaluation of skin conditions, acne therapies, allergic skin conditions, and preventive dermatology.",
  },
  {
    id: "general-medicine",
    title: "General Medicine",
    specialty: "General Medicine",
    icon: Heart,
    desc: "Primary health evaluations, lifestyle disease management, routine vitals, and diagnostic checkups.",
  },
  {
    id: "dentistry",
    title: "Dentistry",
    specialty: "Dentistry",
    icon: Stethoscope,
    desc: "General dental exams, restorative treatments, teeth cleaning, root canal care, and cosmetic oral care.",
  },
];

// Healthcare Services (aligned with hospital capabilities)
const SERVICES_DATA = [
  {
    title: "Doctor Consultation",
    icon: Stethoscope,
    desc: "Scheduled face-to-face outpatient appointments with certified hospital physicians and medical staff.",
    features: ["Confirmed Token", "OPD Wing Access", "In-Person Review"],
  },
  {
    title: "Specialist Consultation",
    icon: Users,
    desc: "Focused appointments with experienced specialists across cardiology, neurology, orthopedics, and pediatrics.",
    features: ["Specialist Care", "Clinical History Review", "Follow-up Plans"],
  },
  {
    title: "Diagnostics",
    icon: Activity,
    desc: "Coordinated diagnostic evaluations, blood pressure monitoring, ECG tests, and specialist imaging referrals.",
    features: ["Hospital Vitals", "ECG Monitoring", "Imaging Referral"],
  },
  {
    title: "Health Checkups",
    icon: ClipboardCheck,
    desc: "Routine physical examinations, preventive wellness checkups, and age-appropriate clinical screening packages.",
    features: ["Full Physical Exam", "Vitals Baseline", "Preventive Advisory"],
  },
  {
    title: "Laboratory Services",
    icon: FlaskConical,
    desc: "Hospital coordination for routine pathology tests, blood panels, and digital reports delivered to your portal.",
    features: ["Pathology Panels", "Digital Records", "Physician Review"],
  },
  {
    title: "Preventive Care",
    icon: Shield,
    desc: "Proactive screening for chronic health risks, immunization tracking, and personalized lifestyle guidance.",
    features: ["Immunization", "Chronic Risk Check", "Lifestyle Support"],
  },
];

// Why Choose Us (factual capability-based points)
const WHY_CHOOSE_US = [
  {
    title: "Experienced Healthcare Professionals",
    desc: "Qualified medical physicians and specialists with verified credentials and dedicated outpatient consultation hours.",
    icon: Stethoscope,
  },
  {
    title: "Multiple Medical Specialties",
    desc: "Integrated clinical departments covering cardiology, neurology, orthopedics, pediatrics, dermatology, general medicine, and dentistry.",
    icon: HeartPulse,
  },
  {
    title: "Convenient Online Booking",
    desc: "Real-time appointment scheduling enabling patients to pick open calendar slots without long clinic queues.",
    icon: CalendarDays,
  },
  {
    title: "Clear Appointment Scheduling",
    desc: "Transparent date, time, and doctor confirmation with instant digital consultation tokens.",
    icon: Clock,
  },
  {
    title: "Patient-focused Experience",
    desc: "Compassionate bedside manner designed to minimize waiting times and prioritize patient well-being.",
    icon: Heart,
  },
];

// How Appointment Booking Works (3 Simple Steps)
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Find a Doctor",
    desc: "Search doctor name or explore medical specialties to find the right physician for your health needs.",
    icon: Search,
  },
  {
    step: "02",
    title: "Choose Date & Time",
    desc: "View live open time slots and select an appointment window that aligns with your schedule.",
    icon: CalendarDays,
  },
  {
    step: "03",
    title: "Confirm Appointment",
    desc: "Review consultation details, submit your booking, and receive your digital appointment token immediately.",
    icon: CheckCircle2,
  },
];

// Patient Reviews
const TESTIMONIALS = [
  {
    name: "Rajesh Malhotra",
    department: "Cardiology Patient",
    text: "Booking with Dr. James Wilson on CarePulse was straightforward. The consultation was thorough, professional, and on schedule without long hospital wait times.",
    rating: 5,
  },
  {
    name: "Sneha Kapoor",
    department: "Dental Clinic Patient",
    text: "Dr. Deepa Koduri and the dental staff made my treatment completely stress-free. Clean clinic, friendly staff, and very clear post-visit instructions.",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    department: "Dermatology Patient",
    text: "The video consultation option saved me hours of travel. Dr. Maria Santos listened carefully and the prescription was immediately available on my dashboard.",
    rating: 5,
  },
];

const LandingPage = () => {
  const { doctors } = useAppointments();
  const navigate = useNavigate();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [selectedDayFilter, setSelectedDayFilter] = useState("All");
  const [selectedExpFilter, setSelectedExpFilter] = useState("All");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const [profileModalDoctor, setProfileModalDoctor] = useState<Doctor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmergencyInfoOpen, setIsEmergencyInfoOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const activeDoctors = useMemo(() => doctors.filter((d) => d.status === "active"), [doctors]);

  // Limited number of featured specialists from active doctors
  const featuredDoctors = useMemo(() => {
    const featuredIds = [100, 102, 105, 106]; // Dr. James Wilson (Cardiology), Dr. Robert Chen (Orthopedics), Dr. Lisa Park (Neurology), Dr. Ahmed Khan (Pediatrics)
    const selected = activeDoctors.filter((d) => featuredIds.includes(d.id));
    return selected.length >= 4 ? selected : activeDoctors.slice(0, 4);
  }, [activeDoctors]);

  const filteredDoctors = useMemo(() => {
    let list = activeDoctors;

    // 1. Specialty Filter
    if (selectedDeptFilter !== "All") {
      list = list.filter((d) => d.specialty.toLowerCase() === selectedDeptFilter.toLowerCase());
    }

    // 2. Availability Filter
    if (selectedDayFilter !== "All") {
      list = list.filter((d) => d.availableDays?.includes(selectedDayFilter));
    }

    // 3. Experience Filter
    if (selectedExpFilter !== "All") {
      const minYears = parseInt(selectedExpFilter, 10);
      list = list.filter((d) => {
        const docYears = parseInt(d.experience || "0", 10);
        return docYears >= minYears;
      });
    }

    // 4. Search Filter (doctor name, specialty, qualifications, or about)
    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          (d.qualifications && d.qualifications.toLowerCase().includes(q)) ||
          (d.about && d.about.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeDoctors, selectedDeptFilter, selectedDayFilter, selectedExpFilter, doctorSearch]);

  const hasActiveFilters =
    doctorSearch.trim() !== "" ||
    selectedDeptFilter !== "All" ||
    selectedDayFilter !== "All" ||
    selectedExpFilter !== "All";

  const handleClearFilters = () => {
    setDoctorSearch("");
    setHeroSearch("");
    setSelectedDeptFilter("All");
    setSelectedDayFilter("All");
    setSelectedExpFilter("All");
  };

  const handleViewAllDoctors = () => {
    handleClearFilters();
    scrollToSection("doctors");
  };

  const handleViewDeptDoctors = (specialty: string) => {
    setSelectedDeptFilter(specialty);
    setSelectedDayFilter("All");
    setSelectedExpFilter("All");
    setDoctorSearch("");
    scrollToSection("doctors");
  };

  const handleViewProfile = (doctor: Doctor) => {
    setProfileModalDoctor(doctor);
    setIsProfileModalOpen(true);
  };

  const handleBookDoctor = (doc?: Doctor | React.MouseEvent) => {
    const doctorObj = doc && typeof doc === "object" && "id" in doc ? (doc as Doctor) : undefined;
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/patientdashboard", { state: { preselectedDoctor: doctorObj } });
    } else {
      navigate("/login", { state: { preselectedDoctor: doctorObj } });
    }
  };

  const handleBookAppointment = () => {
    handleBookDoctor();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleHeroSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDoctorSearch(heroSearch);
    scrollToSection("doctors");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 1. Modern Hospital Navbar */}
      <HospitalNavbar />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* SECTION 1: PUBLIC HOMEPAGE HERO */}
        {/* ============================================================ */}
        <section
          id="home"
          aria-label="CarePulse Hospital Welcome and Doctor Search"
          className="relative overflow-hidden bg-white border-b border-slate-200 py-10 sm:py-16 lg:py-20 scroll-mt-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column (Desktop) / Top Flow (Mobile) */}
              <div className="lg:col-span-7 flex flex-col space-y-5 text-left">
                {/* 1. Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-semibold text-primary w-fit">
                  <HeartPulse className="h-3.5 w-3.5" />
                  <span>COMPASSIONATE CARE • ADVANCED MEDICINE</span>
                </div>

                {/* 2. Main Heading */}
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                  Comprehensive Healthcare, <br className="hidden sm:inline" />
                  <span className="text-primary">Made Simple.</span>
                </h1>

                {/* 3. Supporting Text */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Find experienced doctors, explore medical specialties, and schedule appointments conveniently online.
                </p>

                {/* 4. Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Button
                    id="hero-book-appointment-btn"
                    size="lg"
                    onClick={handleBookDoctor}
                    className="h-11 sm:h-12 px-6 font-semibold gap-2 shadow-xs text-sm sm:text-base cursor-pointer justify-center"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Book an Appointment</span>
                    <ArrowRight className="h-4 w-4 opacity-80" />
                  </Button>

                  <Button
                    id="hero-find-doctor-btn"
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection("doctors")}
                    className="h-11 sm:h-12 px-5 font-semibold text-sm sm:text-base text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100 cursor-pointer justify-center"
                  >
                    <Search className="h-4 w-4 text-primary mr-1" />
                    <span>Find a Doctor</span>
                  </Button>
                </div>

                {/* 5. Trust Elements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Experienced Doctors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Multiple Specialties</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Easy Online Booking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Patient-focused Care</span>
                  </div>
                </div>

                {/* 6. Prominent Doctor Search Element */}
                <div className="pt-2">
                  <form
                    onSubmit={handleHeroSearch}
                    aria-label="Doctor search"
                    className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-2.5 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="hero-doctor-search-input"
                          type="text"
                          placeholder="Search doctors or specialties..."
                          value={heroSearch}
                          onChange={(e) => setHeroSearch(e.target.value)}
                          className="pl-10 h-10 sm:h-11 bg-white border-slate-200 text-sm focus-visible:ring-primary"
                        />
                      </div>
                      <Button
                        id="hero-doctor-search-submit"
                        type="submit"
                        className="h-10 sm:h-11 px-5 font-semibold gap-2 text-sm shrink-0 cursor-pointer justify-center"
                      >
                        <Search className="h-4 w-4" />
                        <span>Find Doctor</span>
                      </Button>
                    </div>
                    {/* Medical Specialties Quick Filter */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-600 text-[11px]">Specialties:</span>
                      {["Cardiology", "Orthopedics", "Dermatology", "Dentistry", "Pediatrics"].map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => {
                            setHeroSearch(spec);
                            setDoctorSearch(spec);
                            scrollToSection("doctors");
                          }}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors text-[11px] font-medium cursor-pointer"
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Healthcare Visual */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                  <img
                    src={heroImage}
                    alt="Doctor consultation at CarePulse Health Multi-Specialty Hospital"
                    className="h-60 sm:h-72 lg:h-96 w-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        Multi-Specialty Consultation Center
                      </span>
                      <Badge variant="outline" className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
                        Appointments Open
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      CarePulse Central Hospital
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>123 Healthcare Boulevard, Mumbai • Outpatient & Telehealth</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION: FEATURED DOCTORS */}
        {/* ============================================================ */}
        <section id="featured-doctors" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge
                variant="outline"
                className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
              >
                Hospital Medical Leadership
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Featured Doctors
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Consult with experienced clinical department specialists dedicated to comprehensive patient healthcare.
              </p>
            </div>

            {/* Featured Doctors Grid: Curated limited active doctors */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDoctors.map((doc) => (
                <DoctorCard
                  key={`featured-${doc.id}`}
                  doctor={doc}
                  onBookAppointment={() => handleBookDoctor(doc)}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>

            {/* CTA Connecting to Find Doctor Section */}
            <div className="mt-10 text-center">
              <Button
                id="featured-view-all-cta"
                variant="outline"
                size="lg"
                onClick={() => {
                  handleClearFilters();
                  scrollToSection("doctors");
                }}
                className="h-11 px-8 font-semibold text-sm border-slate-300 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer gap-2"
              >
                <Users className="h-4 w-4 text-primary" />
                <span>View All Doctors</span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Explore our directory of all hospital physicians across 7 clinical specialties
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: FIND A DOCTOR */}
        {/* ============================================================ */}
        <section id="doctors" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Qualified Medical Specialists
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Find the Right Doctor for You
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Explore doctors by specialty and find an appointment that works for you.
              </p>
            </div>

            {/* Specialty Quick-Filter Chips */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar px-1">
              {["All", "Cardiology", "Dermatology", "Orthopedics", "Dentistry", "Neurology", "Pediatrics"].map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDeptFilter === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDeptFilter(dept)}
                  className="text-xs shrink-0 rounded-full h-8 px-4 font-medium transition-all cursor-pointer"
                >
                  {dept === "All" ? "All Specialties" : dept}
                </Button>
              ))}
            </div>

            {/* Search and Structured Filters Bar */}
            <div className="max-w-4xl mx-auto mb-8 p-3 sm:p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Search doctor name or specialty */}
                <div className="sm:col-span-6 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="doctor-search-input"
                    type="text"
                    placeholder="Search doctor name or specialty..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="pl-10 pr-9 h-10 bg-slate-50/50 border-slate-200 text-sm focus-visible:ring-primary rounded-xl"
                  />
                  {doctorSearch && (
                    <button
                      type="button"
                      onClick={() => setDoctorSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Availability Filter */}
                <div className="sm:col-span-3">
                  <Select value={selectedDayFilter} onValueChange={setSelectedDayFilter}>
                    <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 text-xs sm:text-sm rounded-xl">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Days (Any)</SelectItem>
                      <SelectItem value="Mon">Monday</SelectItem>
                      <SelectItem value="Tue">Tuesday</SelectItem>
                      <SelectItem value="Wed">Wednesday</SelectItem>
                      <SelectItem value="Thu">Thursday</SelectItem>
                      <SelectItem value="Fri">Friday</SelectItem>
                      <SelectItem value="Sat">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Filter */}
                <div className="sm:col-span-3">
                  <Select value={selectedExpFilter} onValueChange={setSelectedExpFilter}>
                    <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 text-xs sm:text-sm rounded-xl">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Any Experience</SelectItem>
                      <SelectItem value="5">5+ Years Exp</SelectItem>
                      <SelectItem value="10">10+ Years Exp</SelectItem>
                      <SelectItem value="12">12+ Years Exp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-700 text-[11px]">Active Filters:</span>
                    {doctorSearch && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[11px]">
                        "{doctorSearch}"
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setDoctorSearch("")} />
                      </span>
                    )}
                    {selectedDeptFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px]">
                        Specialty: {selectedDeptFilter}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDeptFilter("All")} />
                      </span>
                    )}
                    {selectedDayFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px]">
                        Day: {selectedDayFilter}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDayFilter("All")} />
                      </span>
                    )}
                    {selectedExpFilter !== "All" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px]">
                        Exp: {selectedExpFilter}+ Yrs
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedExpFilter("All")} />
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2 font-medium cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset All
                  </Button>
                </div>
              )}
            </div>

            {/* Results Count & Booking Status */}
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>
                Showing <strong className="text-slate-900 font-semibold">{filteredDoctors.length}</strong> {filteredDoctors.length === 1 ? "specialist" : "specialists"}
              </span>
              {filteredDoctors.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Direct Online Appointment Booking
                </span>
              )}
            </div>

            {/* Doctors Grid / Empty State */}
            {filteredDoctors.length === 0 ? (
              <div className="py-16 px-4 text-center max-w-md mx-auto rounded-2xl border border-dashed border-slate-300 bg-white shadow-2xs space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    No doctors found
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Try a different doctor name or specialty.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="gap-2 text-xs font-semibold cursor-pointer border-slate-300 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear Filters</span>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onBookAppointment={() => handleBookDoctor(doc)}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <Button
                id="view-all-doctors-cta"
                variant="outline"
                size="lg"
                onClick={handleViewAllDoctors}
                className="h-11 px-8 font-semibold text-sm border-slate-300 hover:bg-slate-100 text-slate-800 shadow-2xs cursor-pointer gap-2"
              >
                <Users className="h-4 w-4 text-primary" />
                <span>View All Doctors</span>
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Need emergency medical care? Call our 24/7 Casualty Hotline: +91 90635 84448
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: DEPARTMENTS */}
        {/* ============================================================ */}
        <section id="departments" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Clinical Specializations
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Our Medical Departments
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Explore our specialized clinical hospital departments staffed with experienced multi-disciplinary physicians and surgeons.
              </p>
            </div>

            {/* Responsive Departments Grid: Mobile 1 col, Tablet 2 col, Desktop 3-4 cols */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DEPARTMENTS.map((dept) => {
                const Icon = dept.icon;
                return (
                  <div
                    key={dept.id}
                    className="group rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 text-left shadow-2xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Subtle Visual Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 shadow-2xs">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Specialty
                        </span>
                      </div>

                      {/* Department Name */}
                      <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                        {dept.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {dept.desc}
                      </p>
                    </div>

                    {/* View Doctors Action */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDeptDoctors(dept.specialty)}
                        className="w-full justify-between h-9 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white border-primary/25 rounded-xl cursor-pointer group/btn transition-all"
                      >
                        <span>View Doctors</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: HEALTHCARE SERVICES */}
        {/* ============================================================ */}
        <section id="services" className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Patient Care Offerings
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Healthcare Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Comprehensive hospital healthcare offerings designed for outpatient consultations, diagnostics, and preventative care.
              </p>
            </div>

            {/* Responsive Services Grid: Mobile 1 col, Tablet 2 col, Desktop 3 cols */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_DATA.map((srv) => {
                const Icon = srv.icon;
                return (
                  <div
                    key={srv.title}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 text-left shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Icon & Service Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800 border border-slate-200/60">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
                          Hospital Service
                        </Badge>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                        {srv.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {srv.desc}
                      </p>

                      {/* Clinical Highlights */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {srv.features.map((feat) => (
                          <span
                            key={feat}
                            className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Schedule Consultation Action */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleBookDoctor}
                        className="w-full h-9 text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-50 rounded-xl cursor-pointer gap-1.5 justify-center"
                      >
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        <span>Book Appointment</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: WHY CHOOSE US */}
        {/* ============================================================ */}
        <section id="why-choose-us" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Our Capabilities
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Why Choose CarePulse Health
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Factual, capability-based standards designed for reliable, transparent, and patient-focused care.
              </p>
            </div>

            {/* Factual 5-Item Capability Grid */}
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {WHY_CHOOSE_US.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 text-left space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: HOW APPOINTMENT BOOKING WORKS */}
        {/* ============================================================ */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Simple Scheduling Flow
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Book Your Appointment in 3 Simple Steps
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Schedule your consultation with our hospital specialists in three straightforward steps.
              </p>
            </div>

            {/* 3 Simple Steps with Visual Progression */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 relative">
              {HOW_IT_WORKS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative p-6 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all duration-200 text-left space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Step Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Step {step.step}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-heading font-bold text-lg text-slate-900">
                        {step.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Progression Arrow between Step 1 and 2, and Step 2 and 3 on desktop */}
                    {idx < 2 && (
                      <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 text-primary shadow-2xs">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Central CTA */}
            <div className="mt-10 text-center space-y-2">
              <Button
                id="how-it-works-book-btn"
                size="lg"
                onClick={handleBookDoctor}
                className="h-11 px-8 font-semibold gap-2 shadow-xs cursor-pointer text-sm"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Book Appointment</span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Button>
              <p className="text-xs text-slate-500">
                Transparent scheduling with real-time doctor availability
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7: EMERGENCY & URGENT CARE */}
        {/* ============================================================ */}
        <section id="emergency" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/80 via-white to-red-50/40 p-6 sm:p-10 lg:p-12 text-left shadow-sm relative overflow-hidden">
              {/* Emergency background watermark */}
              <div className="absolute -right-10 -bottom-10 opacity-5 text-rose-900 pointer-events-none">
                <HeartPulse className="w-80 h-80" />
              </div>

              <div className="relative z-10 space-y-8">
                {/* Header & Urgency Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/90 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                      </span>
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      <span>24/7 Acute Casualty & Trauma Support</span>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                      Emergency & Urgent Care
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/80 border border-rose-200/70 px-3.5 py-2 rounded-xl shrink-0">
                    <Clock className="h-4 w-4 text-rose-600" />
                    <span>Casualty Open 24 Hours / 365 Days</span>
                  </div>
                </div>

                {/* Primary Urgent Message */}
                <div className="space-y-2 max-w-3xl">
                  <p className="text-base sm:text-lg font-bold text-rose-950">
                    For urgent medical assistance, contact the hospital/emergency service immediately.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    If you or someone nearby is experiencing acute chest pain, severe shortness of breath, sudden trauma, open fractures, stroke signs, or loss of consciousness, contact our 24-hour emergency casualty desk directly or arrive at our emergency entrance immediately.
                  </p>
                </div>

                {/* Main Action CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  {/* [Call Hospital] with verified real phone link */}
                  <a
                    id="emergency-call-btn"
                    href="tel:+919063584448"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <PhoneCall className="h-5 w-5" />
                    <span>Call Hospital: +91 90635 84448</span>
                  </a>

                  {/* [Emergency Information] modal trigger */}
                  <Button
                    id="emergency-info-btn"
                    type="button"
                    variant="outline"
                    onClick={() => setIsEmergencyInfoOpen(true)}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border-rose-300 text-rose-900 bg-white hover:bg-rose-50 font-semibold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-rose-600" />
                    <span>Emergency Information</span>
                  </Button>
                </div>

                {/* Critical Symptoms Red Flags Grid */}
                <div className="pt-2 space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                    Immediate Life-Threatening Indicators (Require Immediate Emergency Care)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white border border-rose-100 shadow-2xs space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-rose-600" />
                        Severe Chest Pain
                      </p>
                      <p className="text-slate-500">
                        Crushing central pressure, pain radiating to left arm, neck, or jaw.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-rose-100 shadow-2xs space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-rose-600" />
                        Breathing Distress
                      </p>
                      <p className="text-slate-500">
                        Severe asthma attack, choking, or sudden inability to breathe.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-rose-100 shadow-2xs space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-rose-600" />
                        Stroke Warning (FAST)
                      </p>
                      <p className="text-slate-500">
                        Sudden facial drooping, arm weakness, or slurred/garbled speech.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-rose-100 shadow-2xs space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-rose-600" />
                        Trauma & Hemorrhage
                      </p>
                      <p className="text-slate-500">
                        Uncontrolled bleeding, deep head injuries, or major physical trauma.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Distinction Banner: Routine Care vs Emergency */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Routine Appointments & Non-Emergency Consultations
                    </p>
                    <p className="text-slate-500">
                      Emergency casualty is designated for acute emergencies. For general medical checkups, chronic ailment reviews, or outpatient specialist consultations, please use our regular booking calendar.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToSection("doctors")}
                    className="shrink-0 text-xs font-semibold gap-1.5 h-9 px-4 border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    <span>Book Routine Doctor Visit</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 8: ABOUT HOSPITAL */}
        {/* ============================================================ */}
        <section id="about" className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center text-left">
              {/* Left Column: Hospital Visual Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                  <img
                    src={heroImage}
                    alt="CarePulse Multi-Specialty Hospital Consultation"
                    className="h-64 sm:h-80 lg:h-96 w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        Outpatient Hospital Suites
                      </span>
                      <Badge variant="outline" className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
                        OPD Mon – Sat
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      CarePulse Central Hospital
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>123 Healthcare Boulevard, Mumbai</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Concise Text + Capability Highlights */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                    About CarePulse Health
                  </Badge>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                    Modern Multi-Specialty Care with Effortless Scheduling
                  </h2>
                </div>

                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    CarePulse Health is a modern multi-specialty hospital and digital healthcare appointment platform. We unite clinical excellence across primary and specialized medicine with an intuitive digital scheduling experience.
                  </p>
                  <p>
                    Patients can discover experienced physicians across departments, view verified credentials, and book confirmed consultation appointments online without clinic queues or unnecessary paperwork.
                  </p>
                </div>

                {/* Capability Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                      <span>7 Medical Specialties</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Integrated clinical departments under one institution.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span>Verified Physicians</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Experienced specialists with transparent qualifications.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                      <span>Confirmed Tokens</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Guaranteed consultation windows with live availability.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <Video className="h-4 w-4 text-primary shrink-0" />
                      <span>In-Person & Telehealth</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Outpatient hospital visits or secure video consultations.
                    </p>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => scrollToSection("doctors")}
                    className="h-10 px-5 text-xs font-semibold gap-2 shadow-xs cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    <span>Browse Hospital Doctors</span>
                  </Button>
                  <button
                    onClick={() => scrollToSection("departments")}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Explore Medical Departments →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 10: PATIENT REVIEWS (DEMO DATA) */}
        {/* ============================================================ */}
        <section id="reviews" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <Badge
                variant="outline"
                className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 border-slate-300 bg-slate-50"
              >
                Patient Feedback (Demo)
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Patient Experiences
              </h2>
              <p className="text-sm text-slate-600">
                Simulated feedback illustrating patient consultation scheduling and clinic care experiences.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 text-left">
              {TESTIMONIALS.map((t) => (
                <Card
                  key={t.name}
                  className="border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition-shadow rounded-2xl flex flex-col justify-between"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Quote className="h-6 w-6 text-primary/30" />
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Demo Feedback
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{t.text}"
                    </p>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <p className="font-heading text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-primary font-medium">{t.department}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-6 text-center italic">
              * Note: Testimonials above represent demonstration data for platform evaluation.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 11: CONTACT CAREPULSE HEALTH */}
        {/* ============================================================ */}
        <ContactSection />
      </main>

      {/* ============================================================ */}
      {/* 12. PROFESSIONAL HOSPITAL FOOTER */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 py-14 sm:py-16 text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Footer Grid: Desktop multi-column, Mobile stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-10 text-left">
            {/* Column 1: CarePulse Health Brand Info */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-label="CarePulse Health Homepage"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-lg font-extrabold tracking-tight text-white leading-none">
                    CAREPULSE <span className="text-primary font-bold">HEALTH</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                    Multi-Specialty Hospital
                  </span>
                </div>
              </Link>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                CarePulse Health unites clinical healthcare excellence across 7 medical departments with seamless online doctor appointments and transparent patient scheduling.
              </p>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <p className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>123 Healthcare Boulevard, Central Mumbai</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>General Reception: +91 90635 84448</span>
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("home");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#doctors"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("doctors");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Doctors
                  </a>
                </li>
                <li>
                  <a
                    href="#departments"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("departments");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Departments
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("services");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("about");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("contact");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Patient Portal */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Patient
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    className="text-left hover:text-white transition-colors py-1 block cursor-pointer"
                  >
                    Book Appointment
                  </button>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Register Patient
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Emergency */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-rose-400">
                Emergency
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsEmergencyInfoOpen(true)}
                    className="text-left hover:text-white transition-colors py-1 block cursor-pointer"
                  >
                    Emergency Information
                  </button>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("contact");
                    }}
                    className="hover:text-white transition-colors py-1 block"
                  >
                    Hospital Contact
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href="tel:+919063584448"
                    className="inline-flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300 py-1 transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>+91 90635 84448</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Legal
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-left hover:text-white transition-colors py-1 block cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-left hover:text-white transition-colors py-1 block cursor-pointer"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 CAREPULSE HEALTH. All rights reserved. Dedicated to patient care and clinical excellence.</p>
            <p className="text-[11px] text-slate-500">
              Online Doctor Appointment & Hospital Booking System
            </p>
          </div>
        </div>
      </footer>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={profileModalDoctor}
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        onBookAppointment={(doc) => {
          setIsProfileModalOpen(false);
          handleBookDoctor(doc);
        }}
      />

      {/* Emergency Casualty & Triage Information Modal */}
      <EmergencyInfoModal
        open={isEmergencyInfoOpen}
        onOpenChange={setIsEmergencyInfoOpen}
        onBookRoutine={() => scrollToSection("doctors")}
      />

      {/* Legal Modals: Privacy Policy & Terms of Service */}
      <LegalModal
        open={isPrivacyModalOpen}
        onOpenChange={setIsPrivacyModalOpen}
        type="privacy"
      />
      <LegalModal
        open={isTermsModalOpen}
        onOpenChange={setIsTermsModalOpen}
        type="terms"
      />
    </div>
  );
};

export default LandingPage;
