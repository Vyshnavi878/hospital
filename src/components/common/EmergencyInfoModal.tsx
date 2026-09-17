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
import {
  PhoneCall,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Ambulance,
  ShieldAlert,
  FileText,
  Activity,
  CalendarDays,
} from "lucide-react";

interface EmergencyInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookRoutine?: () => void;
}

export const EmergencyInfoModal: React.FC<EmergencyInfoModalProps> = ({
  open,
  onOpenChange,
  onBookRoutine,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <Badge
              variant="outline"
              className="text-[11px] font-bold text-rose-700 bg-rose-50 border-rose-200 uppercase tracking-wider"
            >
              24/7 Casualty Protocols
            </Badge>
          </div>
          <DialogTitle className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
            Emergency & Urgent Care Guidance
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600">
            CarePulse Medical Center provides immediate, round-the-clock emergency casualty and trauma care. Please review critical arrival and triage guidelines below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Urgent Hotline Callout Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                24-Hour Emergency Dispatch
              </span>
              <p className="font-heading text-lg font-bold text-slate-900">
                +91 90635 84448
              </p>
              <p className="text-xs text-slate-600">
                Direct casualty triage desk & ambulance coordinator
              </p>
            </div>
            <a
              href="tel:+919063584448"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Casualty Now</span>
            </a>
          </div>

          {/* Emergency Triage Levels */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Casualty Triage Severity Classification</span>
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-3 text-xs">
              <div className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-1">
                <div className="flex items-center justify-between font-bold text-red-800">
                  <span>Level 1: Critical</span>
                  <span className="text-[10px] bg-red-200 px-1.5 py-0.5 rounded">Immediate</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  Cardiac arrest, severe respiratory failure, profound trauma, severe anaphylaxis.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-800">
                  <span>Level 2: Emergent</span>
                  <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">&lt; 15 mins</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  Acute chest pain, stroke symptoms, open fractures, uncontrolled bleeding.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 space-y-1">
                <div className="flex items-center justify-between font-bold text-blue-800">
                  <span>Level 3: Urgent</span>
                  <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded">&lt; 60 mins</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  Severe abdominal pain, high persistent fever with vomiting, deep lacerations.
                </p>
              </div>
            </div>
          </div>

          {/* Location & Physical Access */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Casualty Department Location & Physical Access</span>
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-700 space-y-2">
              <p className="font-medium text-slate-900">
                CarePulse Medical Center — Dedicated Casualty & Ambulance Bay
              </p>
              <p className="text-slate-600 leading-relaxed">
                123 Healthcare Boulevard, Central Mumbai, PIN 400001<br />
                <span className="text-slate-500">Access: Enter via <strong>East Gate (Ambulance & Casualty Ramp)</strong>. 24-hour dedicated emergency parking and wheelchair assistance are available immediately upon arrival.</span>
              </p>
            </div>
          </div>

          {/* What to Bring */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>What to Bring (If Safely Possible)</span>
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Government ID or existing hospital patient card</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Current prescription medications or medication list</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Health insurance / TPA card and policy details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Contact details of family member or emergency contact</span>
              </li>
            </ul>
          </div>

          {/* Routine Care Distinction Notice */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                Looking for routine consultation or general checkup?
              </p>
              <p className="text-slate-500 leading-relaxed">
                Casualty is reserved for acute and urgent conditions. Non-urgent cases can book a scheduled consultation with our specialists.
              </p>
            </div>
            {onBookRoutine && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onBookRoutine();
                }}
                className="shrink-0 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                <span>Book Routine OPD</span>
              </Button>
            )}
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close Emergency Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
