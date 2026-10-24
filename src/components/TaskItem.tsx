import { useState } from "react";
import { Check, Trash2, Pencil, Copy, RotateCcw } from "lucide-react";
import { actions, colorBg, type Subject, type Task } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { TaskEditor } from "@/components/TaskEditor";
import { shiftDate } from "@/lib/planning";

const prio = { alta: "bg-berry", media: "bg-sun", baixa: "bg-teal" };

export function TaskItem({ task, subject }: { task: Task; subject?: Subject | undefined }) {
  const [editing, setEditing] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewDate, setReviewDate] = useState(shiftDate(task.date, 7));
  const [notice, setNotice] = useState("");
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 animate-pop">
      <Button variant="outline" aria-label={task.done ? "Reabrir tarefa" : "Concluir tarefa"} aria-pressed={task.done} onClick={() => actions.toggleTask(task.id)}
        className={`btn-pop grid size-11 shrink-0 place-items-center rounded-xl ${task.done ? "bg-teal text-ink-foreground" : "bg-card"}`}>
        {task.done && <Check className="size-5" strokeWidth={3} />}
      </Button>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold break-words ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className={`size-2.5 rounded-full ${colorBg[subject?.color ?? "ink"]}`} />
          {subject?.name ?? "Geral"}
          <span className={`ml-1 rounded-full px-2 py-0.5 font-bold text-ink ${prio[task.priority]}`}>{task.priority}</span>
          <span>{new Date(task.date + "T12:00").toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
      <div className="flex w-full sm:w-auto justify-end gap-1 ml-auto">
      <Button variant="ghost" size="icon" className="size-11" title="Editar ou reagendar" aria-label="Editar ou reagendar" onClick={() => { setEditing(!editing); setReviewing(false); }}><Pencil /></Button>
      <Button variant="ghost" size="icon" className="size-11" title="Duplicar tarefa" aria-label="Duplicar tarefa" onClick={() => { actions.addTask({ title: task.title, subjectId: task.subjectId, date: task.date, priority: task.priority }); setNotice("Tarefa duplicada."); }}><Copy /></Button>
      <Button variant="ghost" size="icon" className="size-11" title="Agendar revisão" aria-label="Agendar revisão" onClick={() => { setReviewing(!reviewing); setEditing(false); }}><RotateCcw /></Button>
      <Button variant="ghost" size="icon" aria-label="Excluir" title="Excluir" onClick={() => actions.removeTask(task.id)} className="size-11 text-muted-foreground hover:text-destructive">
        <Trash2 className="size-5" />
      </Button>
      </div>
      {editing && <TaskEditor task={task} onClose={() => setEditing(false)} />}
      {reviewing && <form className="w-full flex flex-wrap items-end gap-3 border-t border-border pt-3" onSubmit={(e) => { e.preventDefault(); if (!reviewDate) return; actions.addTask({ title: `Revisão: ${task.title}`, subjectId: task.subjectId, priority: task.priority, date: reviewDate }); setReviewing(false); setNotice("Revisão agendada."); }}><label className="text-sm font-semibold">Data da revisão<input required aria-label="Data da revisão" type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} className="block mt-1 rounded-lg bg-secondary p-3" /></label><Button className="h-11" type="submit">Agendar revisão</Button><Button variant="ghost" type="button" onClick={() => setReviewing(false)}>Cancelar</Button></form>}
      {notice && <p role="status" className="w-full text-sm text-muted-foreground">{notice}</p>}
    </li>
  );
}
