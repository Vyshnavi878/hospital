import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  subtitle,
  breadcrumbs = [],
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-primary/3 to-transparent border-b border-slate-200/80 py-12 sm:py-16">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-10 -mt-12 -mr-12 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-12 -ml-12 w-72 h-72 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                {crumb.href && !isLast ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-1.5">
            <Badge
              variant="outline"
              className="text-xs font-bold uppercase tracking-wider text-primary border-primary/20 bg-primary/5 px-3 py-1"
            >
              <Sparkles className="h-3 w-3 text-primary mr-1" />
              {badge}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
