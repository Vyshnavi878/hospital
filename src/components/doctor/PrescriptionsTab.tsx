import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Send } from "lucide-react";
import { useAppointments } from "@/context/AppointmentsContext";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  frequency: string;
}

const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "As needed",
  "Before meals",
  "After meals",
];

interface PrescriptionsTabProps {
  defaultPatient?: string;
  defaultDiagnosis?: string;
}

const PrescriptionsTab = ({ defaultPatient = "", defaultDiagnosis = "" }: PrescriptionsTabProps) => {
  const { appointments, addPrescription } = useAppointments();
  const { toast } = useToast();
  const doctorName = localStorage.getItem("username") || "Dr. Deepa Koduri";

  // Get unique patients from confirmed/completed appointments
  const approvedPatients = useMemo(() => {
    const map = new Map<number, string>();
    appointments
      .filter((a) => a.status === "confirmed" || a.status === "completed")
      .forEach((a) => map.set(a.patient_id, a.patient_name));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [appointments]);

  const [selectedPatient, setSelectedPatient] = useState(defaultPatient);
  const [diagnosis, setDiagnosis] = useState(defaultDiagnosis);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", duration: "", frequency: "" },
  ]);
  const [notes, setNotes] = useState("");

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "", frequency: "" }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const resetForm = () => {
    setSelectedPatient("");
    setDiagnosis("");
    setMedicines([{ name: "", dosage: "", duration: "", frequency: "" }]);
    setNotes("");
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft Saved", description: "Prescription draft has been saved." });
  };

  const handleSubmit = () => {
    if (!selectedPatient) {
      toast({ title: "Please select a patient", variant: "destructive" });
      return;
    }
    if (!diagnosis.trim()) {
      toast({ title: "Please enter a diagnosis", variant: "destructive" });
      return;
    }
    const patient = approvedPatients.find((p) => p.name === selectedPatient);
    addPrescription({
      doctor_name: doctorName,
      patient_name: selectedPatient,
      patient_id: patient?.id || 0,
      diagnosis,
      medicines: medicines.filter((m) => m.name.trim()),
      notes,
      date: new Date().toISOString().split("T")[0],
    });
    toast({ title: "Prescription Submitted", description: `Prescription sent to ${selectedPatient}.` });
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Patient & Diagnosis */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Patient Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Patient Name</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {approvedPatients.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Diagnosis</Label>
              <Input
                placeholder="e.g., Dental Caries"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-heading">Medicines</CardTitle>
          <Button variant="outline" size="sm" onClick={addMedicine} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Medicine
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicines.map((med, index) => (
            <div key={index} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-xs">Medicine Name</Label>
                  <Input
                    placeholder="e.g., Atorvastatin"
                    value={med.name}
                    onChange={(e) => updateMedicine(index, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Dosage</Label>
                  <Input
                    placeholder="e.g., 20mg"
                    value={med.dosage}
                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Duration</Label>
                  <Input
                    placeholder="e.g., 30 days"
                    value={med.duration}
                    onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">Frequency</Label>
                    <Select value={med.frequency} onValueChange={(v) => updateMedicine(index, "frequency", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {medicines.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeMedicine(index)} className="text-destructive h-9 w-9">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Special instructions, follow-up details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
          <Save className="h-4 w-4" /> Save Draft
        </Button>
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="h-4 w-4" /> Submit Prescription
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionsTab;
