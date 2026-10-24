import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, CalendarDays, LayoutDashboard, Timer, ListChecks } from "lucide-react";

const nav = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/materias", label: "Matérias", icon: BookOpen },
  { to: "/foco", label: "Foco", icon: Timer },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex md:w-24 lg:w-60 flex-col items-center lg:items-stretch gap-3 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-6 lg:px-2">
          <img src="/icon-192.png" alt="" width={44} height={44} className="rounded-xl border-2 border-ink" />
          <span className="hidden lg:block font-display text-2xl font-extrabold">Foco</span>
        </div>
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-muted-foreground transition hover:bg-secondary"
            activeProps={{ className: "btn-pop !bg-primary !text-primary-foreground" }}>
            <Icon className="size-6 shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </Link>
        ))}
      </aside>
      <main className="flex-1 min-w-0 px-5 pt-6 pb-28 md:px-8 md:pb-10 max-w-6xl">
        <header className="mb-6 animate-pop">
          <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-1 text-muted-foreground text-lg">{subtitle}</p>}
        </header>
        {children}
      </main>
      <nav className="md:hidden fixed bottom-3 inset-x-3 card-pop flex justify-around p-2 z-50">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex flex-1 min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-xs font-semibold text-muted-foreground"
            activeProps={{ className: "!bg-primary !text-primary-foreground" }}>
            <Icon className="size-6" />{label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
