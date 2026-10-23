import { Check, Trash2 } from "lucide-react";
import { actions, colorBg, type Subject, type Task } from "@/lib/store";

const prio = { alta: "bg-berry", media: "bg-sun", baixa: "bg-teal" };

export function TaskItem({ task, subject }: { task: Task; subject?: Subject | undefined }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 animate-pop">
      <button aria-label="Concluir tarefa" onClick={() => actions.toggleTask(task.id)}
        className={`btn-pop grid size-10 shrink-0 place-items-center rounded-xl ${task.done ? "bg-teal text-ink-foreground" : "bg-card"}`}>
        {task.done && <Check className="size-5" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold truncate ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`size-2.5 rounded-full ${colorBg[subject?.color ?? "ink"]}`} />
          {subject?.name ?? "Geral"}
          <span className={`ml-1 rounded-full px-2 py-0.5 font-bold text-ink ${prio[task.priority]}`}>{task.priority}</span>
        </div>
      </div>
      <button aria-label="Excluir" onClick={() => actions.removeTask(task.id)} className="p-2 text-muted-foreground hover:text-destructive">
        <Trash2 className="size-5" />
      </button>
    </li>
  );
}
