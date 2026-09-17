import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Check, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "confirmed" | "approved" | "pending" | "completed" | "cancelled" | "rejected" | "active";

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const normalized = status.toLowerCase() as StatusType;

  switch (normalized) {
    case "confirmed":
    case "approved":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 font-medium px-2.5 py-0.5 text-xs gap-1.5 transition-colors",
            className
          )}
        >
          {showIcon && <Check className="h-3 w-3 text-emerald-600 shrink-0" />}
          <span>Confirmed</span>
        </Badge>
      );

    case "pending":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70 font-medium px-2.5 py-0.5 text-xs gap-1.5 transition-colors",
            className
          )}
        >
          {showIcon && <Clock className="h-3 w-3 text-amber-600 shrink-0 animate-pulse" />}
          <span>Pending</span>
        </Badge>
      );

    case "completed":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70 font-medium px-2.5 py-0.5 text-xs gap-1.5 transition-colors",
            className
          )}
        >
          {showIcon && <CheckCircle2 className="h-3 w-3 text-blue-600 shrink-0" />}
          <span>Completed</span>
        </Badge>
      );

    case "cancelled":
    case "rejected":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70 font-medium px-2.5 py-0.5 text-xs gap-1.5 transition-colors",
            className
          )}
        >
          {showIcon && <XCircle className="h-3 w-3 text-rose-600 shrink-0" />}
          <span>Cancelled</span>
        </Badge>
      );

    case "active":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 font-medium px-2.5 py-0.5 text-xs gap-1.5 transition-colors",
            className
          )}
        >
          {showIcon && <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />}
          <span>Active</span>
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className={cn("bg-muted text-muted-foreground capitalize font-medium", className)}>
          {status}
        </Badge>
      );
  }
};
