import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { actions, today, useStore } from "@/lib/store";

export const Route = createFileRoute("/foco")({
  head: () => ({
    meta: [
      { title: "Modo foco (Pomodoro) — Foco" },
      { name: "description", content: "Cronômetro Pomodoro para estudar com concentração e pausas." },
      { property: "og:title", content: "Modo foco (Pomodoro) — Foco" },
      { property: "og:description", content: "Cronômetro Pomodoro para estudar com concentração e pausas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Foco,
});

const MODES = { foco: { label: "Foco", min: 25 }, curta: { label: "Pausa curta", min: 5 }, longa: { label: "Pausa longa", min: 15 } } as const;
type Mode = keyof typeof MODES;

function Foco() {
  const { focus } = useStore();
  const [mode, setMode] = useState<Mode>("foco");
  const [left, setLeft] = useState(MODES.foco.min * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => setLeft((l) => l - 1), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    setRunning(false);
    if (mode === "foco") actions.addFocus(MODES.foco.min);
    try { navigator.vibrate?.(400); } catch {}
    const next: Mode = mode === "foco" ? "curta" : "foco";
    setMode(next); setLeft(MODES[next].min * 60);
  }, [left, mode]);

  const pick = (m: Mode) => { setMode(m); setRunning(false); setLeft(MODES[m].min * 60); };
  const total = MODES[mode].min * 60;
  const pct = 1 - left / total;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 864e5);
    const k = d.toISOString().slice(0, 10);
    return { k, label: d.toLocaleDateString("pt-BR", { weekday: "narrow" }), v: focus[k] ?? 0 };
  });
  const max = Math.max(60, ...week.map((w) => w.v));

  return (
    <AppShell title="Modo foco" subtitle="Técnica Pomodoro: 25 min estudando, 5 min descansando.">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="bg-hero text-ink-foreground rounded-3xl border-2 border-ink shadow-[var(--shadow-pop)] p-6 md:p-10 flex flex-col items-center">
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button key={m} onClick={() => pick(m)}
                className={`rounded-full px-5 py-2 font-semibold border-2 border-ink-foreground/30 ${mode === m ? "bg-ink-foreground text-ink" : ""}`}>
                {MODES[m].label}
              </button>
            ))}
          </div>
          <div className="relative size-64 md:size-80">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r="45" className="fill-none stroke-ink-foreground/15" strokeWidth="6" />
              <circle cx="50" cy="50" r="45" className={`fill-none transition-all duration-1000 ${mode === "foco" ? "stroke-primary" : "stroke-teal"}`}
                strokeWidth="6" strokeLinecap="round" strokeDasharray={283} strokeDashoffset={283 - 283 * pct} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-6xl md:text-7xl font-extrabold tabular-nums">{mm}:{ss}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setRunning(!running)} className="btn-pop flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-xl font-bold text-primary-foreground">
              {running ? <><Pause /> Pausar</> : <><Play /> Iniciar</>}
            </button>
            <button onClick={() => pick(mode)} aria-label="Reiniciar" className="btn-pop rounded-2xl bg-card px-5 py-4 text-ink"><RotateCcw /></button>
          </div>
        </section>

        <section className="card-pop p-6 self-start">
          <h2 className="text-2xl font-bold">Sua semana</h2>
          <p className="text-muted-foreground mb-6">Hoje: <b className="text-foreground">{focus[today()] ?? 0} min</b> de foco</p>
          <div className="flex items-end justify-between gap-2 h-48">
            {week.map((w) => (
              <div key={w.k} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-bold">{w.v || ""}</span>
                <div className={`w-full rounded-t-xl border-2 border-ink ${w.k === today() ? "bg-primary" : "bg-teal"}`}
                  style={{ height: `${Math.max(4, (w.v / max) * 100)}%` }} />
                <span className="text-xs uppercase text-muted-foreground">{w.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
