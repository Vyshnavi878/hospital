import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CalendarDays, MapPin, User, Calendar } from "lucide-react";
import { Doctor } from "@/context/AppointmentsContext";
import { cn } from "@/lib/utils";

export interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
  onBookAppointment?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
  className?: string;
  compact?: boolean;
}

function formatDays(days?: string[]): string {
  if (!days || days.length === 0) return "By prior appointment";
  if (days.length >= 6 && days.includes("Mon") && days.includes("Sat")) return "Mon – Sat OPD";
  if (days.length === 5 && days.includes("Mon") && days.includes("Fri") && !days.includes("Sat")) return "Mon – Fri OPD";
  return days.join(", ");
}

export const DoctorCard = ({
  doctor,
  onSelect,
  onBookAppointment,
  onViewProfile,
  className,
  compact = false,
}: DoctorCardProps) => {
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleBook = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    } else if (onSelect) {
      onSelect(doctor);
    }
  };

  const handleProfile = () => {
    if (onViewProfile) {
      onViewProfile(doctor);
    }
  };

  return (
    <Card
      className={cn(
        "group border border-slate-200/90 bg-white hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between text-left shadow-sm hover:-translate-y-0.5",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col h-full justify-between gap-3 sm:gap-4">
        <div className="space-y-3">
          {/* Top Row: Avatar + Name + Specialty */}
          <div className="flex items-start gap-3">
            <Avatar className="h-13 w-13 sm:h-14 sm:w-14 border-2 border-primary/15 shadow-sm shrink-0 rounded-full">
              <AvatarImage
                src={doctor.photo || (doctor.name.includes("Deepa") ? "/images/clinic/dr-deepa-portrait.png" : undefined)}
                alt={doctor.name}
                className="object-cover object-top"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/25 text-primary font-bold text-sm sm:text-base">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 bg-primary/10 text-primary border-0"
                >
                  {doctor.specialty}
                </Badge>
                {doctor.rating && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    {doctor.rating}
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug truncate group-hover:text-primary transition-colors">
                {doctor.name}
              </h3>

              {doctor.qualifications && (
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 truncate" title={doctor.qualifications}>
                  {doctor.qualifications}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 py-2 px-2.5 sm:px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold block tracking-wider">
                Experience
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 text-xs">
                <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                {doctor.experience || "8+ yrs"}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold block tracking-wider">
                Fee
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5 text-xs">
                ₹{doctor.consultationFee || 600}
              </span>
            </div>
          </div>

          {/* Availability */}
          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex items-start gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="leading-tight">
                <span className="font-medium text-slate-700">Days: </span>
                {formatDays(doctor.availableDays)}
              </span>
            </div>
            {doctor.roomNumber && (
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{doctor.roomNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleProfile}
            className="h-9 sm:h-10 font-medium text-xs text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100 cursor-pointer justify-center rounded-xl"
          >
            <User className="h-3.5 w-3.5 mr-1 text-slate-500" />
            <span>View Profile</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleBook}
            className="h-9 sm:h-10 font-semibold text-xs shadow-sm gap-1 cursor-pointer justify-center rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book Appointment</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
