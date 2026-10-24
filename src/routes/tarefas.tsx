import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ListChecks, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AddTask } from "@/components/AddTask";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { today, useStore } from "@/lib/store";
import { filterTasks, type TaskFilters } from "@/lib/planning";

export const Route = createFileRoute("/tarefas")({
  head: () => ({ meta: [
    { title: "Todas as tarefas — Foco" },
    { name: "description", content: "Encontre tarefas, reorganize prazos e agende revisões dos seus estudos." },
    { property: "og:title", content: "Todas as tarefas — Foco" },
    { property: "og:description", content: "Encontre tarefas, reorganize prazos e agende revisões dos seus estudos." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Tarefas,
});

function Tarefas() {
  const { tasks, subjects } = useStore();
  const [filters, setFilters] = useState<TaskFilters>({ query: "", subjectId: "", priority: "", status: "all" });
  const results = filterTasks(tasks, filters, today());
  const overdue = tasks.filter((task) => !task.done && task.date < today()).length;
  return <AppShell title="Tarefas" subtitle="Tudo o que você planejou, em um só lugar.">
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="flex gap-2 items-center font-semibold"><ListChecks className="text-teal size-5" />{tasks.filter((task) => !task.done).length} pendentes</span>
      {overdue > 0 && <Button variant="outline" className="h-11 text-destructive" onClick={() => setFilters({ ...filters, status: "overdue" })}><AlertCircle />{overdue} atrasadas</Button>}
    </div>
    <AddTask />
    <section className="mt-7 space-y-4">
      <div className="relative"><Search className="absolute left-3 top-3.5 size-5 text-muted-foreground" /><input aria-label="Buscar tarefas" placeholder="Buscar uma tarefa…" value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} className="w-full rounded-lg border-2 border-border bg-card py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <select aria-label="Filtrar por situação" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="min-w-0 rounded-lg bg-secondary p-3"><option value="all">Todas as situações</option><option value="pending">Pendentes</option><option value="done">Concluídas</option><option value="overdue">Atrasadas</option></select>
        <select aria-label="Filtrar por matéria" value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })} className="min-w-0 rounded-lg bg-secondary p-3"><option value="">Todas as matérias</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>
        <select aria-label="Filtrar por prioridade" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="min-w-0 rounded-lg bg-secondary p-3"><option value="">Todas as prioridades</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select>
      </div>
      <div className="flex justify-between items-center"><p className="text-sm text-muted-foreground" role="status">{results.length} tarefas encontradas</p><Button variant="ghost" onClick={() => setFilters({ query: "", subjectId: "", priority: "", status: "all" })}>Limpar filtros</Button></div>
      <ul className="space-y-3">{results.map((task) => <TaskItem key={task.id} task={task} subject={subjects.find((subject) => subject.id === task.subjectId)} />)}</ul>
      {!results.length && <p className="py-8 text-center text-muted-foreground">Nenhuma tarefa encontrada.</p>}
    </section>
  </AppShell>;
}