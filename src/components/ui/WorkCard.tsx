"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play } from "@phosphor-icons/react";

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  codec?: string;
  depth?: string;
  software?: string;
};

type WorkCardProps = {
  work: WorkItem;
  idx: number;
  layout?: "grid" | "list";
};

export function WorkCard({ work, idx, layout = "grid" }: WorkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      setIsLoading(true);
      // Debounce video preview trigger by 300ms to prevent accidental loads on mouse sweeps
      hoverTimerRef.current = setTimeout(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }, 300);
    } else {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      setIsPlaying(false);
      setIsLoading(false);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [isHovered]);

  // Thumbnail URL option (high-quality)
  const thumbnailUrl = `https://img.youtube.com/vi/${work.id}/maxresdefault.jpg`;
  
  return (
    <div 
      className="group relative flex flex-col gap-4 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Box */}
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 card-surface transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]"
      >
        {/* Cover Thumbnail Image */}
        <img
          src={thumbnailUrl}
          alt={work.title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            isPlaying ? "opacity-0 scale-105" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
          }`}
          onError={(e) => {
            // Fallback if maxresdefault is missing for older videos
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${work.id}/0.jpg`;
          }}
        />

        {/* Loading Preview Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 z-20">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent animate-spin" />
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent/40 animate-spin [animation-direction:reverse]" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent mt-4 animate-pulse">
              LOADING PREVIEW STREAM...
            </span>
          </div>
        )}

        {/* Muted Autoplay Iframe Preview */}
        {isPlaying && (
          <iframe
            className="absolute inset-0 h-full w-full transition-opacity duration-500 opacity-100"
            src={`https://www.youtube.com/embed/${work.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${work.id}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&playsinline=1`}
            title={work.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}

        {/* Cyber overlay indicators */}
        <div className="absolute inset-x-0 top-0 p-3 flex justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/5 backdrop-blur-md">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-zinc-500"}`} />
            <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-300 font-bold uppercase">
              {isPlaying ? "PREVIEW CONNECTED" : "FEED SECURE"}
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-black/60 border border-white/5 backdrop-blur-md">
            <span className="font-mono text-[8px] tracking-[0.1em] text-accent uppercase">
              SYS // {work.category}
            </span>
          </div>
        </div>

        {/* Subtle grid pattern inside */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", 
            backgroundSize: "10px 10px" 
          }} 
        />

        {/* Tech decorative crosshairs */}
        <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-accent/60 transition-colors pointer-events-none" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-accent/60 transition-colors pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-accent/60 transition-colors pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-accent/60 transition-colors pointer-events-none" />

        {/* Hover Play button indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-accent/5 pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <Play size={20} weight="fill" className="translate-x-0.5" />
          </div>
        </div>

        {/* Click Trigger */}
        <a 
          href={`https://youtu.be/${work.id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 z-20"
        />
      </div>

      {/* Info details */}
      {layout === "grid" && (
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
            <span>VOL. 00{idx + 1}</span>
            <span className="text-accent">{work.category}</span>
          </div>
          <h3 className="font-mono text-sm md:text-base font-black tracking-tight text-white uppercase group-hover:text-accent transition-colors duration-300 truncate">
            {work.title}
          </h3>
          {work.description && (
            <p className="font-mono text-[11px] text-zinc-400 leading-relaxed tracking-wide line-clamp-2 mt-1">
              {work.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
