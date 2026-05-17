"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-accent/20 bg-black/70 backdrop-blur-3xl backdrop-saturate-150"
          : "border-b border-white/5 bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-[13px] font-bold uppercase tracking-[0.4em] text-foreground"
        >
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-accent neon-pulse"
          />
          <span className="glitch-text" data-text="TYzEN">TYzEN</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <a
            href="https://www.youtube.com/@TYzEN05"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-all hover:text-accent"
          >
            YouTube
          </a>
          <a
            href="/#works"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-all hover:text-accent"
          >
            Works
          </a>
          <Link
            href="/works"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-all hover:text-accent"
          >
            Archive
          </Link>
        </nav>

        <a
          href="https://www.youtube.com/@TYzEN05?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-300 hover:bg-accent/20 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            Subscribe
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </a>
      </div>
    </header>
  );
}
