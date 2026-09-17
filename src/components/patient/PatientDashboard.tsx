import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Search,
  CalendarDays,
  Clock,
  FileText,
  CalendarPlus,
  ExternalLink,
  MapPin,
  Building2,
  MonitorSmartphone,
  Eye,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileBarChart,
  Pill,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Phone,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppointments, Appointment } from "@/context/AppointmentsContext";
import { parseISO, isAfter, startOfDay, format, isBefore } from "date-fns";
import { NotificationPopover } from "@/components/common/NotificationPopover";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppointmentDetailsModal } from "@/components/common/AppointmentDetailsModal";
import { TimeSlot } from "@/components/common/TimeSlot";

import PatientSidebar from "./PatientSidebar";
import AppointmentsTab from "./AppointmentsTab";
import DocumentsTab from "./DocumentsTab";
import ProfileTab from "./ProfileTab";
import BookAppointmentView from "./BookAppointmentView";

const RESCHEDULE_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM",
];

interface RecentDocItem {
  id: string | number;
  name: string;
  type: "Prescription" | "Dental Report" | "Medical Document";
  date: string;
  source: "prescription" | "report";
}

const STATIC_REPORTS: RecentDocItem[] = [
  { id: "doc-1", name: "Dental Checkup Report", type: "Dental Report", date: "2026-02-20", source: "report" },
  { id: "doc-2", name: "X-Ray - Upper Jaw", type: "Medical Document", date: "2026-02-15", source: "report" },
  { id: "doc-3", name: "Treatment Plan - Root Canal", type: "Dental Report", date: "2026-01-28", source: "report" },
];

