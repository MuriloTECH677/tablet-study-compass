import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Target, Timer, Trophy, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AddTask } from "@/components/AddTask";
import { TaskItem } from "@/components/TaskItem";
import { today, useStore } from "@/lib/store";
import { weeklyTasks, shiftDate } from "@/lib/planning";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foco — Painel de estudos" },
      { name: "description", content: "Organize suas tarefas, matérias e tempo de estudo em um só lugar." },
      { property: "og:title", content: "Foco — Painel de estudos" },
      { property: "og:description", content: "Organize suas tarefas, matérias e tempo de estudo em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function Index() {
  const { tasks, subjects, focus } = useStore();
  const t = today();
  const todays = tasks.filter((x) => x.date === t);
  const done = todays.filter((x) => x.done).length;
  const pct = todays.length ? Math.round((done / todays.length) * 100) : 0;
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = shiftDate(t, -i);
    if ((focus[d] ?? 0) > 0) streak++; else if (i > 0) break;
  }
  const upcoming = tasks.filter((x) => x.date > t && !x.done).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const sub = (id: string) => subjects.find((s) => s.id === id);
  const overdue = tasks.filter((task) => !task.done && task.date < t);
  const week = weeklyTasks(tasks);

  return (
    <AppShell title={`${greeting()}! 👋`} subtitle="Bora organizar os estudos de hoje?">
      <section className="bg-hero text-ink-foreground rounded-3xl border-2 border-ink p-6 md:p-8 shadow-[var(--shadow-pop)] grid md:grid-cols-[auto_1fr] gap-6 items-center animate-pop">
        <div className="relative size-36 mx-auto">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" className="fill-none stroke-ink-foreground/15" strokeWidth="12" />
            <circle cx="50" cy="50" r="42" className="fill-none stroke-primary transition-all duration-700" strokeWidth="12"
              strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 - (264 * pct) / 100} />
          </svg>
          <div className="absolute inset-0 grid place-items-center font-display text-4xl font-extrabold">{pct}%</div>
        </div>
        <div>
          <p className="uppercase tracking-widest text-sm opacity-70">Progresso de hoje</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-1">
            {done} de {todays.length} tarefas concluídas
          </h2>
          <p className="opacity-80 mt-2">{pct === 100 && todays.length ? "Mandou bem! Dia completo 🎉" : "Cada tarefa marcada é um passo a mais."}</p>
          <Link to="/foco" className="btn-pop mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">
            <Timer className="size-5" /> Começar sessão de foco
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3 my-6">
        {[
          { icon: Flame, label: "Sequência", value: `${streak} dias`, c: "bg-primary" },
          { icon: Timer, label: "Foco hoje", value: `${focus[t] ?? 0} min`, c: "bg-teal" },
          { icon: Trophy, label: "Concluídas", value: tasks.filter((x) => x.done).length, c: "bg-sun" },
        ].map(({ icon: I, label, value, c }, i) => (
          <div key={label} className="card-pop p-4 animate-pop" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`${c} grid size-10 place-items-center rounded-xl border-2 border-ink text-ink mb-2`}><I className="size-5" /></div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-display text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Target className="size-6 text-primary" /> Tarefas de hoje</h2>
          <AddTask date={t} />
          <ul className="space-y-2">
            {todays.length === 0 && <p className="text-muted-foreground p-4">Nada por aqui ainda. Adicione sua primeira tarefa!</p>}
            {todays.map((x) => <TaskItem key={x.id} task={x} subject={sub(x.subjectId)} />)}
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Próximos dias</h2>
          <div className="card-pop p-4 space-y-3">
            {upcoming.length === 0 && <p className="text-muted-foreground">Sem tarefas futuras. Planeje na <Link to="/agenda" className="text-primary font-semibold underline">Agenda</Link>.</p>}
            {upcoming.map((x) => (
              <div key={x.id} className="flex items-center gap-3">
                <div className="rounded-xl bg-accent px-3 py-1 text-center font-bold text-accent-foreground text-sm">
                  {new Date(x.date + "T12:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </div>
                <p className="font-medium truncate">{x.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      {overdue.length > 0 && <section className="mt-8 space-y-3"><div className="flex flex-wrap justify-between gap-3 items-center"><h2 className="text-2xl font-bold flex gap-2 items-center"><AlertCircle className="text-destructive" />Tarefas atrasadas</h2><Button variant="outline" asChild><Link to="/tarefas">Ver todas</Link></Button></div><ul className="space-y-2">{overdue.slice(0, 3).map((task) => <TaskItem key={task.id} task={task} subject={sub(task.subjectId)} />)}</ul></section>}
      <section className="mt-8"><div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h2 className="text-2xl font-bold flex items-center gap-2"><Target className="text-teal" />Metas da semana</h2><Button variant="ghost" asChild><Link to="/materias">Ver matérias</Link></Button></div><div className="grid sm:grid-cols-2 gap-4">{subjects.map((subject) => { const completed = week.filter((task) => task.subjectId === subject.id && task.done).length; return <div key={subject.id} className="border-b-2 border-border pb-4"><div className="flex justify-between gap-3 font-semibold mb-2"><span className="break-words">{subject.name}</span><span className="shrink-0">{completed}/{subject.goal}</span></div><progress aria-label={`Meta semanal de ${subject.name}`} value={Math.min(completed, subject.goal)} max={subject.goal} className="w-full h-3" /></div>; })}</div></section>
    </AppShell>
  );
}
