import React from "react";

type Props = {
  label?: string;
  subLabel?: string;
  className?: string;
  children?: React.ReactNode;
};

export function HudCorner({ corner, size = 16, className = "" }: { corner: "tl" | "tr" | "bl" | "br"; size?: number; className?: string }) {
  const paths = {
    tl: `M 2 ${size} L 2 2 L ${size} 2`,
    tr: `M 2 2 L ${size} 2 L ${size} ${size}`,
    bl: `M 2 0 L 2 ${size} L ${size} ${size}`,
    br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      <path
        d={paths[corner]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function HudFrame({ label, subLabel, className = "", children }: Props) {
  return (
    <div className={`relative p-5 border border-white/5 bg-black/60 backdrop-blur-md overflow-hidden rounded-md ${className}`}>
      {/* HUD Corners */}
      <HudCorner corner="tl" className="absolute top-0 left-0 text-accent/80" />
      <HudCorner corner="tr" className="absolute top-0 right-0 text-accent/80" />
      <HudCorner corner="bl" className="absolute bottom-0 left-0 text-accent/80" />
      <HudCorner corner="br" className="absolute bottom-0 right-0 text-accent/80" />

      {/* Cyber Grid Background lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

      {/* Header section if label is provided */}
      {(label || subLabel) && (
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 font-mono">
          {label && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-black">
              {label}
            </span>
          )}
          {subLabel && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">
              {subLabel}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

