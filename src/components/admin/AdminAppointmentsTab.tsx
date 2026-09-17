import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAppointments } from "@/context/AppointmentsContext";
import { format, parseISO } from "date-fns";

const AdminAppointmentsTab = () => {
  const { appointments, doctors } = useAppointments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");

  const uniqueDoctors = useMemo(
    () => [...new Set(appointments.map((a) => a.doctor_name))],
    [appointments]
  );

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch = a.patient_name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchDoctor = doctorFilter === "all" || a.doctor_name === doctorFilter;
      return matchSearch && matchStatus && matchDoctor;
    });
  }, [appointments, search, statusFilter, doctorFilter]);

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
      <h1 className="font-heading text-2xl font-bold text-foreground">All Appointments</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={doctorFilter} onValueChange={setDoctorFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Doctors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            {uniqueDoctors.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-border bg-card shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-primary font-semibold">Patient</TableHead>
                <TableHead className="text-primary font-semibold">Doctor</TableHead>
                <TableHead className="text-primary font-semibold">Date</TableHead>
                <TableHead className="text-primary font-semibold">Time</TableHead>
                <TableHead className="text-primary font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((appt) => (
                  <TableRow key={appt.id} className="border-border">
                    <TableCell className="font-semibold text-foreground">{appt.patient_name}</TableCell>
                    <TableCell className="text-muted-foreground">{appt.doctor_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(appt.appointment_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{appt.appointment_time}</TableCell>
                    <TableCell>
                      <StatusBadge status={appt.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointmentsTab;
