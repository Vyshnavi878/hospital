import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ExternalLink,
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  Eye,
  XCircle,
  RotateCcw,
  CalendarDays,
  User,
  Building,
  Building2,
  MonitorSmartphone,
  Hash,
} from "lucide-react";
import { useAppointments, Appointment } from "@/context/AppointmentsContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { AppointmentDetailsModal } from "@/components/common/AppointmentDetailsModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { TimeSlot } from "@/components/common/TimeSlot";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
const RESCHEDULE_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM",
];

interface AppointmentsTabProps {
  dashboardMode?: boolean;
  onBookNew?: () => void;
}

const AppointmentsTab = ({ dashboardMode = false, onBookNew }: AppointmentsTabProps) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const { appointments, cancelAppointment, rescheduleAppointment, isSlotBooked } = useAppointments();
  const { toast } = useToast();
  const patientId = Number(localStorage.getItem("userId") || "1");
  const myAppointments = appointments.filter((a) => a.patient_id === patientId);

  const filtered = useMemo(() => {
    let list = myAppointments;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter by timeline segment (only if not dashboardMode)
    if (!dashboardMode) {
      if (activeTab === "upcoming") {
        list = list.filter((a) => new Date(a.appointment_date) >= today && a.status !== "cancelled");
      } else if (activeTab === "past") {
        list = list.filter((a) => new Date(a.appointment_date) < today || a.status === "completed" || a.status === "cancelled");
      }
    } else {
      // In dashboard mode, strictly upcoming active visits
      list = list.filter((a) => new Date(a.appointment_date) >= today && a.status !== "cancelled");
    }

    if (activeFilter !== "All") {
      list = list.filter((a) => a.status === activeFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.doctor_name.toLowerCase().includes(q) ||
          a.treatment.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
  }, [myAppointments, activeTab, activeFilter, dashboardMode, searchQuery]);

  const handleRescheduleSubmit = () => {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) {
      toast({ title: "Please select both date and time", variant: "destructive" });
      return;
    }
    if (isSlotBooked(rescheduleDate, rescheduleTime, rescheduleTarget.doctor_name)) {
      toast({ title: "Slot already booked", description: "This time slot is occupied. Please pick an available slot.", variant: "destructive" });
      return;
    }
    rescheduleAppointment(rescheduleTarget.id, rescheduleDate, rescheduleTime);
    toast({
      title: "Appointment Rescheduled",
      description: `Visit rescheduled to ${rescheduleDate} at ${rescheduleTime}.`,
    });
    setRescheduleTarget(null);
  };

  // DASHBOARD PREVIEW MODE
  if (dashboardMode) {
    return (
      <>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-card/60">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">No upcoming appointments</p>
              <p className="text-xs text-muted-foreground mt-0.5">You have no doctor visits scheduled.</p>
            </div>
          ) : (
            filtered.slice(0, 3).map((appt) => (
              <div
                key={appt.id}
                onClick={() => setSelectedAppointment(appt)}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                    {appt.doctor_name.replace("Dr. ", "").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {appt.doctor_name}
                    </p>
                    <p className="text-xs font-medium text-primary">{appt.treatment}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Calendar className="h-3 w-3 text-primary" /> {appt.appointment_date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {appt.appointment_time}
                      </span>
                      <span>·</span>
                      <span>{appt.appointment_type === "video" ? "📹 Video" : "🏥 In-Person"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={appt.status} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <AppointmentDetailsModal
          appointment={selectedAppointment}
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onRescheduleClick={(appt) => {
            setSelectedAppointment(null);
            setRescheduleTarget(appt);
          }}
        />
      </>
    );
  }

  // FULL VIEW MODE
  return (
    <div className="space-y-5">
      {/* Segmented Timeline Tabs (Upcoming / Past / All) */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/50 border border-border">
          <Button
            size="sm"
            variant={activeTab === "upcoming" ? "default" : "ghost"}
            onClick={() => setActiveTab("upcoming")}
            className="text-xs h-7 px-3 rounded-md"
          >
            Upcoming Visits
          </Button>
          <Button
            size="sm"
            variant={activeTab === "past" ? "default" : "ghost"}
            onClick={() => setActiveTab("past")}
            className="text-xs h-7 px-3 rounded-md"
          >
            Past & History
          </Button>
          <Button
            size="sm"
            variant={activeTab === "all" ? "default" : "ghost"}
            onClick={() => setActiveTab("all")}
            className="text-xs h-7 px-3 rounded-md"
          >
            All Appointments
          </Button>
        </div>

        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} appointment(s)
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctor or treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f} value={f} className="text-xs">
                {f === "All" ? "All Status" : f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content: Mobile Cards vs Desktop Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments found"
          description="You don't have any appointments matching your selected filters. Schedule a visit with Dr. Deepa Koduri."
          actionLabel="Book an Appointment"
          onAction={onBookNew}
        />
      ) : (
        <>
          {/* Mobile Card List (< md) */}
          <div className="grid gap-3.5 md:hidden">
            {filtered.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-sm hover:border-primary/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">{appt.doctor_name}</h4>
                    <p className="text-xs font-medium text-primary mt-0.5">{appt.treatment}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>

                {/* Date/time row */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    {appt.appointment_date}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    {appt.appointment_time}
                  </div>
                </div>

                {/* Consultation type + Appt ID */}
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  {appt.appointment_type === "video" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                      <MonitorSmartphone className="h-3 w-3" /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                      <Building2 className="h-3 w-3" /> In-Clinic
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground font-mono font-semibold">
                    <Hash className="h-3 w-3" />{appt.id}
                  </span>
                </div>

                {/* Location or online link */}
                {appt.appointment_type === "in-person" && appt.room && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 shrink-0 text-primary" />{appt.room}
                  </p>
                )}
                {appt.appointment_type === "video" && appt.meet_link && appt.status === "confirmed" && (
                  <a
                    href={appt.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Join Online Consultation
                  </a>
                )}
                {appt.appointment_type === "video" && !appt.meet_link && (
                  <p className="text-[11px] text-muted-foreground/70 italic">Online link will be available before the appointment.</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppointment(appt)}
                      className="h-7 text-xs px-2.5"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Doctor & Treatment</th>
                  <th className="text-left px-4 py-3">Date & Time</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold text-muted-foreground">#{appt.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground text-sm">{appt.doctor_name}</p>
                      <p className="text-xs text-primary font-medium">{appt.treatment}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-foreground text-xs">
                        {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{appt.appointment_time}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        {appt.appointment_type === "video" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                            <MonitorSmartphone className="h-3 w-3" /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                            <Building2 className="h-3 w-3" /> In-Clinic
                          </span>
                        )}
                        {appt.appointment_type === "in-person" && appt.room && (
                          <p className="text-[10px] text-muted-foreground">{appt.room}</p>
                        )}
                        {appt.appointment_type === "video" && appt.meet_link && appt.status === "confirmed" && (
                          <a href={appt.meet_link} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent hover:underline">
                            <ExternalLink className="h-3 w-3" /> Join
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppointment(appt)}
                          className="h-8 px-2.5 text-xs text-primary hover:text-primary/80"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onRescheduleClick={(appt) => {
          setSelectedAppointment(null);
          setRescheduleTarget(appt);
        }}
      />

      {/* Reschedule Dialog */}
      {rescheduleTarget && (
        <Dialog open={!!rescheduleTarget} onOpenChange={(v) => { if (!v) setRescheduleTarget(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Reschedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <p className="text-muted-foreground">
                Rescheduling your visit with <strong className="text-foreground">{rescheduleTarget.doctor_name}</strong>.
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs">New Appointment Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleTime("");
                  }}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">New Time Slot</Label>
                {!rescheduleDate ? (
                  <p className="text-xs text-muted-foreground italic">
                    Select a date above to check available time slots.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
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
              <Button variant="outline" size="sm" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRescheduleSubmit}
                disabled={!rescheduleDate || !rescheduleTime || (!!rescheduleDate && !!rescheduleTime && isSlotBooked(rescheduleDate, rescheduleTime, rescheduleTarget.doctor_name))}
              >
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentsTab;
