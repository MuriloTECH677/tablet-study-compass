import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actions, useStore, type Task } from "@/lib/store";

export function TaskEditor({ task, onClose }: { task: Task; onClose: () => void }) {
  const { subjects } = useStore();
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date);
  const [subjectId, setSubjectId] = useState(task.subjectId);
  const [priority, setPriority] = useState(task.priority);
  return <form className="w-full space-y-3 border-t border-border pt-3" onSubmit={(event) => {
    event.preventDefault();
    if (!title.trim() || !date) return;
    actions.updateTask(task.id, { title: title.trim(), date, subjectId, priority });
    onClose();
  }}>
    <label className="block text-sm font-semibold">Título<input required aria-label="Título da tarefa" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg bg-secondary px-3 py-3" /></label>
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="text-sm font-semibold">Data<input required aria-label="Data da tarefa" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full min-w-0 rounded-lg bg-secondary p-3" /></label>
      <label className="text-sm font-semibold">Matéria<select aria-label="Matéria da tarefa" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 w-full rounded-lg bg-secondary p-3"><option value="">Geral</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Prioridade<select aria-label="Prioridade da tarefa" value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="mt-1 w-full rounded-lg bg-secondary p-3"><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select></label>
    </div>
    <div className="flex gap-2"><Button type="submit" className="h-11"><Save />Salvar</Button><Button type="button" variant="ghost" className="h-11" onClick={onClose}>Cancelar</Button></div>
  </form>;
}