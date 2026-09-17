import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "privacy" | "terms";
}

export const LegalModal: React.FC<LegalModalProps> = ({
  open,
  onOpenChange,
  type,
}) => {
  const isPrivacy = type === "privacy";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isPrivacy ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </span>
            <Badge
              variant="outline"
              className="text-[11px] font-bold text-primary bg-primary/5 border-primary/20 uppercase tracking-wider"
            >
              {isPrivacy ? "Patient Data Protection" : "Hospital Guidelines"}
            </Badge>
          </div>
          <DialogTitle className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
            {isPrivacy ? "Patient Privacy Policy" : "Terms of Service & Booking"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600">
            {isPrivacy
              ? "CarePulse Health is committed to safeguarding patient medical records and personal health information."
              : "Please review our online appointment booking guidelines and hospital outpatient policies."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isPrivacy ? (
            <>
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  1. Health Record Confidentiality
                </h4>
                <p className="text-xs text-slate-600">
                  Patient medical histories, consultation notes, and laboratory diagnostic reports are stored securely with strict role-based access restricted solely to authorized attending medical officers.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  2. Digital Appointment Privacy
                </h4>
                <p className="text-xs text-slate-600">
                  Appointment booking tokens, symptoms notes, and consultation schedules are encrypted and never disclosed to commercial third parties.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  3. Telehealth Consultation Security
                </h4>
                <p className="text-xs text-slate-600">
                  All digital video sessions and e-prescriptions conform to clinical data privacy standards, guaranteeing patient-physician confidentiality.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  4. Patient Data Rights
                </h4>
                <p className="text-xs text-slate-600">
                  Patients have the right to request a complete copy of their hospital records, update contact details, or request account deactivation via the Patient Dashboard.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  1. Appointment Scheduling & Tokens
                </h4>
                <p className="text-xs text-slate-600">
                  Booking an appointment generates an official consultation token with a designated specialist. Please arrive at the OPD reception 10 minutes prior to your allocated consultation slot.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  2. Rescheduling & Cancellations
                </h4>
                <p className="text-xs text-slate-600">
                  Patients may reschedule or cancel confirmed appointments up to 2 hours prior to the consultation window directly through their Patient Portal without penalty.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900">
                <h4 className="font-semibold text-rose-950 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  3. Emergency Medical Disclaimer
                </h4>
                <p className="text-xs text-rose-800">
                  This online scheduling platform is designed for elective outpatient consultations only. If you or someone requires immediate urgent medical care, call our 24/7 Casualty Hotline (+91 90635 84448) or visit emergency casualty immediately.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  4. Patient Identification
                </h4>
                <p className="text-xs text-slate-600">
                  First-time hospital visitors must present a valid government-issued photo ID at the physical reception desk to complete medical file registration.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
