import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Volume2,
  VolumeX,
  Instagram,
  Eye,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ReelItem {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  doctor: string;
  specialty: string;
  duration: string;
  views: string;
  coverImage: string;
  gradient: string;
  summary: string;
  takeaways: string[];
  treatmentLink: string;
  treatmentName: string;
  instagramUrl: string;
  videoUrl?: string;
}

const REEL_ITEMS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Wisdom Tooth Pain? Don't Ignore It",
    category: "Oral Surgery & Pain Relief",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    doctor: "Dr. Deepa Koduri",
    specialty: "BDS, MDS • Chief Dental Surgeon",
    duration: "0:52",
    views: "10K+ Likes",
    coverImage: "/images/clinic/dr-deepa-portrait.png",
    videoUrl: "/videos/reels/reel-wisdom-tooth.mp4",
    gradient: "from-rose-950/90 via-slate-950/40 to-transparent",
    summary:
      "At first, wisdom tooth pain feels like a mild toothache, but each time the pain recurs, it worsens. Swelling, gum infection, jaw stiffness, and pressure are common signs of impacted wisdom teeth. Avoid self-medicating with painkillers and get a timely checkup before severe complications arise.",
    takeaways: [
      "Recurring jaw pain or gum swelling usually indicates impacted wisdom teeth",
      "Painkillers only mask symptoms temporarily while infection and pressure continue to spread",
      "Early 3D X-ray evaluation prevents adjacent molar decay and deep nerve impingement",
    ],
    treatmentLink: "/treatments",
    treatmentName: "Wisdom Tooth Impaction & Surgery",
    instagramUrl: "https://www.instagram.com/reel/DYMyoWRPjOt/",
  },
  {
    id: "reel-2",
    title: "White Sore in Your Mouth? Causes & Care",
    category: "Oral Medicine & Care",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    doctor: "Dr. Deepa Koduri",
    specialty: "BDS, MDS • Oral Diagnostics",
    duration: "0:45",
    views: "15.8K Views",
    coverImage: "/images/clinic/dr-deepa-treatment.png",
    videoUrl: "/videos/reels/reel-white-sore.mp4",
    gradient: "from-amber-950/90 via-slate-950/40 to-transparent",
    summary:
      "A white mouth ulcer can appear suddenly and make eating uncomfortable. Frequent triggers include Vitamin B12, Iron, or Folic acid deficiency, stress, and lack of sleep. Avoid spicy foods, stay hydrated, maintain gentle oral hygiene, and consult your dentist if the sore persists beyond 2 weeks.",
    takeaways: [
      "Commonly triggered by low Vitamin B12, Iron, Folic acid, or chronic stress and fatigue",
      "Avoid spicy, acidic, and very hot foods; maintain gentle brushing and drink plenty of water",
      "Consult your dentist if a sore lasts longer than 14 days, enlarges, or turns deeply red",
    ],
    treatmentLink: "/treatments",
    treatmentName: "Oral Pathology & Preventive Care",
    instagramUrl: "https://www.instagram.com/reel/DdCCzsxvNIZ/",
  },
  {
    id: "reel-3",
    title: "Is Brushing Unsafe After Delivery? Myth Debunked",
    category: "Maternity Dental Care",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    doctor: "Dr. Deepa Koduri",
    specialty: "BDS, MDS • Maternal Oral Health",
    duration: "0:58",
    views: "12.4K Views",
    coverImage: "/images/clinic/trudent-reception.png",
    videoUrl: "/videos/reels/reel-brushing-myth.mp4",
    gradient: "from-teal-950/90 via-slate-950/40 to-transparent",
    summary:
      "A common myth claims new mothers shouldn't brush for 3 months after childbirth because teeth might fall out. In truth, skipping oral hygiene causes severe tartar buildup, swollen bleeding gums, foul breath, and yellow staining. Good oral care is essential for both mother and baby!",
    takeaways: [
      "Myth Debunked: Brushing teeth after delivery does NOT cause teeth to become loose or fall out",
      "Avoiding brushing leads to rapid tartar accumulation, red bleeding gums, and bad breath",
      "Use an ultra-soft toothbrush and gentle circular motions to safeguard postpartum oral health",
    ],
    treatmentLink: "/treatments",
    treatmentName: "Maternal & Periodontal Dental Care",
    instagramUrl: "https://www.instagram.com/reel/DcymoXLPjD8/",
  },
  {
    id: "reel-4",
    title: "Is Your Child Still Thumb Sucking? Early Guidance",
    category: "Pediatric Dentistry",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    doctor: "Dr. Deepa Koduri",
    specialty: "BDS, MDS • Pediatric & Ortho Guidance",
    duration: "0:48",
    views: "9.6K Views",
    coverImage: "/images/clinic/trudent-waiting-lounge.png",
    videoUrl: "/videos/reels/reel-thumb-sucking.mp4",
    gradient: "from-purple-950/90 via-slate-950/40 to-transparent",
    summary:
      "Thumb sucking is normal in toddlers, but if it continues past early childhood, it alters bite alignment, deforms the palate, and causes an open bite. Early clinical evaluation and habit-breaking appliances prevent the need for complex corrective braces later.",
    takeaways: [
      "Prolonged thumb sucking exerts pressure on the palate, leading to open bite and crooked teeth",
      "Early dental screening identifies jaw habit changes before adult teeth fully erupt",
      "Gentle custom habit-breaking appliances can help children discontinue the habit without stress",
    ],
    treatmentLink: "/treatments",
    treatmentName: "Pediatric Dentistry & Early Orthodontics",
    instagramUrl: "https://www.instagram.com/reel/Dc6VgUBPzf1/",
  },
];

