import { PhoneCall, AlertCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmergencyBanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 animate-pulse">
            <AlertCircle className="h-4 w-4 text-white" />
          </span>
          <span>
            <strong>24/7 Hospital Emergency & Trauma Care:</strong> Immediate assistance available
          </span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <a
            href="tel:+919063584448"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-red-700 shadow hover:bg-white/90 transition-all text-xs"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Emergency: +91 90635 84448</span>
          </a>
          <span className="hidden md:inline-flex items-center gap-1 text-white/80 text-xs font-normal">
            <Clock className="h-3.5 w-3.5" /> 24 Hours Open
          </span>
        </div>
      </div>
    </div>
  );
};
