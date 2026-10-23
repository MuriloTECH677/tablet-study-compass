import { useState } from "react";
import { Plus } from "lucide-react";
import { actions, today, useStore, type Task } from "@/lib/store";

export function AddTask({ date }: { date?: string }) {
  const { subjects } = useStore();
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("media");
  const [d, setD] = useState(date ?? today());

  return (
    <form className="card-pop flex flex-wrap gap-2 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        actions.addTask({ title: title.trim(), subjectId: subjectId || subjects[0]?.id || "", priority, date: date ?? d });
        setTitle("");
      }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O que você vai estudar?"
        className="min-w-0 flex-[2_1_220px] rounded-xl bg-secondary px-4 py-3 text-base outline-none focus:ring-2 ring-ring" />
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="flex-1 rounded-xl bg-secondary px-3 py-3">
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="rounded-xl bg-secondary px-3 py-3">
        <option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option>
      </select>
      {!date && <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="rounded-xl bg-secondary px-3 py-3" />}
      <button className="btn-pop flex items-center gap-1 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">
        <Plus className="size-5" /> Adicionar
      </button>
    </form>
  );
}
