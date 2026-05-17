type Props = { children: React.ReactNode; className?: string };

export function EyebrowBadge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(0,212,255,0.08), 0 0 24px -8px rgba(0,212,255,0.4)",
      }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent neon-pulse" />
      {children}
    </span>
  );
}
