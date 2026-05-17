import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-accent/10 bg-background px-6 py-14 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 font-mono text-[13px] font-bold uppercase tracking-[0.4em] text-foreground">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full bg-accent neon-pulse"
              />
              <span className="glitch-text" data-text="TYzEN">TYzEN</span>
            </div>
            <p className="max-w-[42ch] font-mono text-xs leading-relaxed text-zinc-400 tracking-wider">
              &copy; 2026 TYzEN // Editorial Ascension. <br />
              Cinematic storytelling at the edge of the void. <br />
              Subscribe for high-impact anime edits.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.youtube.com/@TYzEN05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent hover:text-white transition-colors"
              >
                YouTube
              </a>
              <a 
                href="#" 
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-accent transition-colors underline decoration-accent/30 underline-offset-4"
              >
                Contact
              </a>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-6 md:grid-cols-3">
            {[
              ["AMVs (Cinematic)", "High impact edits"],
              ["VFX Shorts", "Infinite motion graphics"],
              ["Color Grading", "Six Eyes chromatic precision"],
              ["Sound Design", "Audio immersion"],
              ["Domain Expansions", "Full project files"],
              ["Editing Tutorials", "Master the limitless"],
            ].map(([name, note]) => (
              <a
                key={name}
                href="https://www.youtube.com/@TYzEN05"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5"
              >
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-white transition-colors group-hover:text-accent">
                  {name}
                  <ArrowUpRight
                    size={11}
                    weight="bold"
                    className="ml-1 inline-block align-baseline opacity-0 transition-all -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                  />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {note}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-accent/10 pt-8 font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Production Engine // 2026.05.16</span>
            <span className="text-accent/40">Status: ASCENDED</span>
            <span>Uptime: ∞</span>
          </div>
          <span className="text-zinc-500 hover:text-accent transition-colors cursor-default">Designed for the Honored One.</span>
        </div>
      </div>
    </footer>
  );
}
