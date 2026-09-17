import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  badgeVariant?: "default" | "outline" | "secondary";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
  className,
  badgeVariant = "outline",
}) => {
  return (
    <div
      className={cn(
        "space-y-2.5 mb-10 sm:mb-12",
        centered ? "text-center max-w-2xl mx-auto" : "text-left max-w-2xl",
        className
      )}
    >
      {badge && (
        <Badge
          variant={badgeVariant}
          className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5 px-3 py-1"
        >
          {badge}
        </Badge>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
