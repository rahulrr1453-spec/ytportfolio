"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { DIALOGUES, FRAME_COUNT, HERO_TEXT_FADE_END, framePath } from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bigLeftTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const powerReadoutRef = useRef<HTMLSpanElement | null>(null);
  const seqReadoutRef   = useRef<HTMLSpanElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef("");
  // Cached draw geometry — recomputed only on resize, not every frame
  const drawGeoRef = useRef({ x: 0, y: 0, w: 0, h: 0, cw: 0, ch: 0 });

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y, w, h, cw, ch } = drawGeoRef.current;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use logical pixels (no DPR multiplier) — source images are 1280px wide,
    // drawing at logical size is fast; DPR scaling only hurts performance.
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    canvas.width  = cw;
    canvas.height = ch;
    canvas.style.width  = cw + "px";
    canvas.style.height = ch + "px";

    // Cache draw geometry using a representative frame (frame 0)
    const refImg = framesRef.current[0];
    const iw = refImg?.naturalWidth  || 1280;
    const ih = refImg?.naturalHeight || 720;
    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;
    let w: number, h: number;
    if (canvasRatio > imgRatio) { w = cw; h = cw / imgRatio; }
    else                        { h = ch; w = ch * imgRatio; }
    if (cw <= 768) { w *= 1.3; h *= 1.3; }
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    drawGeoRef.current = { x, y, w, h, cw, ch };

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled  = true;
      ctx.imageSmoothingQuality  = "medium";
    }
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    // Recalculate geometry now that we have real image dimensions
    resizeCanvas();
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame, resizeCanvas]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        }

        if (bigLeftTextRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.1) / 0.08));
          bigLeftTextRef.current.style.opacity = String(op);
          bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (powerReadoutRef.current) {
          const pwr = 87.3 + Math.sin(progress * Math.PI * 2) * 6.7;
          powerReadoutRef.current.textContent = pwr.toFixed(1) + "%";
        }

        if (seqReadoutRef.current) {
          const n = Math.min(FRAME_COUNT, frameIndex + 1);
          seqReadoutRef.current.textContent =
            `SEQ ${String(n).padStart(3, "0")} / ${FRAME_COUNT}`;
        }

        const newVisible = new Set<string>();
        for (const d of DIALOGUES) {
          if (progress >= d.show && progress <= d.hide) newVisible.add(d.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <section ref={sectionRef} className="scroll-animation relative">
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-60"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div className="scan-sweep" />

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          ref={heroTextRef}
        >
          <EyebrowBadge className="mb-6">
            TYzEN // Editorial Archive
          </EyebrowBadge>
          <h1 className="max-w-4xl font-mono text-4xl font-bold uppercase tracking-[-0.02em] md:text-7xl lg:text-8xl">
            Edit with <span className="brand-shimmer brand-reveal eye-glow-soft">TYzEN</span>
          </h1>
          <p className="mt-8 max-w-xl font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 md:text-[13px]">
            Cinematic motion. Infinite void. <br />
            Redefining the anime aesthetic.
          </p>
        </div>

        <div
          ref={bigLeftTextRef}
          className="pointer-events-none absolute bottom-[15%] left-6 z-10 md:bottom-[20%] md:left-12 lg:left-20"
          style={{ opacity: 0 }}
        >
          <h2 className="brand-shimmer brand-reveal font-mono text-5xl font-black uppercase tracking-tighter md:text-8xl lg:text-9xl">
            LIMITLESS.
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent md:text-[12px]">
            Domain Expansion // Infinite Frames
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="mx-6 mb-3 h-[2px] bg-white/10 md:mx-10 overflow-hidden">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent shadow-[0_0_15px_rgba(0,212,255,0.8)]"
              style={{ transform: "scaleX(0)", transition: "transform 100ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span ref={seqReadoutRef} className="text-accent/60">SEQ 001 / {FRAME_COUNT}</span>
            <span className="hud-flicker">TYzEN // SIX EYES PROTOCOL</span>
            <span className="animate-pulse">Scroll &darr;</span>
          </div>
        </div>

        {DIALOGUES.map((d) => {
          const visible = visibleCards.has(d.id);
          const position =
            d.id === "d1"
              ? "top-[25%] right-6 md:right-12"
              : d.id === "d2"
              ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
              : "bottom-32 right-6 md:bottom-36 md:right-12";
          return (
            <div
              key={d.id}
              className={`pointer-events-auto absolute z-30 transition-all duration-700 ease-out ${position} ${
                visible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <HudFrame
                label={d.speaker}
                subLabel={d.film}
                className="w-[280px] md:w-[320px] card-surface"
              >
                <div className="py-2">
                  <p className="font-mono text-[12px] leading-relaxed tracking-wide text-white md:text-[13px]">
                    "{d.quote}"
                  </p>
                </div>
              </HudFrame>
            </div>
          );
        })}
      </div>

      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <div className="relative mb-8 h-px w-64 overflow-hidden bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-accent transition-all duration-300"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent animate-pulse">
            Booting TYzEN Engine . {(loadProgress * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </section>
  );
}
