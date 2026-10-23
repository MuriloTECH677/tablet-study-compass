import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AddTask } from "@/components/AddTask";
import { TaskItem } from "@/components/TaskItem";
import { colorBg, today, useStore } from "@/lib/store";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda semanal — Foco" },
      { name: "description", content: "Planeje sua semana de estudos dia a dia." },
      { property: "og:title", content: "Agenda semanal — Foco" },
      { property: "og:description", content: "Planeje sua semana de estudos dia a dia." },
    ],
  }),
  component: Agenda,
});

const iso = (d: Date) => d.toISOString().slice(0, 10);

function Agenda() {
  const { tasks, subjects } = useStore();
  const [offset, setOffset] = useState(0);
  const [sel, setSel] = useState(today());
  const base = new Date();
  base.setDate(base.getDate() - ((base.getDay() + 6) % 7) + offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
  const dayTasks = tasks.filter((t) => t.date === sel);

  return (
    <AppShell title="Agenda" subtitle="Toque em um dia para ver e planejar.">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setOffset(offset - 1)} className="btn-pop rounded-xl bg-card p-3" aria-label="Semana anterior"><ChevronLeft /></button>
        <p className="font-display text-xl font-bold capitalize">{days[0].toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
        <button onClick={() => setOffset(offset + 1)} className="btn-pop rounded-xl bg-card p-3" aria-label="Próxima semana"><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((d) => {
          const k = iso(d);
          const ts = tasks.filter((t) => t.date === k);
          const active = k === sel;
          return (
            <button key={k} onClick={() => setSel(k)}
              className={`btn-pop rounded-2xl p-2 md:p-3 text-center min-h-28 flex flex-col items-center ${active ? "bg-ink text-ink-foreground" : k === today() ? "bg-accent" : "bg-card"}`}>
              <span className="text-xs uppercase opacity-70">{d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</span>
              <span className="font-display text-2xl md:text-3xl font-extrabold">{d.getDate()}</span>
              <span className="mt-auto flex flex-wrap justify-center gap-1">
                {ts.slice(0, 6).map((t) => (
                  <span key={t.id} className={`size-2.5 rounded-full ${colorBg[subjects.find((s) => s.id === t.subjectId)?.color ?? "ink"]} ${t.done ? "opacity-30" : ""}`} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <h2 className="text-2xl font-bold mb-3 capitalize">
        {new Date(sel + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
      </h2>
      <AddTask key={sel} date={sel} />
      <ul className="space-y-2 mt-3">
        {dayTasks.length === 0 && <p className="text-muted-foreground p-4">Dia livre! Que tal planejar uma revisão?</p>}
        {dayTasks.map((t) => <TaskItem key={t.id} task={t} subject={subjects.find((s) => s.id === t.subjectId)} />)}
      </ul>
    </AppShell>
  );
}
