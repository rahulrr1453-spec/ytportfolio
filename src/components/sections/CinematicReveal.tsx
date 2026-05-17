"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { BEATS, CINE_FRAME_COUNT, cineFramePath } from "@/lib/cinematic";

export function CinematicReveal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const h2InevitableRef = useRef<HTMLHeadingElement | null>(null);
  const h2IronManRef = useRef<HTMLHeadingElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const seqReadoutRef = useRef<HTMLSpanElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef("");
  const drawGeoRef = useRef({ x: 0, y: 0, w: 0, h: 0, cw: 0, ch: 0 });

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleBeats, setVisibleBeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= CINE_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = cineFramePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / CINE_FRAME_COUNT);
        if (loadedCount === CINE_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / CINE_FRAME_COUNT);
        if (loadedCount === CINE_FRAME_COUNT) {
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
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    canvas.width  = cw;
    canvas.height = ch;
    canvas.style.width  = cw + "px";
    canvas.style.height = ch + "px";

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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
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
          CINE_FRAME_COUNT - 1,
          Math.floor(progress * CINE_FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (h2InevitableRef.current) {
          const start = 0.82, end = 0.9;
          const opacity = Math.min(1, Math.max(0, (progress - start) / (end - start)));
          h2InevitableRef.current.style.opacity = String(opacity);
          h2InevitableRef.current.style.transform = `translateY(${(1 - opacity) * 20}px)`;
        }

        if (h2IronManRef.current) {
          const start = 0.91, end = 0.98;
          const opacity = Math.min(1, Math.max(0, (progress - start) / (end - start)));
          h2IronManRef.current.style.opacity = String(opacity);
          h2IronManRef.current.style.transform = `scale(${0.95 + opacity * 0.05}) translateY(${(1 - opacity) * 10}px)`;
        }

        if (outroRef.current) {
          const start = 0.98;
          const opacity = progress >= start ? 1 : 0;
          outroRef.current.style.opacity = String(opacity);
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (seqReadoutRef.current) {
          const n = Math.min(CINE_FRAME_COUNT, frameIndex + 1);
          seqReadoutRef.current.textContent = `SEQ ${String(n).padStart(3, "0")} / ${CINE_FRAME_COUNT}`;
        }

        const newVisible = new Set<string>();
        for (const b of BEATS) {
          if (progress >= b.show && progress <= b.hide) newVisible.add(b.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleBeats(newVisible);
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
        style={{ height: "100dvh" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-50 grayscale contrast-125"
          style={{ willChange: "contents" }}
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <h2
            ref={h2InevitableRef}
            className="mb-2 font-mono text-xl font-medium uppercase tracking-[0.6em] text-zinc-500 opacity-0 md:text-2xl"
          >
            Satoru Gojo
          </h2>
          <h2
            ref={h2IronManRef}
            className="glitch-text font-mono text-6xl font-black uppercase tracking-[-0.04em] text-white opacity-0 md:text-8xl lg:text-[10rem]"
            data-text="HOLLOW PURPLE"
          >
            HOLLOW PURPLE
          </h2>

          <div
            ref={outroRef}
            className="mt-12 flex flex-col items-center gap-6 opacity-0 transition-opacity duration-500"
          >
            <div className="h-12 w-px bg-accent/40" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent md:text-[13px]">
              TYzEN // Editorial Ascension Complete
            </p>
          </div>
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
            <span ref={seqReadoutRef} className="text-accent/60">SEQ 001 / {CINE_FRAME_COUNT}</span>
            <span className="hud-flicker">DOMAIN EXPANSION // UNLIMITED VOID</span>
            <span className="animate-pulse">Scroll &darr;</span>
          </div>
        </div>

        {BEATS.map((b) => {
          const visible = visibleBeats.has(b.id);
          const position =
            b.id === "b1"
              ? "top-1/3 left-6 md:left-12"
              : b.id === "b2"
              ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
              : "bottom-1/3 left-6 md:left-12";

          return (
            <div
              key={b.id}
              className={`pointer-events-auto absolute z-30 transition-all duration-700 ease-out ${position} ${
                visible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <HudFrame
                label={b.label}
                subLabel={`${b.speaker} // ${b.film}`}
                className="w-[280px] md:w-[320px] card-surface"
              >
                <div className="py-2">
                  <p className="font-mono text-[12px] leading-relaxed tracking-wide text-white md:text-[13px]">
                    "{b.quote}"
                  </p>
                </div>
              </HudFrame>
            </div>
          );
        })}
      </div>

      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <div className="mb-8 h-px w-64 overflow-hidden bg-white/10">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent animate-pulse">
            Expanding Void . {(loadProgress * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </section>
  );
}
