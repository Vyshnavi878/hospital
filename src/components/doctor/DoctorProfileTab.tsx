import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, UserRound, Briefcase, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-3 pb-1">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
);

const DoctorProfileTab = () => {
  const [profile, setProfile] = useState({
    full_name: localStorage.getItem("username") || "Dr. Deepa Koduri",
    email: "deepa@trudent.com",
    mobile: "+91 9063584448",
    age: 36,
    gender: "female",
    specialization: "endodontist",
    qualifications: "Endodontist",
    yearsOfExperience: 10,
    hospitalLicenseNumber: "LIC-12345",
    consultationFee: 600,
    startTime: "9:00 AM",
    endTime: "8:30 PM",
    lunchStart: "1:00 PM - 2:00 PM",
    weekOffs: ["Sunday"] as string[],
  });
  const { toast } = useToast();

  const update = (key: string, value: string | number) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleWeekOff = (day: string) =>
    setProfile((p) => ({
      ...p,
      weekOffs: p.weekOffs.includes(day) ? p.weekOffs.filter((d) => d !== day) : [...p.weekOffs, day],
    }));

  const timeSlots = [
    "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
  ];

  const lunchSlots = [
    "11:00 AM - 12:00 PM", "11:30 AM - 12:30 PM", "12:00 PM - 1:00 PM",
    "12:30 PM - 1:30 PM", "1:00 PM - 2:00 PM", "1:30 PM - 2:30 PM",
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSave = () => {
    toast({ title: "Profile updated successfully!" });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <SectionHeader icon={UserRound} title="Personal Information" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input value={profile.full_name} onChange={(e) => update("full_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={profile.email} disabled className="opacity-60" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Mobile</Label>
              <Input value={profile.mobile} onChange={(e) => update("mobile", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Age</Label>
              <Input type="number" value={profile.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => update("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <SectionHeader icon={Briefcase} title="Professional Details" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Specialization</Label>
              <Select value={profile.specialization} onValueChange={(v) => update("specialization", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_dentist">General Dentist</SelectItem>
                  <SelectItem value="orthodontist">Orthodontist</SelectItem>
                  <SelectItem value="periodontist">Periodontist</SelectItem>
                  <SelectItem value="endodontist">Endodontist</SelectItem>
                  <SelectItem value="oral_surgeon">Oral Surgeon</SelectItem>
                  <SelectItem value="pediatric_dentist">Pediatric Dentist</SelectItem>
                  <SelectItem value="prosthodontist">Prosthodontist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Qualifications</Label>
              <Input value={profile.qualifications} onChange={(e) => update("qualifications", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Experience (yrs)</Label>
              <Input type="number" value={profile.yearsOfExperience} onChange={(e) => update("yearsOfExperience", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">License No.</Label>
              <Input value={profile.hospitalLicenseNumber} onChange={(e) => update("hospitalLicenseNumber", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Consultation Fee (₹)</Label>
              <Input type="number" value={profile.consultationFee} onChange={(e) => update("consultationFee", parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <SectionHeader icon={CalendarClock} title="Schedule & Availability" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Time</Label>
              <Select value={profile.startTime} onValueChange={(v) => update("startTime", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Time</Label>
              <Select value={profile.endTime} onValueChange={(v) => update("endTime", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lunch Break</Label>
              <Select value={profile.lunchStart} onValueChange={(v) => update("lunchStart", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {lunchSlots.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Week Offs</Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <label key={day} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs cursor-pointer transition-colors hover:bg-muted/50">
                  <Checkbox
                    checked={profile.weekOffs.includes(day)}
                    onCheckedChange={() => toggleWeekOff(day)}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
};

export default DoctorProfileTab;
