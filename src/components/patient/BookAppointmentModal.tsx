import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/context/AppointmentsContext";
import { Video, MapPin, Phone, UserRound, Stethoscope, User as UserIcon } from "lucide-react";

const SPECIALIZATIONS = [
  "General Dentist",
  "Orthodontist",
  "Endodontist",
  "Periodontist",
  "Oral Surgeon",
];

const DOCTORS_BY_SPEC: Record<string, string[]> = {
  "General Dentist": ["Dr. Deepa Koduri"],
  "Orthodontist": ["Dr. Deepa Koduri"],
  "Endodontist": ["Dr. Deepa Koduri"],
  "Periodontist": ["Dr. Deepa Koduri"],
  "Oral Surgeon": ["Dr. Deepa Koduri"],
};

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

interface BookAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onBooked: () => void;
}

const BookAppointmentModal = ({ open, onClose, onBooked }: BookAppointmentModalProps) => {
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("video");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { toast } = useToast();
  const { addAppointment } = useAppointments();

  const availableDoctors = specialization ? (DOCTORS_BY_SPEC[specialization] || []) : [];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !specialization || !doctorName || !date || !time) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const patientId = Number(localStorage.getItem("userId") || "1");

    addAppointment({
      patient_name: fullName,
      patient_id: patientId,
      doctor_name: doctorName,
      appointment_date: date,
      appointment_time: time,
      status: "pending",
      treatment: specialization,
      appointment_type: appointmentType,
    });

    toast({ title: "Appointment booked!", description: "Waiting for doctor confirmation." });
    resetForm();
    onBooked();
  };

  const resetForm = () => {
    setAppointmentType("video");
    setFullName("");
    setMobile("");
    setSpecialization("");
    setDoctorName("");
    setDate("");
    setTime("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { resetForm(); onClose(); } }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Book Appointment</DialogTitle>
          <DialogDescription className="sr-only">Schedule a visit with your dentist</DialogDescription>
        </DialogHeader>

        <hr className="border-border" />

        <form onSubmit={handleBook} className="space-y-5">
          {/* Appointment Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Appointment Type <span className="text-destructive">*</span></Label>
            <RadioGroup
              value={appointmentType}
              onValueChange={(v) => setAppointmentType(v as "video" | "in-person")}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="video" id="type-video" />
                <Label htmlFor="type-video" className="flex items-center gap-1.5 cursor-pointer font-normal">
                  <Video className="h-4 w-4 text-muted-foreground" /> Video Consultation
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="in-person" id="type-inperson" />
                <Label htmlFor="type-inperson" className="flex items-center gap-1.5 cursor-pointer font-normal">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> In-Person Visit
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Full Name & Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="bg-accent/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                type="tel"
              />
            </div>
          </div>

          {/* Specialization & Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                Specialization <span className="text-destructive">*</span>
              </Label>
              <Select value={specialization} onValueChange={(v) => { setSpecialization(v); setDoctorName(""); }}>
                <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s.toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Doctor <span className="text-destructive">*</span>
              </Label>
              <Select value={doctorName} onValueChange={setDoctorName} disabled={!specialization}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                Appointment Date <span className="text-destructive">*</span>
              </Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                Appointment Time <span className="text-destructive">*</span>
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button type="button" variant="outline" onClick={() => { resetForm(); onClose(); }} className="w-full">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
