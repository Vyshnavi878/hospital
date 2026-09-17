import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/context/AppointmentsContext";
import {
  Stethoscope,
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Award,
  Calendar,
  Building,
  CheckCircle2,
} from "lucide-react";

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorProfileModal = ({
  doctor,
  open,
  onOpenChange,
  onBookAppointment,
}: DoctorProfileModalProps) => {
  if (!doctor) return null;

  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden sm:rounded-2xl border-slate-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-slate-50 p-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md rounded-full shrink-0">
              <AvatarImage src={doctor.photo} alt={doctor.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary/10 text-primary border-0 text-xs font-semibold px-2 py-0.5">
                  {doctor.specialty}
                </Badge>
                {doctor.rating && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    {doctor.rating}
                  </span>
                )}
              </div>

              <DialogTitle className="font-heading text-xl font-bold text-slate-900 leading-tight">
                {doctor.name}
              </DialogTitle>

              {doctor.qualifications && (
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {doctor.qualifications}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-left text-sm max-h-[70vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Experience</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{doctor.experience || "8+ yrs"}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Consultation Fee</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">₹{doctor.consultationFee || 600}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Department</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">{doctor.specialty}</span>
            </div>
          </div>

          {/* Clinical About */}
          {doctor.about && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">About Doctor</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                {doctor.about}
              </p>
            </div>
          )}

          {/* Clinical Availability & Hospital Location */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold text-slate-700">Available Days: </span>
              <span className="text-slate-600">
                {doctor.availableDays && doctor.availableDays.length > 0
                  ? doctor.availableDays.join(", ")
                  : "Mon, Tue, Wed, Thu, Fri"}
              </span>
            </div>

            {doctor.roomNumber && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold text-slate-700">Hospital Location: </span>
                <span className="text-slate-600">{doctor.roomNumber}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold text-slate-700">Institution: </span>
              <span className="text-slate-600">CarePulse Central Multi-Specialty Hospital</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Verified Hospital Medical Staff • Online Booking Available</span>
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-10 text-xs font-medium"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onBookAppointment(doctor);
              }}
              className="w-full sm:w-auto h-10 text-xs font-semibold gap-2 shadow-xs"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
