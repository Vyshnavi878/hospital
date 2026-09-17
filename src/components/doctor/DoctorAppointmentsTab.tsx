import { useState, useMemo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Check,
  X,
  Building2,
  MonitorSmartphone,
  ExternalLink,
  Hash,
  Phone,
  Mail,
} from "lucide-react";
import { useAppointments, Appointment } from "@/context/AppointmentsContext";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/common/StatusBadge";

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

// ─── Consultation type badge ──────────────────────────────────────────────────
const ConsultTypeBadge = ({ type }: { type: "in-person" | "video" }) =>
  type === "in-person" ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
      <Building2 className="h-3 w-3" /> In-Clinic
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
      <MonitorSmartphone className="h-3 w-3" /> Online
    </span>
  );

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

// ─── Main Tab ─────────────────────────────────────────────────────────────────
const DoctorAppointmentsTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { appointments, updateStatus } = useAppointments();
  const { toast } = useToast();
  const doctorName = localStorage.getItem("username") || "Dr. Deepa Koduri";

  const handleAction = (id: number, status: Appointment["status"], patientName: string) => {
    updateStatus(id, status);
    toast({
      title: status === "confirmed" ? "Appointment Confirmed" : "Appointment Cancelled",
      description: `${patientName}'s appointment has been ${status}.`,
    });
  };

  const filtered = useMemo(() => {
    let result = appointments.filter(
      (a) =>
        (a.doctor_name === doctorName ||
          a.doctor_name.toLowerCase().includes("deepa") ||
          a.doctor_name.toLowerCase().includes("koduri") ||
          a.doctor_name.toLowerCase().includes("akshay") ||
          !a.doctor_name) &&
        isSameDay(parseISO(a.appointment_date), selectedDate)
    );
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result.sort((a, b) => parseTimeToMinutes(a.appointment_time) - parseTimeToMinutes(b.appointment_time));
  }, [appointments, selectedDate, statusFilter, doctorName]);

  return (
    <div className="space-y-5">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[190px] justify-start text-left font-normal text-sm")}>
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((sf) => (
            <Button
              key={sf.value}
              size="sm"
              variant={statusFilter === sf.value ? "default" : "outline"}
              onClick={() => setStatusFilter(sf.value)}
              className="text-xs h-8 px-3"
            >
              {sf.label}
            </Button>
          ))}
        </div>

        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {filtered.length} appointment{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <Calendar className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold text-muted-foreground text-sm">No appointments for this date</p>
              <p className="text-xs text-muted-foreground mt-1">Try selecting a different date or filter.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((appt) => (
            <Card
              key={appt.id}
              className="border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  {/* Left: Patient info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                      {appt.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      {/* Patient name + treatment */}
                      <div>
                        <p className="font-heading font-semibold text-foreground text-sm">{appt.patient_name}</p>
                        <p className="text-xs font-medium text-primary mt-0.5">{appt.treatment}</p>
                      </div>

                      {/* Patient demographics: Age, Gender, Phone, Email */}
                      {(appt.patient_age || appt.patient_gender || appt.patient_phone || appt.patient_email) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                          {(appt.patient_age || appt.patient_gender) && (
                            <span className="font-semibold text-slate-800">
                              {appt.patient_age ? `${appt.patient_age} yrs` : ""}
                              {appt.patient_age && appt.patient_gender ? " · " : ""}
                              {appt.patient_gender || ""}
                            </span>
                          )}
                          {appt.patient_phone && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {appt.patient_phone}
                            </span>
                          )}
                          {appt.patient_email && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {appt.patient_email}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          {appt.appointment_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono font-semibold">{appt.id}</span>
                        </span>
                        <ConsultTypeBadge type={appt.appointment_type} />
                      </div>

                      {/* Location or meet link */}
                      {appt.appointment_type === "in-person" && appt.room && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {appt.room}
                        </p>
                      )}
                      {appt.appointment_type === "video" && appt.meet_link && (
                        <a
                          href={appt.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Join Online Consultation
                        </a>
                      )}
                      {appt.appointment_type === "video" && !appt.meet_link && (
                        <p className="text-[11px] text-muted-foreground/70 italic">
                          Online link available after confirmation
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    {appt.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAction(appt.id, "confirmed", appt.patient_name)}
                          className="h-8 px-3 text-xs gap-1"
                        >
                          <Check className="h-3.5 w-3.5" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(appt.id, "cancelled", appt.patient_name)}
                          className="h-8 px-3 text-xs gap-1"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    ) : (
                      <StatusBadge status={appt.status} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsTab;
