import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreatmentItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  desc: string;
  features: string[];
  icon: LucideIcon;
  popular?: boolean;
}

interface TreatmentCardProps {
  treatment: TreatmentItem;
  className?: string;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  className,
}) => {
  const Icon = treatment.icon;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between",
        treatment.popular && "ring-2 ring-primary/20 border-primary/40",
        className
      )}
    >
      {treatment.popular && (
        <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
          <Sparkles className="h-2.5 w-2.5" />
          Most Requested
        </span>
      )}

      <div className="space-y-4">
        {/* Header with Icon and Category */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200 shadow-2xs">
            <Icon className="h-6 w-6" />
          </div>
          <Badge
            variant="outline"
            className="text-[11px] font-semibold text-slate-600 bg-slate-50 border-slate-200"
          >
            {treatment.category}
          </Badge>
        </div>

        {/* Title and Duration */}
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-primary transition-colors leading-snug">
            {treatment.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Avg. Duration: {treatment.duration}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {treatment.desc}
        </p>

        {/* Key Features Checklist */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          {treatment.features.map((feat) => (
            <div
              key={feat}
              className="flex items-start gap-2 text-xs text-slate-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Book Treatment Action */}
      <div className="pt-5 mt-5 border-t border-slate-100">
        <Link
          to={`/appointment?treatment=${encodeURIComponent(treatment.title)}`}
          className="w-full block"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-between h-10 px-4 text-xs font-semibold text-primary hover:bg-primary hover:text-white border-primary/25 rounded-xl cursor-pointer group/btn transition-all"
          >
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Book Treatment
            </span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
