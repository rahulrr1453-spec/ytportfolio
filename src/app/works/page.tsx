"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { ArrowLeft, Play, YoutubeLogo, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { WorkCard } from "@/components/ui/WorkCard";

const WORKS = [
  {
    id: "MZmqDmsEtpE",
    title: "Zenitsu edit - Fairy tale (Remix)",
    category: "DEMON SLAYER",
    description: "High-impact lightning effects and custom sync-heavy editing for Zenitsu's thunder breathing.",
  },
  {
    id: "BjdRNvFm1UI",
    title: "Arlecchino edit - so tired (phonk)",
    category: "GENSHIN IMPACT",
    description: "A dark, atmospheric phonk edit featuring the Father of the House of the Hearth.",
  },
  {
    id: "C9FID6gl1d8",
    title: "Gojo satoru [Edit/AMV] - RE-UP",
    category: "JUJUTSU KAISEN",
    description: "The definitive Honored One experience. Re-mastered for maximum visual fidelity.",
  },
  {
    id: "PvmR8O35jes",
    title: "Behind Blue Eyes - Vigilante Deku",
    category: "MY HERO ACADEMIA",
    description: "Capturing the raw emotion and intensity of Deku's vigilante arc. Cinematic color grading.",
  },
  {
    id: "lRYvgGAnwjU",
    title: "Me and the devil - Season 4 AMV",
    category: "DEMON SLAYER",
    description: "An atmospheric exploration of the darker side of Demon Slayer's latest season.",
  },
  {
    id: "9mDAN4MkLXQ",
    title: "Somewhere only we know - Edit/AMV",
    category: "A SILENT VOICE",
    description: "A heartfelt and emotional edit focusing on the complex relationships in Koe no Katachi.",
  },
  {
    id: "eopvt0POutk",
    title: "Call me girl - Edit/AMV",
    category: "MY DRESS-UP DARLING",
    description: "Vibrant color palette and upbeat motion graphics for Marin Kitagawa.",
  },
  {
    id: "itvxrRnME-8",
    title: "Espresso - Edit/AMV",
    category: "WIND BREAKER",
    description: "Fast-paced action editing perfectly synced to the rhythm of Wind Breaker.",
  },
  {
    id: "ZAdxjAIlmeY",
    title: "Whiskey & Wine - Edit / AMV",
    category: "MY DRESS-UP DARLING",
    description: "Smooth transitions and cinematic storytelling for a relaxed, high-quality aesthetic.",
  },
];

export default function WorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        <div className="mx-auto max-w-[1400px]">
          
          <AnimatedSection className="mb-16 md:mb-24">
            <AnimatedItem>
              <Link 
                href="/" 
                className="group inline-flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-accent transition-colors"
              >
                <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                Back to Terminal
              </Link>
            </AnimatedItem>
            
            <AnimatedItem>
              <EyebrowBadge className="mb-6">ARCHIVE // CLASSIFIED EDITS</EyebrowBadge>
            </AnimatedItem>
            
            <AnimatedItem>
              <h1 className="font-mono text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">
                Editorial <span className="glitch-text text-accent" data-text="Archive">Archive</span>
              </h1>
            </AnimatedItem>
            
            <AnimatedItem>
              <p className="max-w-2xl font-mono text-sm md:text-base text-zinc-400 leading-relaxed tracking-wide">
                Welcome to the TYzEN Domain. This is a repository of high-impact visual narratives, engineered for those who perceive every frame.
              </p>
            </AnimatedItem>
          </AnimatedSection>

          <div className="grid gap-20 md:gap-32">
            {WORKS.map((work, idx) => (
              <AnimatedSection 
                key={work.id} 
                className={`grid md:grid-cols-[1fr_450px] gap-8 md:gap-16 items-center ${idx % 2 === 1 ? 'md:grid-cols-[450px_1fr]' : ''}`}
              >
                <AnimatedItem className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <WorkCard work={work} idx={idx} layout="list" />
                </AnimatedItem>

                <AnimatedItem className={`flex flex-col gap-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                      {work.category} // 00{idx + 1}
                    </span>
                    <h2 className="font-mono text-xl md:text-3xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-accent">
                      {work.title}
                    </h2>
                  </div>
                  
                  <p className="font-mono text-sm leading-relaxed text-zinc-400">
                    {work.description}
                  </p>

                  <div className="flex items-center gap-6 mt-2 pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Codec</span>
                      <span className="font-mono text-[11px] text-zinc-300">H.265 / 4K</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Depth</span>
                      <span className="font-mono text-[11px] text-zinc-300">10-Bit</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Software</span>
                      <span className="font-mono text-[11px] text-accent">AE // PR</span>
                    </div>
                  </div>

                  <a
                    href={`https://youtu.be/${work.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 self-start mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white hover:text-accent transition-all"
                  >
                    View on YouTube
                    <Play size={14} weight="fill" className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
                  </a>
                </AnimatedItem>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-32 pt-24 border-t border-accent/20 text-center">
            <AnimatedItem>
              <div className="flex flex-col items-center gap-8">
                <YoutubeLogo size={64} weight="fill" className="text-accent animate-pulse" />
                <h2 className="font-mono text-4xl md:text-6xl font-black uppercase tracking-tight text-white max-w-2xl">
                  Expand your <span className="glitch-text text-accent" data-text="Perception">Perception</span>
                </h2>
                <p className="max-w-xl font-mono text-sm text-zinc-500 uppercase tracking-[0.2em]">
                  The archive continues on the main terminal. New domains expanded weekly.
                </p>
                <a
                  href="https://www.youtube.com/@TYzEN05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-10 py-5 bg-accent text-background font-mono text-[13px] font-black uppercase tracking-[0.4em] overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,212,255,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    View More on Channel
                    <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </a>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}
