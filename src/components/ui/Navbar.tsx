"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, List, X, ShieldCheck } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync scroll lock with menu open state
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

  // Live system clock for cyber header
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " GST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.25 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 120, damping: 14 } 
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${
        mobileMenuOpen 
          ? "z-[9999] h-screen bg-[#050507]" 
          : scrolled
            ? "z-40 border-b border-accent/20 bg-black/70 backdrop-blur-3xl backdrop-saturate-150"
            : "z-40 border-b border-white/5 bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="relative z-50 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-[13px] font-bold uppercase tracking-[0.4em] text-foreground z-50"
        >
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-accent neon-pulse"
          />
          <span className="glitch-text" data-text="TYzEN">TYzEN</span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.youtube.com/@TYzEN05?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex group relative overflow-hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-300 hover:bg-accent/20 active:scale-95 z-50"
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

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 rounded-full border border-white/10 bg-black/40 text-white hover:text-accent hover:border-accent/40 md:hidden transition-all duration-300 active:scale-90 z-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ backgroundColor: "rgba(5, 5, 7, 0.995)" }}
            className="fixed inset-0 z-40 flex flex-col justify-start pt-28 pb-10 px-8 overflow-y-auto md:hidden"
          >
            {/* Cyber decorative grid background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20" 
              style={{ 
                backgroundImage: "radial-gradient(rgba(0,212,255,0.15) 1px, transparent 1px)", 
                backgroundSize: "20px 20px" 
              }} 
            />
            
            {/* Soft glowing accent center bulb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Glowing Logo Card at the top of menu */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 flex flex-col items-center gap-3 mb-8 self-center"
            >
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-full bg-accent/20 blur-md group-hover:bg-accent/40 transition-all duration-500" />
                <div className="relative w-20 h-20 rounded-full border border-accent/40 p-1 bg-black/80 shadow-[0_0_20px_rgba(0,212,255,0.25)] overflow-hidden">
                  <img 
                    src="/mainlogo.jpeg" 
                    alt="TYzEN main logo" 
                    className="w-full h-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Pulsing online indicator green bulb */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-mono text-[10px] tracking-[0.35em] text-accent uppercase font-black">
                  TYzEN // ACCESS GRANTED
                </span>
                <span className="font-mono text-[8px] tracking-[0.1em] text-zinc-500 uppercase mt-0.5">
                  Secure Connection Established
                </span>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.nav 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 flex flex-col gap-5 font-mono max-w-md mx-auto w-full mb-8"
            >
              <motion.div 
                variants={itemVariants}
                className="text-[9px] tracking-[0.4em] text-accent/50 uppercase border-b border-accent/20 pb-3 mb-1 flex justify-between items-center"
              >
                <span>SYSTEM NAVIGATION DIRECTORY</span>
                <div className="flex gap-1 items-end h-2">
                  <span className="w-[1.5px] bg-accent/40 animate-[pulse_1s_infinite_100ms] h-1" />
                  <span className="w-[1.5px] bg-accent animate-[pulse_0.8s_infinite_200ms] h-2.5" />
                  <span className="w-[1.5px] bg-accent/60 animate-[pulse_0.9s_infinite_350ms] h-1.5" />
                </div>
              </motion.div>
              
              <motion.a
                variants={itemVariants}
                href="https://www.youtube.com/@TYzEN05"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="group text-xl uppercase tracking-[0.15em] font-black text-white hover:text-accent transition-colors flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-md"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px] text-accent font-bold font-mono">01 //</span>
                  YOUTUBE CHANNEL
                </span>
                <ArrowUpRight size={18} className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.a>

              <motion.a
                variants={itemVariants}
                href="/#works"
                onClick={() => setMobileMenuOpen(false)}
                className="group text-xl uppercase tracking-[0.15em] font-black text-white hover:text-accent transition-colors flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-md"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px] text-accent font-bold font-mono">02 //</span>
                  PORTFOLIO WORKS
                </span>
                <span className="text-[9px] text-zinc-500 font-bold border border-zinc-700/60 px-2 py-0.5 rounded tracking-normal">MAIN</span>
              </motion.a>

              <motion.div variants={itemVariants}>
                <Link
                  href="/works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group text-xl uppercase tracking-[0.15em] font-black text-white hover:text-accent transition-colors flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-sm w-full"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] text-accent font-bold font-mono">03 //</span>
                    EDITORIAL ARCHIVE
                  </span>
                  <span className="text-[9px] text-accent font-bold border border-accent/30 px-2 py-0.5 rounded tracking-normal">DB</span>
                </Link>
              </motion.div>

              <motion.a
                variants={itemVariants}
                href="https://www.youtube.com/@TYzEN05?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent/15 py-3.5 text-center text-xs font-black uppercase tracking-[0.25em] text-accent transition-all active:scale-95 shadow-[0_0_20px_rgba(0,212,255,0.1)] hover:bg-accent/25"
              >
                <span>SUBSCRIBE TO CREATOR</span>
                <ArrowUpRight size={14} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.a>
            </motion.nav>

            {/* Cyber bottom label with live digital clock */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 mt-auto pt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-2 font-mono text-[9px] text-zinc-500 tracking-[0.2em] border-t border-white/5 w-full max-w-md mx-auto"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-accent animate-pulse" />
                <span>SECURE ARCHIVE v1.0.0</span>
              </div>
              <span className="text-accent/60 font-black">{timeStr || "00:00:00 GST"}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
