"use client";

import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { YoutubeLogo, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { WorkCard } from "@/components/ui/WorkCard";

const WORKS = [
  {
    id: "MZmqDmsEtpE",
    title: "Zenitsu edit - Fairy tale (Remix)",
    category: "DEMON SLAYER",
  },
  {
    id: "BjdRNvFm1UI",
    title: "Arlecchino edit - so tired (phonk)",
    category: "GENSHIN IMPACT",
  },
  {
    id: "C9FID6gl1d8",
    title: "Gojo satoru [Edit/AMV] - RE-UP",
    category: "JUJUTSU KAISEN",
  },
  {
    id: "PvmR8O35jes",
    title: "Behind Blue Eyes - Vigilante Deku",
    category: "MY HERO ACADEMIA",
  },
  {
    id: "lRYvgGAnwjU",
    title: "Me and the devil - Season 4 AMV",
    category: "DEMON SLAYER",
  },
  {
    id: "9mDAN4MkLXQ",
    title: "Somewhere only we know - A silent voice",
    category: "ANIME EDIT",
  },
];

export function WorksPreview() {
  return (
    <section id="works" className="relative border-t border-accent/10 bg-background px-6 py-24 md:px-10 md:py-32 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection className="mb-16">
          <AnimatedItem>
            <EyebrowBadge className="mb-6">ARCHIVE // LATEST PRODUCTIONS</EyebrowBadge>
          </AnimatedItem>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <AnimatedItem>
              <h2 className="font-mono text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Editorial <span className="glitch-text text-accent" data-text="Archive">Archive</span>
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <Link 
                href="/works" 
                className="group flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-accent transition-all hover:text-white"
              >
                Enter Full Database
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimatedItem>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {WORKS.map((work, idx) => (
            <AnimatedItem key={work.id}>
              <WorkCard work={work} idx={idx} />
            </AnimatedItem>
          ))}
        </div>

        <AnimatedSection className="mt-20 text-center">
          <AnimatedItem>
            <a
              href="https://www.youtube.com/@TYzEN05"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-col items-center gap-4 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.5em] text-accent">
                <YoutubeLogo size={24} weight="fill" />
                View more on channel
              </div>
              <div className="h-px w-32 bg-accent/20 transition-all group-hover:w-48 group-hover:bg-accent/60" />
            </a>
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
