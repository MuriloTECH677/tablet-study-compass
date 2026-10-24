import { addDays, format, startOfWeek, endOfWeek } from "date-fns";
import type { Task } from "./store";

export const dateKey = (date: Date) => format(date, "yyyy-MM-dd");
export const shiftDate = (date: string, days: number) => dateKey(addDays(new Date(`${date}T12:00:00`), days));
export function weeklyTasks(tasks: Task[], now = new Date()) {
  const start = dateKey(startOfWeek(now, { weekStartsOn: 1 }));
  const end = dateKey(endOfWeek(now, { weekStartsOn: 1 }));
  return tasks.filter((task) => task.date >= start && task.date <= end);
}
export type TaskFilters = { query: string; subjectId: string; priority: string; status: string };
export function filterTasks(tasks: Task[], filters: TaskFilters, date: string) {
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return tasks.filter((task) =>
    normalize(task.title).includes(normalize(filters.query.trim())) &&
    (!filters.subjectId || task.subjectId === filters.subjectId) &&
    (!filters.priority || task.priority === filters.priority) &&
    (filters.status === "all" || (filters.status === "done" ? task.done : filters.status === "overdue" ? !task.done && task.date < date : !task.done))
  ).sort((a, b) => a.date.localeCompare(b.date));
}