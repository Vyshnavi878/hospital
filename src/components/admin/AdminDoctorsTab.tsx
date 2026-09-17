import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, UserCheck, UserX } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAppointments } from "@/context/AppointmentsContext";
import { useToast } from "@/hooks/use-toast";

const AdminDoctorsTab = () => {
  const { doctors, updateDoctorStatus } = useAppointments();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => doctors.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
    ),
    [doctors, search]
  );

  const handleApprove = (id: number, name: string) => {
    updateDoctorStatus(id, "active");
    toast({ title: `${name} has been approved` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Doctor Management</h1>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Doctor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border border-border bg-card shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-primary font-semibold">Doctor</TableHead>
                <TableHead className="text-primary font-semibold">Specialty</TableHead>
                <TableHead className="text-primary font-semibold">Patients</TableHead>
                <TableHead className="text-primary font-semibold">Status</TableHead>
                <TableHead className="text-primary font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <TableRow key={doc.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.specialty}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.patients}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {doc.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-green-700 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(doc.id, doc.name)}
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <UserX className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">View</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctorsTab;
