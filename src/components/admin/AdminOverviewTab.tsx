import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Stethoscope, CalendarDays, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAppointments } from "@/context/AppointmentsContext";
import { format, parseISO } from "date-fns";

const departmentStats = [
  { name: "Cardiology", doctors: 5, patients: 320, color: "bg-primary" },
  { name: "Dermatology", doctors: 4, patients: 280, color: "bg-emerald-500" },
  { name: "Orthopedics", doctors: 6, patients: 410, color: "bg-emerald-500" },
  { name: "Dentistry", doctors: 3, patients: 195, color: "bg-primary" },
  { name: "Neurology", doctors: 2, patients: 140, color: "bg-amber-500" },
];

const AdminOverviewTab = () => {
  const { appointments, doctors } = useAppointments();

  const activeDoctors = doctors.filter((d) => d.status === "active").length;
  const totalPatients = doctors.reduce((sum, d) => sum + d.patients, 0);
  const todayAppts = appointments.length;
  const completedThisMonth = appointments.filter((a) => a.status === "completed").length;

  const recentAppts = useMemo(
    () => [...appointments].sort((a, b) => b.id - a.id).slice(0, 5),
    [appointments]
  );

  const statCards = [
    { label: "Total Patients", value: totalPatients.toLocaleString(), sub: "+48 this month", icon: Users, color: "text-primary" },
    { label: "Total Doctors", value: activeDoctors, sub: `+${doctors.filter(d => d.status === "pending").length} new`, icon: Stethoscope, color: "text-primary" },
    { label: "Today's Appointments", value: todayAppts, sub: "", icon: CalendarDays, color: "text-primary" },
    { label: "Monthly Revenue", value: "$84.5K", sub: "+12%", icon: TrendingUp, color: "text-primary" },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-green-50 text-green-700 border-green-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Hospital Overview</h1>
        <p className="text-sm text-muted-foreground">System-wide statistics and activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border border-border bg-card shadow-none">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
                  {stat.sub && <p className="text-xs font-medium text-green-600 mt-1">{stat.sub}</p>}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card className="border border-border bg-card shadow-none">
          <CardContent className="p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Appointments</h2>
            <div className="divide-y divide-border">
              {recentAppts.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{appt.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{appt.doctor_name} • {format(parseISO(appt.appointment_date), "MMM d")}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Stats */}
        <Card className="border border-border bg-card shadow-none">
          <CardContent className="p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Department Stats</h2>
            <div className="divide-y divide-border">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${dept.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.doctors} doctors</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{dept.patients} patients</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
