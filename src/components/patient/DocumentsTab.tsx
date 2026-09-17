import { useState, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Image, FileBarChart, Upload, Pill, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppointments } from "@/context/AppointmentsContext";

interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
  icon: "report" | "xray" | "prescription";
}

const DUMMY_DOCUMENTS: Document[] = [
  { id: 1, name: "Dental Checkup Report", type: "PDF", date: "2026-02-20", size: "245 KB", icon: "report" },
  { id: 2, name: "X-Ray - Upper Jaw", type: "Image", date: "2026-02-15", size: "1.2 MB", icon: "xray" },
  { id: 3, name: "Treatment Plan - Root Canal", type: "PDF", date: "2026-01-28", size: "320 KB", icon: "report" },
  { id: 4, name: "X-Ray - Lower Molar", type: "Image", date: "2026-01-10", size: "1.5 MB", icon: "xray" },
];

const iconMap = {
  report: FileBarChart,
  xray: Image,
  prescription: FileText,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getIconFromFile(file: File): "report" | "xray" | "prescription" {
  if (file.type.startsWith("image/")) return "xray";
  return "report";
}

function getTypeLabel(file: File): string {
  if (file.type.startsWith("image/")) return "Image";
  if (file.type === "application/pdf") return "PDF";
  return "File";
}

const DocumentsTab = () => {
  const [documents, setDocuments] = useState<Document[]>(DUMMY_DOCUMENTS);
  const [expandedPrescription, setExpandedPrescription] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { prescriptions } = useAppointments();
  const patientId = Number(localStorage.getItem("userId") || "1");

  const myPrescriptions = useMemo(
    () => prescriptions.filter((p) => p.patient_id === patientId),
    [prescriptions, patientId]
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: Document[] = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      type: getTypeLabel(file),
      date: new Date().toISOString().split("T")[0],
      size: formatFileSize(file.size),
      icon: getIconFromFile(file),
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    toast.success(`${files.length} file(s) uploaded successfully`);
    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      {/* Prescriptions Section */}
      {myPrescriptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" /> Prescriptions
            </h2>
            <span className="text-sm text-muted-foreground">{myPrescriptions.length} prescription(s)</span>
          </div>
          <div className="space-y-3">
            {myPrescriptions.map((rx) => (
              <Card key={rx.id} className="border border-border bg-card">
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedPrescription(expandedPrescription === rx.id ? null : rx.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-foreground">{rx.diagnosis}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>By {rx.doctor_name}</span>
                          <span>{rx.date}</span>
                          <Badge variant="secondary" className="text-xs">{rx.medicines.length} medicine(s)</Badge>
                        </div>
                      </div>
                    </div>
                    {expandedPrescription === rx.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {expandedPrescription === rx.id && (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Medicines</p>
                        <div className="space-y-2">
                          {rx.medicines.map((med, i) => (
                            <div key={i} className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                              <span className="font-medium text-foreground">{med.name}</span>
                              <span className="text-muted-foreground">{med.dosage}</span>
                              <span className="text-muted-foreground">{med.duration}</span>
                              <span className="text-muted-foreground">{med.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {rx.notes && (
                        <div className="rounded-lg bg-muted/30 p-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Notes</p>
                          <p className="text-sm text-foreground">{rx.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Medical Documents</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{documents.length} files</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {documents.map((doc) => {
            const Icon = iconMap[doc.icon];
            return (
              <Card key={doc.id} className="border-0 shadow-none transition-colors hover:bg-muted/40">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-foreground">{doc.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                        <span>{doc.date}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;