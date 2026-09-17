import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment, useAppointments } from "@/context/AppointmentsContext";
import { StatusBadge } from "./StatusBadge";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  ExternalLink,
  Printer,
  XCircle,
  FileText,
  Building,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onRescheduleClick?: (appt: Appointment) => void;
}

export const AppointmentDetailsModal = ({
  appointment,
  open,
  onClose,
  onRescheduleClick,
}: AppointmentDetailsModalProps) => {
  const { cancelAppointment } = useAppointments();
  const { toast } = useToast();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!appointment) return null;

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${appointment.doctor_name} has been cancelled.`,
    });
    setShowCancelConfirm(false);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const isPast = new Date(appointment.appointment_date) < new Date(new Date().setHours(0, 0, 0, 0));
  const canModify = !isPast && appointment.status !== "cancelled" && appointment.status !== "completed";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setShowCancelConfirm(false); onClose(); } }}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-0">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-primary to-primary/85 text-primary-foreground p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase opacity-90">TRUDENT Dental Hospital Pass</span>
              <DialogTitle className="text-xl font-heading font-bold text-white mt-0.5">
                Appointment Summary
              </DialogTitle>
              <DialogDescription className="text-xs text-white/80 mt-1">
                Ref ID: #TRU-{appointment.id.toString().padStart(4, "0")}
              </DialogDescription>
            </div>
            <StatusBadge status={appointment.status} className="shadow-sm" />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Doctor & Clinic Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {appointment.doctor_name.replace("Dr. ", "").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-base truncate">{appointment.doctor_name}</h4>
              <p className="text-xs font-medium text-primary">{appointment.treatment}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Building className="h-3 w-3" />
                {appointment.room || "TRUDENT Multispeciality Dental Hospital"}
              </p>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Date
              </span>
              <p className="font-semibold text-foreground">
                {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" /> Time Slot
              </span>
              <p className="font-semibold text-foreground">{appointment.appointment_time}</p>
            </div>
          </div>

          {/* Consultation Type & Link */}
          <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Consultation Format:</span>
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                {appointment.appointment_type === "video" ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-primary" /> Online Consultation
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-primary" /> In-Clinic Consultation
                  </>
                )}
              </span>
            </div>

            {appointment.appointment_type === "in-person" && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Location: TRUDENT Multispeciality Dental Hospital</span>
                <a
                  href="https://maps.app.goo.gl/oS4FVYedV4wLi7vi9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1 rounded-md"
                >
                  <MapPin className="h-3.5 w-3.5" /> Get Directions
                </a>
              </div>
            )}

            {appointment.appointment_type === "video" && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Telehealth Link:</span>
                {appointment.meet_link && appointment.status === "confirmed" ? (
                  <a
                    href={appointment.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1 rounded-md"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Join Consultation
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Your consultation link will be available before the appointment.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Patient Details & Instructions */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Patient:{" "}
              <strong className="text-foreground font-medium">{appointment.patient_name}</strong>
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground/90 bg-muted/20 p-2.5 rounded-lg border border-border/50">
              💡 Please arrive 15 minutes before your scheduled appointment with your national ID or medical card. For video calls, ensure a quiet room and high-speed internet connection.
            </p>
          </div>

          {/* Cancellation Confirmation Alert */}
          {showCancelConfirm && (
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <AlertTriangle className="h-4 w-4" /> Are you sure you want to cancel this appointment?
              </div>
              <p className="text-muted-foreground">
                This will release your time slot for other patients. You can re-book anytime.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="ghost" onClick={() => setShowCancelConfirm(false)}>
                  Keep Appointment
                </Button>
                <Button size="sm" variant="destructive" onClick={handleCancel}>
                  Yes, Cancel Visit
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
              <Printer className="h-3.5 w-3.5" /> Print Slip
            </Button>

            <div className="flex items-center gap-2">
              {canModify && !showCancelConfirm && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  {onRescheduleClick && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => {
                        onClose();
                        onRescheduleClick(appointment);
                      }}
                    >
                      Reschedule
                    </Button>
                  )}
                </>
              )}
              <Button size="sm" variant="default" onClick={onClose} className="text-xs">
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
