import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { actions, COLORS, colorBg, useStore } from "@/lib/store";
import { weeklyTasks } from "@/lib/planning";

export const Route = createFileRoute("/materias")({
  head: () => ({
    meta: [
      { title: "Matérias — Foco" },
      { name: "description", content: "Gerencie suas matérias e acompanhe o progresso de cada uma." },
      { property: "og:title", content: "Matérias — Foco" },
      { property: "og:description", content: "Gerencie suas matérias e acompanhe o progresso de cada uma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Materias,
});

function Materias() {
  const { subjects, tasks } = useStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("primary");
  const [goal, setGoal] = useState(3);

  return (
    <AppShell title="Matérias" subtitle="Suas disciplinas e o quanto você já avançou.">
      <form className="card-pop p-4 mb-6 flex flex-wrap items-center gap-3"
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) { actions.addSubject(name.trim(), color, goal); setName(""); } }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nova matéria (ex: Química)"
          className="flex-[2_1_200px] rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 ring-ring" />
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button type="button" key={c} onClick={() => setColor(c)} aria-label={c}
              className={`size-9 rounded-full border-2 border-ink ${colorBg[c]} ${color === c ? "ring-4 ring-ring" : ""}`} />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Meta/semana
          <input type="number" min={1} max={20} value={goal} onChange={(e) => setGoal(+e.target.value)} className="w-16 rounded-xl bg-secondary px-3 py-3" />
        </label>
        <button className="btn-pop flex items-center gap-1 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground"><Plus className="size-5" />Criar</button>
      </form>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((s, i) => {
          const ts = weeklyTasks(tasks).filter((t) => t.subjectId === s.id);
          const done = ts.filter((t) => t.done).length;
          const pct = Math.min(100, Math.round((done / s.goal) * 100));
          return (
            <div key={s.id} className="card-pop overflow-hidden animate-pop" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`${colorBg[s.color]} h-20 border-b-2 border-ink flex items-end justify-between p-4`}>
                <h3 className="text-2xl font-extrabold text-ink bg-card/80 rounded-xl px-3">{s.name}</h3>
                <button onClick={() => actions.removeSubject(s.id)} aria-label="Excluir matéria" className="rounded-lg bg-card/80 p-2 text-ink"><Trash2 className="size-4" /></button>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{done} / {s.goal} nesta semana</span><span>{pct}%</span>
                </div>
                <div className="h-4 rounded-full bg-secondary border-2 border-ink overflow-hidden">
                  <div className={`${colorBg[s.color]} h-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-sm text-muted-foreground mt-3">{ts.length - done} tarefas pendentes</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