interface ReelCardProps {
  reel: ReelItem;
  onOpenTips: (reel: ReelItem) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onOpenTips }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCardClick = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="shrink-0 w-[240px] sm:w-auto snap-center group relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between select-none"
      style={{ aspectRatio: "9/16" }}
    >
      {/* Background HTML5 Video (plays directly on the page on hover/tap without buttons blocking view) */}
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.coverImage}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <img
          src={reel.coverImage}
          alt={reel.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
        />
      )}

      {/* Dynamic Overlay Gradient: slightly dims when playing so video is vibrant and clear */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          isPlaying
            ? "bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40"
            : "bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30"
        )}
      />

      {/* Top Bar: Category indicator + Audio Mute/Unmute Toggle + Duration */}
      <div className="relative z-10 p-3.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/20">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              isPlaying ? "bg-emerald-400 animate-ping" : "bg-pink-500"
            )}
          />
          <span>{isPlaying ? "Playing Directly" : reel.category}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {/* Audio Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Click to unmute sound" : "Click to mute"}
            className={cn(
              "h-7 w-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border",
              isMuted
                ? "bg-black/60 text-slate-300 border-white/20 hover:bg-pink-600 hover:text-white"
                : "bg-pink-600 text-white border-pink-400 shadow-xs scale-105"
            )}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 animate-pulse" />
            )}
          </button>

          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-slate-300">
            <Clock className="h-3 w-3" />
            <span>{reel.duration}</span>
          </span>
        </div>
      </div>

      {/* Spacer to push content down - Play/Pause buttons removed as requested */}
      <div className="flex-1" />

      {/* Bottom Content & Playback Progress Bar */}
      <div className="relative z-10 text-left bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        {/* Playback Progress Indicator */}
        <div className="h-1 w-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-pink-300">
            <div className="flex items-center gap-1.5">
              <Instagram className="h-3 w-3 text-pink-400" />
              <span>@trudent_kakinada</span>
            </div>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Eye className="h-2.5 w-2.5" />
              {reel.views}
            </span>
          </div>

          <h3 className="font-heading font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2 group-hover:text-pink-200 transition-colors">
            {reel.title}
          </h3>

          <p className="text-[11px] text-slate-300 line-clamp-1 font-normal">
            {reel.doctor} • {reel.specialty}
          </p>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
            {/* Direct button to open clinical advice takeaways */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTips(reel);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 hover:text-teal-100 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Clinical Tips</span>
              <ChevronRight className="h-3 w-3" />
            </button>

            {/* Direct link to reel on Instagram */}
            <a
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-pink-300 transition-colors"
              title="Open on Instagram"
            >
              <span>Instagram</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DoctorReelsSection: React.FC = () => {
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/60 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50/70 px-3 py-1 text-xs font-bold text-pink-700">
              <Instagram className="h-3.5 w-3.5 text-pink-600" />
              <span>DOCTOR CLINICAL TIPS & REELS</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Doctor Suggestions & Instagram Reels
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hover over any reel to watch <strong className="text-slate-800 font-semibold">Dr. Deepa Koduri, BDS, MDS</strong> directly on this page. Tap the sound icon to hear clinical audio.
            </p>
          </div>

          {/* Direct Instagram Follow Button */}
          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://www.instagram.com/trudent_kakinada/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 hover:from-pink-100 hover:to-rose-100 text-pink-800 text-xs sm:text-sm font-bold shadow-2xs transition-all duration-200 active:scale-95 group"
            >
              <Instagram className="h-4 w-4 text-pink-600 transition-transform group-hover:scale-110" />
              <span>Follow @trudent_kakinada</span>
              <ExternalLink className="h-3 w-3 text-pink-500" />
            </a>
          </div>
        </div>

        {/* Reels Showcase: Mobile Horizontal Swipe Carousel / Desktop 4-Column Grid */}
        <div className="relative">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {REEL_ITEMS.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onOpenTips={(r) => setSelectedReel(r)}
              />
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex items-center justify-center gap-1.5 pt-3 text-[11px] text-slate-500 sm:hidden">
            <span>👉 Swipe or tap any reel to play directly on page</span>
          </div>
        </div>

        {/* Doctor Advice Footer Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                Have a dental question or concern?
              </p>
              <p className="text-xs text-slate-600">
                Dr. Deepa provides clear consultation explanations and custom digital treatment plans for every patient.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link to="/doctors" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                Meet Dr. Deepa
              </Button>
            </Link>

            <Link to="/appointment" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-10 px-4 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Book OPD Consultation</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Clinical Advice Modal with authentic 9:16 Reel ratio */}
      {selectedReel && (
        <Dialog open={!!selectedReel} onOpenChange={(v) => !v && setSelectedReel(null)}>
          <DialogContent className="sm:max-w-3xl md:max-w-4xl p-0 overflow-hidden rounded-3xl border-slate-200 max-h-[92vh] flex flex-col md:flex-row bg-white">
            <DialogTitle className="sr-only">{selectedReel.title}</DialogTitle>

            {/* Left Column: Full 9:16 Vertical Video Player (NO Zoom, Exact Aspect Ratio) */}
            <div className="md:w-[320px] lg:w-[350px] shrink-0 bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-4 relative border-b md:border-b-0 md:border-r border-slate-800">
              <div className="relative w-full aspect-[9/16] max-h-[360px] sm:max-h-[420px] md:max-h-[500px] rounded-2xl overflow-hidden bg-black shadow-xl flex items-center justify-center">
                {selectedReel.videoUrl ? (
                  <video
                    src={selectedReel.videoUrl}
                    poster={selectedReel.coverImage}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedReel.coverImage}
                    alt={selectedReel.title}
                    className="w-full h-full object-contain"
                  />
                )}

                {/* Top Overlay Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                  <Badge className="bg-pink-600/90 text-white text-[10px] font-bold border-0 px-2 py-0.5 backdrop-blur-xs">
                    <Instagram className="h-3 w-3 mr-1" />
                    Reel
                  </Badge>
                  <span className="text-white/80 text-[10px] font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {selectedReel.duration}
                  </span>
                </div>
              </div>

              <div className="w-full pt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>@trudent_kakinada</span>
                <span>{selectedReel.views}</span>
              </div>
            </div>

            {/* Right Column: Doctor's Clinical Tips & Direct Actions */}
            <div className="flex-1 p-5 sm:p-6 md:p-7 overflow-y-auto space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header info */}
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-pink-600" />
                    <span>{selectedReel.category}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                    {selectedReel.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    By <strong className="text-slate-800">{selectedReel.doctor}</strong> • {selectedReel.specialty}
                  </p>
                </div>

                {/* Doctor's Summary */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs space-y-1.5">
                  <span className="font-bold text-teal-950 block flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    Doctor's Clinical Recommendation:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {selectedReel.summary}
                  </p>
                </div>

                {/* 3 Key Takeaways */}
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                    Key Actionable Advice:
                  </h4>
                  <div className="space-y-2">
                    {selectedReel.takeaways.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800"
                      >
                        <div className="h-5 w-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                          {idx + 1}
                        </div>
                        <span className="leading-snug font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100 mt-2">
                <Link
                  to={`/appointment?treatment=${encodeURIComponent(selectedReel.treatmentName)}`}
                  onClick={() => setSelectedReel(null)}
                  className="w-full sm:flex-1"
                >
                  <Button className="w-full h-11 px-5 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Book OPD Consultation</span>
                  </Button>
                </Link>

                <a
                  href={selectedReel.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-pink-200 bg-pink-50/70 hover:bg-pink-100 text-pink-800 font-bold text-xs shadow-2xs transition-all"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span>Watch on Instagram</span>
                  <ExternalLink className="h-3 w-3 text-pink-500" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default DoctorReelsSection;
