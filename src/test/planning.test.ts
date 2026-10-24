import { describe, expect, it } from "vitest";
import { filterTasks, shiftDate, weeklyTasks } from "@/lib/planning";
import type { Task } from "@/lib/store";

const task = (id: string, date: string, done = false): Task => ({ id, date, done, title: "Revisão de funções", subjectId: "mat", priority: "alta" });
describe("Study planning", () => {
  it("limits weekly progress to Monday through Sunday", () => {
    const tasks = [task("old", "2026-10-18", true), task("mon", "2026-10-19", true), task("sun", "2026-10-25", true), task("next", "2026-10-26", true)];
    expect(weeklyTasks(tasks, new Date("2026-10-24T12:00:00")).map((t) => t.id)).toEqual(["mon", "sun"]);
  });
  it("only counts unfinished past tasks as overdue", () => {
    const tasks = [task("late", "2026-10-23"), task("done", "2026-10-23", true), task("today", "2026-10-24")];
    expect(filterTasks(tasks, { query: "", subjectId: "", priority: "", status: "overdue" }, "2026-10-24").map((t) => t.id)).toEqual(["late"]);
  });
  it("combines title, subject, priority and completion filters", () => {
    const tasks = [task("match", "2026-10-24", true), { ...task("other", "2026-10-24", true), subjectId: "bio" }];
    expect(filterTasks(tasks, { query: "revisao", subjectId: "mat", priority: "alta", status: "done" }, "2026-10-24").map((t) => t.id)).toEqual(["match"]);
  });
  it("calculates review dates across month boundaries", () => {
    expect(shiftDate("2026-10-28", 7)).toBe("2026-11-04");
  });
});