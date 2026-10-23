import { useSyncExternalStore } from "react";

export type Subject = { id: string; name: string; color: string; goal: number };
export type Task = { id: string; title: string; subjectId: string; date: string; done: boolean; priority: "alta" | "media" | "baixa" };
export type State = { subjects: Subject[]; tasks: Task[]; focus: Record<string, number> };

export const COLORS = ["primary", "teal", "sun", "berry", "sky", "ink"] as const;
export const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

const KEY = "foco-planner-v1";
const seed = (): State => ({
  subjects: [
    { id: "mat", name: "Matemática", color: "primary", goal: 5 },
    { id: "por", name: "Português", color: "teal", goal: 4 },
    { id: "bio", name: "Biologia", color: "berry", goal: 3 },
    { id: "his", name: "História", color: "sky", goal: 3 },
  ],
  tasks: [
    { id: uid(), title: "Lista de exercícios: funções", subjectId: "mat", date: today(), done: false, priority: "alta" },
    { id: uid(), title: "Ler capítulo 4 — Romantismo", subjectId: "por", date: today(), done: false, priority: "media" },
    { id: uid(), title: "Resumo de citologia", subjectId: "bio", date: today(), done: true, priority: "baixa" },
  ],
  focus: {},
});

let state: State = seed();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}
function set(fn: (s: State) => State) {
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

const serverSnap = seed();
export function useStore() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => serverSnap,
  );
}

export const actions = {
  addTask: (t: Omit<Task, "id" | "done">) => set((s) => ({ ...s, tasks: [...s.tasks, { ...t, id: uid(), done: false }] })),
  toggleTask: (id: string) => set((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
  removeTask: (id: string) => set((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
  addSubject: (name: string, color: string, goal: number) => set((s) => ({ ...s, subjects: [...s.subjects, { id: uid(), name, color, goal }] })),
  removeSubject: (id: string) => set((s) => ({ ...s, subjects: s.subjects.filter((x) => x.id !== id), tasks: s.tasks.filter((t) => t.subjectId !== id) })),
  addFocus: (minutes: number) => set((s) => ({ ...s, focus: { ...s.focus, [today()]: (s.focus[today()] ?? 0) + minutes } })),
};

export const colorBg: Record<string, string> = { primary: "bg-primary", teal: "bg-teal", sun: "bg-sun", berry: "bg-berry", sky: "bg-sky", ink: "bg-ink" };
