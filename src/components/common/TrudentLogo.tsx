import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import trudentLogoImg from "@/assets/trudent-logo.png";

export interface TrudentLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  clickable?: boolean;
  className?: string;
  altText?: string;
  showTagline?: boolean;
}

/**
 * Official TRUDENT Brand Logo Component.
 * Uses the authentic hospital logo image asset from TRUDENT Multispeciality Dental Hospital.
 */
export const TrudentLogo: React.FC<TrudentLogoProps> = ({
  variant = "light",
  size = "md",
  clickable = true,
  className,
  altText = "TRUDENT Multispeciality Dental Hospital",
}) => {
  const isDark = variant === "dark";

  // Height mappings that preserve the logo's original 3:1 aspect ratio without stretching
  const sizeClasses: Record<string, { img: string; wrapper?: string }> = {
    sm: {
      img: "h-8 sm:h-9 max-h-9",
      wrapper: "p-1.5 rounded-lg",
    },
    md: {
      img: "h-10 sm:h-12 max-h-12",
      wrapper: "px-3 py-1.5 rounded-xl",
    },
    lg: {
      img: "h-14 sm:h-16 max-h-16",
      wrapper: "px-4 py-2 rounded-2xl",
    },
    xl: {
      img: "h-16 sm:h-20 max-h-20",
      wrapper: "px-5 py-2.5 rounded-2xl",
    },
    hero: {
      img: "h-20 sm:h-24 max-h-24",
      wrapper: "px-6 py-3 rounded-3xl",
    },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const imageElement = (
    <div
      className={cn(
        "inline-flex items-center justify-center transition-all select-none",
        isDark ? cn("bg-white shadow-xs border border-white/20", selectedSize.wrapper) : "bg-transparent",
        className
      )}
    >
      <img
        src={trudentLogoImg}
        alt={altText}
        className={cn(
          "w-auto max-w-full object-contain shrink-0 transition-opacity",
          selectedSize.img
        )}
        loading="eager"
        decoding="async"
      />
      {/* Screen-reader text for accessibility and SEO */}
      <span className="sr-only">
        TRUDENT MULTISPECIALITY DENTAL HOSPITAL Healthy Smiles, Happy Hearts
      </span>
    </div>
  );

  if (!clickable) {
    return imageElement;
  }

  return (
    <Link
      to="/"
      aria-label="TRUDENT Multispeciality Dental Hospital Home"
      className="inline-flex items-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl py-0.5 transition-transform hover:opacity-95"
    >
      {imageElement}
    </Link>
  );
};

export default TrudentLogo;
