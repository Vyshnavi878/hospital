import React from "react";
import { Check, Clock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimeSlotProps {
  time: string;
  isBooked: boolean;
  isSelected?: boolean;
  onSelect?: (time: string) => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isBooked,
  isSelected = false,
  onSelect,
  disabled = false,
  className,
  compact = false,
}) => {
  const isSlotDisabled = isBooked || disabled;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSlotDisabled) {
      e.preventDefault();
      return;
    }
    onSelect?.(time);
  };

  return (
    <button
      type="button"
      disabled={isSlotDisabled}
      aria-disabled={isSlotDisabled}
      aria-pressed={isSelected}
      aria-label={`${time} ${isBooked ? "Booked" : isSelected ? "Selected" : "Available"}`}
      data-testid={`time-slot-${time.replace(/[:\s]/g, "-")}`}
      data-slot-time={time}
      data-slot-status={isBooked ? "booked" : isSelected ? "selected" : "available"}
      onClick={handleClick}
      className={cn(
        "relative rounded-xl font-medium transition-all duration-150 flex flex-col items-center justify-center select-none text-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
        compact ? "py-2 px-2 min-h-[52px]" : "py-3 px-2 sm:px-3 min-h-[64px]",
        // State 1: Booked
        isBooked &&
          "bg-slate-100/90 border border-dashed border-slate-300/80 text-slate-400 cursor-not-allowed opacity-75 shadow-none",
        // State 2: Selected
        !isBooked &&
          isSelected &&
          "bg-primary text-white border-2 border-primary shadow-sm ring-2 ring-primary/25 cursor-pointer transform scale-[1.02]",
        // State 3: Available (not selected)
        !isBooked &&
          !isSelected &&
          "bg-white text-slate-800 border border-slate-200 shadow-2xs hover:border-primary/60 hover:bg-primary/5 hover:text-primary active:scale-[0.98] cursor-pointer",
        className
      )}
    >
      {/* Time Header */}
      <div className="flex items-center gap-1.5 justify-center">
        {isBooked ? (
          <Ban className="h-3.5 w-3.5 text-rose-500/80 shrink-0" aria-hidden="true" />
        ) : isSelected ? (
          <Check className="h-3.5 w-3.5 text-white shrink-0 stroke-[3]" aria-hidden="true" />
        ) : (
          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        )}
        <span
          className={cn(
            "text-xs sm:text-sm font-bold tracking-tight",
            isBooked
              ? "line-through decoration-slate-400 text-slate-400"
              : isSelected
              ? "text-white"
              : "text-slate-800"
          )}
        >
          {time}
        </span>
      </div>

      {/* Sub-label badge */}
      <div className="mt-1">
        {isBooked ? (
          <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/70 px-1.5 py-0.5 rounded">
            Booked
          </span>
        ) : isSelected ? (
          <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-white/90">
            Selected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            Available
          </span>
        )}
      </div>
    </button>
  );
};

export default TimeSlot;
