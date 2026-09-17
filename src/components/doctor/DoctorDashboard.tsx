import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, isSameDay, isAfter, startOfDay, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LogOut,
  Search,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  ExternalLink,
  Building2,
  MonitorSmartphone,
  Check,
  X,
  FileText,
  Eye,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  History,
  FileSignature,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppointments, Appointment } from "@/context/AppointmentsContext";
import { NotificationPopover } from "@/components/common/NotificationPopover";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useToast } from "@/hooks/use-toast";

import DoctorSidebar from "./DoctorSidebar";
import DoctorAppointmentsTab from "./DoctorAppointmentsTab";
import PrescriptionsTab from "./PrescriptionsTab";
import DoctorProfileTab from "./DoctorProfileTab";

const DOCTOR_NAME = "Dr. Deepa Koduri";

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const DoctorDashboard = () => {
  const [greeting, setGreeting] = useState("Good Afternoon");
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Preselection state for writing prescription
  const [prescriptionPatient, setPrescriptionPatient] = useState("");
  const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { appointments, updateStatus } = useAppointments();

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

  // Filter appointments for Dr. Deepa Koduri
  const doctorAppointments = useMemo(() => {
    return appointments.filter(
      (a) =>
        a.doctor_name === DOCTOR_NAME ||
        a.doctor_name.toLowerCase().includes("deepa") ||
        a.doctor_name.toLowerCase().includes("koduri") ||
        !a.doctor_name
    );
  }, [appointments]);

  const today = startOfDay(new Date());

  // 1. Today's Appointments (sorted chronologically by true time)
  const todayAppts = useMemo(() => {
    return doctorAppointments
      .filter((a) => isSameDay(parseISO(a.appointment_date), today))
      .sort((a, b) => parseTimeToMinutes(a.appointment_time) - parseTimeToMinutes(b.appointment_time));
  }, [doctorAppointments, today]);

  // 2. Pending Appointments (awaiting action)
  const pendingAppts = useMemo(() => {
    return doctorAppointments.filter((a) => a.status === "pending");
  }, [doctorAppointments]);

  // 3. Completed Today
  const completedToday = useMemo(() => {
    return todayAppts.filter((a) => a.status === "completed");
  }, [todayAppts]);

  // 4. Upcoming Appointments (future dates > today and active)
  const upcomingAppts = useMemo(() => {
    return doctorAppointments
      .filter((a) => isAfter(parseISO(a.appointment_date), today) && a.status !== "cancelled")
      .sort((a, b) => parseISO(a.appointment_date).getTime() - parseISO(b.appointment_date).getTime());
  }, [doctorAppointments, today]);

  // 5. Recent Completed Consultations
  const recentConsultations = useMemo(() => {
    return doctorAppointments
      .filter((a) => a.status === "completed")
      .sort((a, b) => parseISO(b.appointment_date).getTime() - parseISO(a.appointment_date).getTime())
      .slice(0, 5);
  }, [doctorAppointments]);

  // Stat cards (4 cards specified by prompt)
  const statCards = [
    {
      id: "today",
      label: "Today's Appointments",
      value: todayAppts.length.toString(),
      icon: CalendarDays,
      sub: `${todayAppts.filter((a) => a.status === "confirmed").length} confirmed visits`,
      subColor: "text-accent font-semibold",
    },
    {
      id: "pending",
      label: "Pending Appointments",
      value: pendingAppts.length.toString(),
      icon: AlertCircle,
      sub: pendingAppts.length > 0 ? "Requires doctor action" : "All up to date",
      subColor: pendingAppts.length > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground",
    },
    {
      id: "completed",
      label: "Completed Today",
      value: completedToday.length.toString(),
      icon: CheckCircle2,
      sub: "Concluded consultations",
      subColor: "text-emerald-600 font-semibold",
    },
    {
      id: "upcoming",
      label: "Upcoming Appointments",
      value: upcomingAppts.length.toString(),
      icon: Clock,
      sub: "Future scheduled visits",
      subColor: "text-muted-foreground",
    },
  ];

  // Appointment actions
  const handleUpdateStatus = (id: number, status: Appointment["status"], patientName: string) => {
    updateStatus(id, status);
    toast({
      title:
        status === "confirmed"
          ? "Appointment Confirmed"
          : status === "completed"
          ? "Consultation Completed"
          : "Appointment Cancelled",
      description: `${patientName}'s appointment status updated to ${status}.`,
    });
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status });
    }
  };

  const handleWritePrescription = (patientName: string, treatment: string) => {
    setPrescriptionPatient(patientName);
    setPrescriptionDiagnosis(treatment);
    setActiveView("prescriptions");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/60 antialiased">
        <DoctorSidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (view !== "prescriptions") {
              setPrescriptionPatient("");
              setPrescriptionDiagnosis("");
            }
          }}
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
                    placeholder="Search patients, schedule, appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 md:w-80 h-9 bg-slate-50 border-border/80 text-xs rounded-xl focus-visible:bg-white"
                  />
                </div>
              </div>

              {/* Right: Notifications, Doctor Avatar, Name, Doctor Portal label, Logout */}
              <div className="flex items-center gap-3">
                <NotificationPopover />

                <div className="flex items-center gap-2.5 pl-3 border-l border-border/70">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white text-xs font-bold shadow-xs">
                    DK
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-foreground leading-tight">{DOCTOR_NAME}</p>
                    <span className="inline-block text-[10px] font-semibold text-accent uppercase tracking-wider">
                      Doctor Portal
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
                      Welcome, {DOCTOR_NAME} 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      Here’s your schedule and patient activity for today. Review clinical appointments and issue prescriptions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setActiveView("appointments")}
                      className="rounded-xl text-xs h-10 px-4 gap-1.5 font-semibold"
                    >
                      <CalendarDays className="h-4 w-4" /> Full Schedule
                    </Button>
                    <Button
                      onClick={() => setActiveView("prescriptions")}
                      className="rounded-xl text-xs h-10 px-4 gap-1.5 font-semibold bg-accent hover:bg-accent/90 text-white shadow-xs"
                    >
                      <FileSignature className="h-4 w-4" /> Write Rx
                    </Button>
                  </div>
                </div>

                {/* 2. Doctor Quick Stats (4 cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statCards.map((stat) => (
                    <Card
                      key={stat.id}
                      className="border border-border/80 bg-white shadow-xs hover:border-accent/40 hover:shadow-sm transition-all rounded-2xl"
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
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                            <stat.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 3. PRIMARY SECTION: Today's Schedule */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground">Today's Schedule</h2>
                      <p className="text-xs text-muted-foreground">
                        {format(today, "EEEE, MMMM d, yyyy")} · Chronological appointments
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 text-xs px-2.5 py-0.5 font-semibold">
                      {todayAppts.length} Patient{todayAppts.length !== 1 ? "s" : ""} Today
                    </Badge>
                  </div>

                  {todayAppts.length === 0 ? (
                    <Card className="border border-dashed border-border bg-white rounded-2xl p-8 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/50" />
                        <h3 className="font-heading text-base font-bold text-foreground">No appointments scheduled today</h3>
                        <p className="text-xs text-muted-foreground">
                          Your schedule is currently clear for today. New patient bookings will appear here in real time.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {todayAppts.map((appt) => (
                        <Card
                          key={appt.id}
                          className="border border-border/80 bg-white shadow-xs hover:border-accent/40 hover:shadow-sm transition-all rounded-2xl"
                        >
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* Left: Time badge & Patient Details */}
                              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                {/* Time column */}
                                <div className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 shrink-0 min-w-[80px]">
                                  <Clock className="h-3.5 w-3.5 text-accent mb-0.5" />
                                  <span className="font-bold text-xs">{appt.appointment_time}</span>
                                </div>

                                {/* Patient info */}
                                <div className="space-y-1.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-heading text-base font-bold text-foreground">
                                      {appt.patient_name}
                                    </h3>
                                    <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                                      #TRU-{appt.id.toString().padStart(4, "0")}
                                    </span>
                                    <StatusBadge status={appt.status} />
                                  </div>

                                  <p className="text-xs font-semibold text-primary">
                                    Treatment: <span className="font-bold">{appt.treatment}</span>
                                  </p>

                                  {/* Demographics bar */}
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                                    {(appt.patient_age || appt.patient_gender) && (
                                      <span className="font-medium">
                                        {appt.patient_age ? `${appt.patient_age} yrs` : ""}
                                        {appt.patient_age && appt.patient_gender ? " · " : ""}
                                        {appt.patient_gender || ""}
                                      </span>
                                    )}
                                    {appt.patient_phone && (
                                      <span className="flex items-center gap-1 font-mono">
                                        <Phone className="h-3 w-3 text-slate-400" />
                                        {appt.patient_phone}
                                      </span>
                                    )}
                                  </div>

                                  {/* Consultation type badge & details */}
                                  <div className="flex items-center gap-2 pt-0.5">
                                    {appt.appointment_type === "video" ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                                        <MonitorSmartphone className="h-3 w-3" /> Online Consultation
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                                        <Building2 className="h-3 w-3" /> In-Clinic Consultation
                                      </span>
                                    )}

                                    {appt.appointment_type === "video" && appt.meet_link && appt.meet_link.startsWith("http") && (
                                      <a
                                        href={appt.meet_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline ml-1"
                                      >
                                        <ExternalLink className="h-3 w-3" /> Join Consultation
                                      </a>
                                    )}

                                    {appt.appointment_type === "video" && (!appt.meet_link || !appt.meet_link.startsWith("http")) && (
                                      <span className="text-[11px] text-muted-foreground italic">
                                        Consultation link will be available before the appointment.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(appt)}
                                  className="h-8 px-3 rounded-xl text-xs gap-1.5"
                                >
                                  <Eye className="h-3.5 w-3.5" /> View Patient
                                </Button>

                                {appt.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateStatus(appt.id, "confirmed", appt.patient_name)}
                                      className="h-8 px-3 rounded-xl text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                    >
                                      <Check className="h-3.5 w-3.5" /> Confirm
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleUpdateStatus(appt.id, "cancelled", appt.patient_name)}
                                      className="h-8 px-3 rounded-xl text-xs gap-1 text-destructive hover:bg-destructive/10"
                                    >
                                      <X className="h-3.5 w-3.5" /> Reject
                                    </Button>
                                  </>
                                )}

                                {appt.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateStatus(appt.id, "completed", appt.patient_name)}
                                    className="h-8 px-3 rounded-xl text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleWritePrescription(appt.patient_name, appt.treatment)}
                                  className="h-8 px-3 rounded-xl text-xs gap-1.5 text-accent hover:text-accent hover:border-accent"
                                >
                                  <FileSignature className="h-3.5 w-3.5" /> Write Rx
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Upcoming Appointments & Recent Consultations (Two Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Upcoming Appointments */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground">Upcoming Appointments</h2>
                        <p className="text-xs text-muted-foreground">Future visits scheduled with patients</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveView("appointments")}
                        className="text-xs text-accent font-semibold hover:text-accent/80 p-0 h-auto gap-1"
                      >
                        View All <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {upcomingAppts.length === 0 ? (
                      <Card className="border border-border/80 bg-white rounded-2xl p-6 text-center">
                        <p className="text-xs text-muted-foreground">No upcoming appointments scheduled.</p>
                      </Card>
                    ) : (
                      <div className="space-y-2.5">
                        {upcomingAppts.slice(0, 4).map((appt) => (
                          <div
                            key={appt.id}
                            className="p-3.5 rounded-2xl border border-border/80 bg-white shadow-xs hover:border-accent/40 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-foreground truncate">{appt.patient_name}</p>
                                <StatusBadge status={appt.status} />
                              </div>
                              <p className="text-xs font-semibold text-primary truncate">{appt.treatment}</p>
                              <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                                <span className="font-medium text-slate-700 flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-accent" />
                                  {format(parseISO(appt.appointment_date), "MMM d, yyyy")}
                                </span>
                                <span>·</span>
                                <span>{appt.appointment_time}</span>
                                <span>·</span>
                                <span>{appt.appointment_type === "video" ? "Online" : "In-Clinic"}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appt)}
                              className="h-8 px-2.5 text-xs rounded-xl gap-1 shrink-0"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Recent Consultations */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground">Recent Consultations</h2>
                        <p className="text-xs text-muted-foreground">Concluded treatments & patient history</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveView("appointments")}
                        className="text-xs text-accent font-semibold hover:text-accent/80 p-0 h-auto gap-1"
                      >
                        History <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {recentConsultations.length === 0 ? (
                      <Card className="border border-border/80 bg-white rounded-2xl p-6 text-center">
                        <p className="text-xs text-muted-foreground">No completed consultations yet.</p>
                      </Card>
                    ) : (
                      <div className="space-y-2.5">
                        {recentConsultations.slice(0, 4).map((appt) => (
                          <div
                            key={appt.id}
                            className="p-3.5 rounded-2xl border border-border/80 bg-white shadow-xs hover:border-accent/40 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-foreground truncate">{appt.patient_name}</p>
                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                  Completed
                                </Badge>
                              </div>
                              <p className="text-xs font-semibold text-primary truncate">{appt.treatment}</p>
                              <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                                <span className="font-medium text-slate-700">
                                  {format(parseISO(appt.appointment_date), "MMM d, yyyy")}
                                </span>
                                <span>·</span>
                                <span>{appt.appointment_time}</span>
                                <span>·</span>
                                <span>{appt.appointment_type === "video" ? "Online" : "In-Clinic"}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appt)}
                              className="h-8 px-2.5 text-xs rounded-xl gap-1 shrink-0"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Doctor Quick Actions Bar */}
                <div className="p-4 rounded-2xl border border-border/80 bg-white shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Stethoscope className="h-4 w-4 text-accent" />
                    <span>Clinical Management Actions</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveView("appointments")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5"
                    >
                      <CalendarDays className="h-3.5 w-3.5" /> View Appointments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView("prescriptions")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5 text-accent hover:border-accent"
                    >
                      <FileSignature className="h-3.5 w-3.5" /> Write Prescription
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView("appointments")}
                      className="rounded-xl text-xs h-8 px-3 gap-1.5"
                    >
                      <User className="h-3.5 w-3.5" /> View Patient Records
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeView === "appointments" && (
              <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">Appointment Management</h1>
                    <p className="text-xs text-muted-foreground">Manage and review your patient schedule</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setActiveView("prescriptions")}
                    className="rounded-xl text-xs h-9 px-3 gap-1.5 bg-accent hover:bg-accent/90 text-white"
                  >
                    <FileSignature className="h-3.5 w-3.5" /> Write Prescription
                  </Button>
                </div>
                <DoctorAppointmentsTab />
              </div>
            )}

            {activeView === "prescriptions" && (
              <div className="max-w-5xl mx-auto animate-fade-in">
                <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Prescription Management</h1>
                <PrescriptionsTab
                  defaultPatient={prescriptionPatient}
                  defaultDiagnosis={prescriptionDiagnosis}
                />
              </div>
            )}

            {activeView === "profile" && (
              <div className="max-w-4xl mx-auto animate-fade-in">
                <DoctorProfileTab />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* DOCTOR APPOINTMENT / PATIENT INFORMATION MODAL */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={(v) => {
            if (!v) setSelectedAppointment(null);
          }}
        >
          <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-accent to-accent/90 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Clinical Patient Record</span>
                  <DialogTitle className="text-xl font-heading font-bold text-white mt-0.5">
                    Appointment #{selectedAppointment.id}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-white/80 mt-1">
                    Scheduled with {DOCTOR_NAME}
                  </DialogDescription>
                </div>
                <StatusBadge status={selectedAppointment.status} />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Patient Information Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold text-base">
                    {selectedAppointment.patient_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-foreground">
                      {selectedAppointment.patient_name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Patient ID: #PAT-{selectedAppointment.patient_id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>

                {/* Demographics grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 text-slate-700">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Age & Gender</span>
                    <span className="font-bold">
                      {selectedAppointment.patient_age ? `${selectedAppointment.patient_age} yrs` : "Not specified"} ·{" "}
                      {selectedAppointment.patient_gender || "Not specified"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Phone</span>
                    <span className="font-mono font-bold flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {selectedAppointment.patient_phone || "Not recorded"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Email</span>
                    <span className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {selectedAppointment.patient_email || "Not recorded"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent" /> Date
                  </span>
                  <p className="font-bold text-foreground">
                    {format(parseISO(selectedAppointment.appointment_date), "EEEE, MMM d, yyyy")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-accent" /> Time Slot
                  </span>
                  <p className="font-bold text-foreground">{selectedAppointment.appointment_time}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 col-span-2">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">Treatment / Reason</span>
                  <p className="font-bold text-primary text-sm">{selectedAppointment.treatment}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 col-span-2">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">Consultation Format</span>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      {selectedAppointment.appointment_type === "video" ? (
                        <>
                          <MonitorSmartphone className="h-4 w-4 text-accent" /> Online Telehealth Consultation
                        </>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4 text-primary" /> In-Clinic Consultation (TRUDENT Dental Hospital)
                        </>
                      )}
                    </span>

                    {selectedAppointment.appointment_type === "video" && selectedAppointment.meet_link && (
                      <a
                        href={selectedAppointment.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-accent hover:underline bg-accent/10 px-2 py-1 rounded-md"
                      >
                        <ExternalLink className="h-3 w-3" /> Join Link
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-foreground block mb-0.5">Patient Notes:</span>
                  <p className="text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleWritePrescription(selectedAppointment.patient_name, selectedAppointment.treatment);
                  setSelectedAppointment(null);
                }}
                className="rounded-xl text-xs gap-1.5 bg-accent hover:bg-accent/90 text-white"
              >
                <FileSignature className="h-3.5 w-3.5" /> Write Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  );
};

export default DoctorDashboard;