const PatientDashboard = () => {
  const [greeting, setGreeting] = useState("Good Afternoon");
  const [activeView, setActiveView] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const username = localStorage.getItem("username") || "Sarah Johnson";
  const patientId = Number(localStorage.getItem("userId") || "1");

  const { appointments, cancelAppointment, rescheduleAppointment, isSlotBooked, prescriptions } = useAppointments();

  // Dynamic time greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filter appointments for current patient
  const myAppointments = useMemo(() => {
    return appointments.filter((a) => a.patient_id === patientId);
  }, [appointments, patientId]);

  const today = startOfDay(new Date());

  // Upcoming appointments (active & >= today)
  const upcomingAppointments = useMemo(() => {
    return myAppointments
      .filter((a) => {
        const d = parseISO(a.appointment_date);
        return (isAfter(d, today) || d.getTime() === today.getTime()) && a.status !== "cancelled";
      })
      .sort((a, b) => parseISO(a.appointment_date).getTime() - parseISO(b.appointment_date).getTime());
  }, [myAppointments, today]);

  // The primary prominent upcoming appointment
  const prominentUpcoming = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Recent/other appointments (sorted descending by date)
  const recentAppointments = useMemo(() => {
    return myAppointments
      .filter((a) => !prominentUpcoming || a.id !== prominentUpcoming.id)
      .sort((a, b) => parseISO(b.appointment_date).getTime() - parseISO(a.appointment_date).getTime())
      .slice(0, 4);
  }, [myAppointments, prominentUpcoming]);

  // Prescriptions for current patient
  const myPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => p.patient_id === patientId);
  }, [prescriptions, patientId]);

  // Combined recent documents list
  const recentDocuments = useMemo<RecentDocItem[]>(() => {
    const rxDocs: RecentDocItem[] = myPrescriptions.map((rx) => ({
      id: `rx-${rx.id}`,
      name: `${rx.diagnosis} Prescription`,
      type: "Prescription",
      date: rx.date,
      source: "prescription",
    }));
    return [...rxDocs, ...STATIC_REPORTS].slice(0, 4);
  }, [myPrescriptions]);

  const totalDocsCount = myPrescriptions.length + STATIC_REPORTS.length;

  // Reschedule submission
  const handleRescheduleSubmit = () => {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) {
      toast({ title: "Please choose date and time", variant: "destructive" });
      return;
    }
    if (isSlotBooked(rescheduleDate, rescheduleTime, rescheduleTarget.doctor_name)) {
      toast({
        title: "Slot already booked",
        description: "This slot is already occupied. Please pick another time.",
        variant: "destructive",
      });
      return;
    }
    rescheduleAppointment(rescheduleTarget.id, rescheduleDate, rescheduleTime);
    toast({
      title: "Appointment Rescheduled",
      description: `Your appointment is rescheduled to ${rescheduleDate} at ${rescheduleTime}.`,
    });
    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleTime("");
  };

  // Cancellation confirmation
  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelAppointment(cancelTarget.id);
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment (#TRU-${cancelTarget.id.toString().padStart(4, "0")}) has been cancelled.`,
    });
    setCancelTarget(null);
  };

  // Quick stat cards (4 cards specified by prompt)
  const statCards = [
    {
      id: "upcoming",
      label: "Upcoming Appointments",
      value: upcomingAppointments.length.toString(),
      icon: CalendarDays,
      sub: upcomingAppointments.length > 0 ? "Confirmed active visits" : "No visits scheduled",
      subColor: upcomingAppointments.length > 0 ? "text-primary font-semibold" : "text-muted-foreground",
    },
    {
      id: "total",
      label: "Total Appointments",
      value: myAppointments.length.toString(),
      icon: CalendarPlus,
      sub: "All-time patient records",
      subColor: "text-muted-foreground",
    },
    {
      id: "documents",
      label: "Medical Documents",
      value: totalDocsCount.toString(),
      icon: FileText,
      sub: `${myPrescriptions.length} prescriptions, ${STATIC_REPORTS.length} reports`,
      subColor: "text-muted-foreground",
    },
    {
      id: "next",
      label: "Next Appointment",
      value: prominentUpcoming ? format(parseISO(prominentUpcoming.appointment_date), "MMM d, yyyy") : "None",
      icon: Clock,
      sub: prominentUpcoming ? "Dr. Deepa Koduri" : "Schedule new consultation",
      subColor: prominentUpcoming ? "text-primary font-semibold" : "text-muted-foreground",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/60 antialiased">
        <PatientSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              {/* Left: Trigger & Search */}
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments, prescriptions, records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 md:w-80 h-9 bg-slate-50 border-border/80 text-xs rounded-xl focus-visible:bg-white"
                  />
                </div>
              </div>

              {/* Right: Notifications, Avatar, Name, Label, Logout */}
              <div className="flex items-center gap-3">
                <NotificationPopover />

                <div className="flex items-center gap-2.5 pl-3 border-l border-border/70">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-xs">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-foreground leading-tight">{username}</p>
                    <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider">
                      Patient Portal
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-9 w-9"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {activeView === "dashboard" && (
              <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
                {/* 1. Welcome Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-border/80 shadow-xs">
                  <div className="space-y-1">
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {greeting}, {username} 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      Welcome to your TRUDENT patient portal. Manage your appointments, prescriptions, and clinical records.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveView("book")}
                    className="h-10 px-5 rounded-xl font-semibold gap-2 shadow-xs shrink-0 cursor-pointer text-sm"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Book New Appointment
                  </Button>
                </div>

                {/* 2. Patient Quick Stats (4 cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statCards.map((stat) => (
                    <Card
                      key={stat.id}
                      className="border border-border/80 bg-white shadow-xs hover:border-primary/40 hover:shadow-sm transition-all rounded-2xl"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-extrabold font-heading text-foreground tracking-tight">
                              {stat.value}
                            </p>
                            <p className={`text-xs ${stat.subColor}`}>{stat.sub}</p>
                          </div>
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <stat.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 3. Prominent Upcoming Appointment Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground">Upcoming Appointment</h2>
                      <p className="text-xs text-muted-foreground">Your primary scheduled consultation</p>
                    </div>
                    {prominentUpcoming && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs px-2.5 py-0.5">
                        Next Visit
                      </Badge>
                    )}
                  </div>

                  {prominentUpcoming ? (
                    <Card className="border border-primary/20 bg-white shadow-xs rounded-2xl overflow-hidden hover:border-primary/40 transition-all">
                      <div className="p-5 sm:p-6 space-y-5">
                        {/* Top: Doctor info & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-xs">
                              DK
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading text-lg font-bold text-foreground">
                                  {prominentUpcoming.doctor_name}
                                </h3>
                                <StatusBadge status={prominentUpcoming.status} />
                              </div>
                              <p className="text-xs font-semibold text-primary">
                                Endodontist · Root Canal Specialist
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Treatment: <strong className="text-foreground font-medium">{prominentUpcoming.treatment}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                              ID: #TRU-{prominentUpcoming.id.toString().padStart(4, "0")}
                            </span>
                            <div className="mt-1">
                              {prominentUpcoming.appointment_type === "video" ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">
                                  <MonitorSmartphone className="h-3.5 w-3.5" /> Online Consultation
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                                  <Building2 className="h-3.5 w-3.5" /> In-Clinic Consultation
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Schedule Info Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-primary">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-medium">Appointment Date</p>
                              <p className="text-xs sm:text-sm font-bold text-foreground">
                                {format(parseISO(prominentUpcoming.appointment_date), "EEEE, MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-primary">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-medium">Time Slot</p>
                              <p className="text-xs sm:text-sm font-bold text-foreground">
                                {prominentUpcoming.appointment_time}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Location / Telehealth information banner */}
                        {prominentUpcoming.appointment_type === "in-person" ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              <span>TRUDENT Multispeciality Dental Hospital</span>
                            </div>
                            <a
                              href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                            >
                              <MapPin className="h-3.5 w-3.5" /> Get Directions
                            </a>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/15 text-xs">
                            {prominentUpcoming.meet_link && prominentUpcoming.meet_link.startsWith("http") ? (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <span className="font-medium text-foreground">Telehealth Video Consultation</span>
                                <a
                                  href={prominentUpcoming.meet_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" /> Join Consultation
                                </a>
                              </div>
                            ) : (
                              <p className="text-muted-foreground italic">
                                Your consultation link will be available before the appointment.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/60">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAppointment(prominentUpcoming)}
                            className="rounded-xl text-xs h-9 px-4 gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRescheduleTarget(prominentUpcoming);
                              setRescheduleDate(prominentUpcoming.appointment_date);
                              setRescheduleTime(prominentUpcoming.appointment_time);
                            }}
                            className="rounded-xl text-xs h-9 px-4 gap-1.5"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelTarget(prominentUpcoming)}
                            className="rounded-xl text-xs h-9 px-4 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="border border-dashed border-border bg-white rounded-2xl p-8 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <CalendarDays className="h-6 w-6" />
                        </div>
                        <h3 className="font-heading text-base font-bold text-foreground">No upcoming appointments</h3>
                        <p className="text-xs text-muted-foreground">
                          You currently do not have any active appointments scheduled. Book a consultation with Dr. Deepa Koduri.
                        </p>
                        <Button
                          onClick={() => setActiveView("book")}
                          size="sm"
                          className="rounded-xl text-xs h-9 px-4 mt-2"
                        >
                          Book Appointment
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>

                {/* 4. Recent Appointments & Recent Documents (Two columns layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Appointments (2 cols) */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground">Recent Appointments</h2>
                        <p className="text-xs text-muted-foreground">History and past visits with TRUDENT</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveView("appointments")}
                        className="text-xs text-primary font-semibold hover:text-primary/80 gap-1 p-0 h-auto"
                      >
                        View All <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {recentAppointments.length === 0 ? (
                      <Card className="border border-border/80 bg-white rounded-2xl p-6 text-center">
                        <p className="text-xs text-muted-foreground">No other appointments recorded yet.</p>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {recentAppointments.map((appt) => (
                          <div
                            key={appt.id}
                            className="p-4 rounded-2xl border border-border/80 bg-white shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {/* Left details */}
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                                    #TRU-{appt.id.toString().padStart(4, "0")}
                                  </span>
                                  <span className="text-xs font-bold text-foreground truncate">
                                    {appt.doctor_name}
                                  </span>
                                  <StatusBadge status={appt.status} />
                                </div>
                                <p className="text-xs font-semibold text-primary">{appt.treatment}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Calendar className="h-3 w-3 text-primary" />
                                    {format(parseISO(appt.appointment_date), "MMM d, yyyy")}
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {appt.appointment_time}
                                  </span>
                                  <span>·</span>
                                  <span>
                                    {appt.appointment_type === "video" ? "Online Consultation" : "In-Clinic Consultation"}
                                  </span>
                                </div>
                              </div>

                              {/* Right: action */}
                              <div className="shrink-0 flex items-center justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(appt)}
                                  className="h-8 px-3 rounded-xl text-xs gap-1.5"
                                >
                                  <Eye className="h-3.5 w-3.5" /> View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Documents (1 col) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground">Recent Documents</h2>
                        <p className="text-xs text-muted-foreground">Prescriptions & dental reports</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveView("documents")}
                        className="text-xs text-primary font-semibold hover:text-primary/80 gap-1 p-0 h-auto"
                      >
                        View All <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {recentDocuments.length === 0 ? (
                      <Card className="border border-border/80 bg-white rounded-2xl p-6 text-center">
                        <p className="text-xs text-muted-foreground">No medical documents yet.</p>
                      </Card>
                    ) : (
                      <div className="space-y-2.5">
                        {recentDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-2xl border border-border/80 bg-white shadow-xs hover:border-primary/40 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                {doc.type === "Prescription" ? (
                                  <Pill className="h-4 w-4" />
                                ) : (
                                  <FileBarChart className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-foreground truncate">{doc.name}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {doc.type} · {doc.date}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveView("documents")}
                              className="h-8 px-2.5 text-xs text-primary hover:text-primary/80 shrink-0"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Quick Actions Bar */}
                <div className="p-4 rounded-2xl border border-border/80 bg-white shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>TRUDENT Patient Quick Actions</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveView("book")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" /> Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView("appointments")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5"
                    >
                      <CalendarDays className="h-3.5 w-3.5" /> View Appointments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView("documents")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" /> View Documents
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeView === "book" && (
              <div className="max-w-5xl mx-auto">
                <BookAppointmentView
                  onBooked={() => {
                    setRefreshKey((k) => k + 1);
                    setActiveView("appointments");
                  }}
                />
              </div>
            )}

            {activeView === "appointments" && (
              <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">My Appointments</h1>
                    <p className="text-xs text-muted-foreground">Review your appointments and reschedule if needed</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setActiveView("book")}
                    className="rounded-xl text-xs h-9 px-3 gap-1.5"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> Book New
                  </Button>
                </div>
                <AppointmentsTab key={refreshKey} onBookNew={() => setActiveView("book")} />
              </div>
            )}

            {activeView === "documents" && (
              <div className="max-w-5xl mx-auto animate-fade-in">
                <DocumentsTab />
              </div>
            )}

            {activeView === "profile" && (
              <div className="max-w-4xl mx-auto animate-fade-in">
                <ProfileTab />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Reusable Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onRescheduleClick={(appt) => {
          setSelectedAppointment(null);
          setRescheduleTarget(appt);
          setRescheduleDate(appt.appointment_date);
          setRescheduleTime(appt.appointment_time);
        }}
      />

      {/* Reschedule Dialog */}
      {rescheduleTarget && (
        <Dialog
          open={!!rescheduleTarget}
          onOpenChange={(v) => {
            if (!v) setRescheduleTarget(null);
          }}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg font-bold">Reschedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <p className="text-muted-foreground">
                Rescheduling your consultation with <strong className="text-foreground">{rescheduleTarget.doctor_name}</strong>.
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Appointment Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleTime("");
                  }}
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">New Time Slot</Label>
                {!rescheduleDate ? (
                  <p className="text-xs text-muted-foreground italic">Select a date above to check available slots.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {RESCHEDULE_SLOTS.map((slot) => {
                      const isBooked = isSlotBooked(rescheduleDate, slot, rescheduleTarget.doctor_name);
                      const isSelected = rescheduleTime === slot;
                      return (
                        <TimeSlot
                          key={slot}
                          time={slot}
                          isBooked={isBooked}
                          isSelected={isSelected}
                          onSelect={(s) => setRescheduleTime(s)}
                          compact
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRescheduleTarget(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRescheduleSubmit}
                disabled={
                  !rescheduleDate ||
                  !rescheduleTime ||
                  isSlotBooked(rescheduleDate, rescheduleTime, rescheduleTarget.doctor_name)
                }
                className="rounded-xl text-xs"
              >
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <Dialog
          open={!!cancelTarget}
          onOpenChange={(v) => {
            if (!v) setCancelTarget(null);
          }}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Cancel Appointment?
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 text-xs text-muted-foreground space-y-2">
              <p>
                Are you sure you want to cancel your appointment with{" "}
                <strong className="text-foreground">{cancelTarget.doctor_name}</strong> on{" "}
                <strong className="text-foreground">{cancelTarget.appointment_date}</strong> at{" "}
                <strong className="text-foreground">{cancelTarget.appointment_time}</strong>?
              </p>
              <p className="text-destructive font-medium">
                This action will release your time slot back to other patients.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelTarget(null)}
                className="rounded-xl text-xs"
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmCancel}
                className="rounded-xl text-xs"
              >
                Yes, Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  );
};

export default PatientDashboard;
