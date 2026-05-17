"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";

const specs = [
  { label: "Rendering Engine", value: "CUDA 4.0", note: "Infinite hardware acceleration" },
  { label: "Color Grading", value: "32-BIT", note: "Six Eyes chromatic precision" },
  { label: "Frame Sampling", value: "120 FPS", note: "Zero motion blur expansion" },
  { label: "Domain Storage", value: "VOID NVME", note: "Infinite timeline read speed" },
];

export function SystemsNominal() {
  return (
    <section
      id="systems"
      className="relative border-t border-accent/10 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-[1200px] bg-accent/5 blur-[120px] pointer-events-none opacity-50" />

      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 md:grid md:grid-cols-[5fr_4fr] md:gap-20 relative z-10">
        <AnimatedSection className="flex flex-col gap-8">
          <AnimatedItem>
            <EyebrowBadge>PRODUCTION RIG // STATUS NOMINAL</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="max-w-[16ch] font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl">
              Engineered with <br />
              <span className="text-accent glitch-text eye-glow" data-text="LIMITLESS">LIMITLESS</span> precision.
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="max-w-[48ch] font-mono text-sm leading-relaxed text-zinc-400 md:text-base tracking-wide">
              Every cut is a calculated strike. Using the <span className="text-white">Six Eyes</span> philosophy, 
              TYzEN perceives every sub-frame, every pixel variation, and every sound wave to create 
              the most immersive anime experiences on the platform.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <a
              href="https://www.youtube.com/@TYzEN05"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 self-start rounded-full border border-accent/20 bg-accent/5 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-300 hover:bg-accent/15 active:scale-95 shadow-[0_0_20px_rgba(0,212,255,0.1)]"
            >
              Enter YouTube Domain
              <ArrowUpRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="flex flex-col divide-y divide-accent/10 border-t border-accent/10 font-mono md:mt-3">
          {specs.map((row) => (
            <AnimatedItem key={row.label}>
              <div className="flex items-baseline justify-between gap-6 py-6 group cursor-default">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition-colors group-hover:text-accent">
                    {row.label}
                  </span>
                  <span className="font-mono text-[13px] text-zinc-400">
                    {row.note}
                  </span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white md:text-3xl stat-value">
                  {row.value}
                </span>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
