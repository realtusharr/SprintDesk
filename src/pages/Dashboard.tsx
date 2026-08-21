import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useBoardStore } from "../store/board.store";
import { useSprints, useUsers } from "../hooks/useTask";
import type { Task } from "../types/task.types";
import { formatDate, formatShortDate, isOverdue, findActiveSprint } from "../utils/date";
import Avatar from "../components/ui/Avatar";
import Badge, { type BadgeTone } from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const STATUS_META: Record<
  Task["status"],
  { label: string; tone: BadgeTone }
> = {
  backlog: { label: "Backlog", tone: "neutral" },
  "in-progress": { label: "In Progress", tone: "info" },
  review: { label: "Review", tone: "warning" },
  done: { label: "Done", tone: "success" },
};

const PRIORITY_TONES: Record<Task["priority"], BadgeTone> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof ListTodo;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-secondary">{label}</p>

        <span
          aria-hidden="true"
          className={`flex size-9 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon size={17} />
        </span>
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-ink">{value}</p>
    </div>
  );
}

function TaskRow({ task, userById }: { task: Task; userById: Map<number, { name: string; avatar?: string }> }) {
  const assignee = userById.get(task.assigneeId);

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-sunken/60">
      <Avatar name={assignee?.name ?? "Unassigned"} src={assignee?.avatar} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink">{task.title}</p>

        <p className="mt-0.5 text-[11px] text-ink-muted">
          {assignee?.name ?? "Unassigned"} · updated{" "}
          {formatShortDate(task.updatedAt)}
        </p>
      </div>

      <Badge tone={PRIORITY_TONES[task.priority]} dot>
        {task.priority}
      </Badge>

      <Badge tone={STATUS_META[task.status].tone}>
        {STATUS_META[task.status].label}
      </Badge>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const tasks = useBoardStore((state) => state.tasks);
  const hydrated = useBoardStore((state) => state.hydrated);
  const { data: sprints = [] } = useSprints();
  const { data: users = [] } = useUsers();

  const userById = useMemo(() => {
    const map = new Map<number, { name: string; avatar?: string }>();

    for (const teamUser of users) {
      map.set(teamUser.id, { name: teamUser.name, avatar: teamUser.avatar });
    }

    return map;
  }, [users]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "done").length,
      overdue: tasks.filter(
        (task) => task.status !== "done" && isOverdue(task.dueDate)
      ).length,
    }),
    [tasks]
  );

  const activeSprint = useMemo(
    () => findActiveSprint(sprints),
    [sprints]
  );

  const sprintProgress = useMemo(() => {
    if (!activeSprint) return null;

    const sprintTasks = tasks.filter(
      (task) => task.sprintId === activeSprint.id
    );

    const completed = sprintTasks.filter(
      (task) => task.status === "done"
    ).length;

    return {
      total: sprintTasks.length,
      completed,
      percent:
        sprintTasks.length === 0
          ? 0
          : Math.round((completed / sprintTasks.length) * 100),
    };
  }, [activeSprint, tasks]);

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5),
    [tasks]
  );

  const upcomingDeadlines = useMemo(
    () =>
      [...tasks]
        .filter((task) => task.status !== "done")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 4),
    [tasks]
  );

  if (!hydrated) {
    return (
      <div className="space-y-4 px-4 py-6 md:px-6">
        <Skeleton className="h-9 w-56" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((card) => (
            <Skeleton key={card} className="h-28 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-44 rounded-2xl" />

        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">
          {user ? `Welcome back, ${user.firstName}` : "Welcome back"}
        </h2>

        <p className="mt-0.5 text-sm text-ink-muted">{today}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={stats.total}
          icon={ListTodo}
          accent="bg-brand-soft text-brand-ink"
        />

        <StatCard
          label="In progress"
          value={stats.inProgress}
          icon={Clock3}
          accent="bg-info-soft text-info"
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          accent="bg-success-soft text-success"
        />

        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={CalendarClock}
          accent="bg-danger-soft text-danger"
        />
      </div>

      {activeSprint && sprintProgress && (
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                <Zap size={18} aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-sm font-semibold tracking-tight text-ink">
                  {activeSprint.name}
                </h3>

                <p className="text-xs text-ink-muted">
                  {formatDate(activeSprint.startDate)} –{" "}
                  {formatDate(activeSprint.endDate)}
                </p>
              </div>
            </div>

            <Badge tone="brand" dot>
              Active now
            </Badge>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between text-xs">
              <span className="text-ink-secondary">
                {sprintProgress.completed} of {sprintProgress.total} tasks
                completed
              </span>

              <span className="font-semibold text-ink">
                {sprintProgress.percent}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={sprintProgress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${activeSprint.name} completion`}
              className="h-2 overflow-hidden rounded-full bg-sunken"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-info transition-all duration-500"
                style={{ width: `${sprintProgress.percent}%` }}
              />
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-line bg-surface shadow-card lg:col-span-3">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-ink">
                Recent activity
              </h3>

              <p className="text-xs text-ink-muted">
                Latest updates across your sprint
              </p>
            </div>

            <Link
              to="/board"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-ink transition-colors hover:bg-brand-soft"
            >
              View board
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </header>

          <div className="divide-y divide-line">
            {recentTasks.map((task) => (
              <TaskRow key={task.id} task={task} userById={userById} />
            ))}

            {recentTasks.length === 0 && (
              <EmptyState
                icon={ListTodo}
                title="No activity yet"
                message="Tasks will appear here as your team works."
                className="m-4"
              />
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface shadow-card lg:col-span-2">
          <header className="border-b border-line px-5 py-4">
            <h3 className="text-sm font-semibold tracking-tight text-ink">
              Due soon
            </h3>

            <p className="text-xs text-ink-muted">Open tasks by due date</p>
          </header>

          <ul className="divide-y divide-line">
            {upcomingDeadlines.map((task) => {
              const overdue = isOverdue(task.dueDate);

              return (
                <li key={task.id}>
                  <Link
                    to="/board"
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-sunken/60"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 shrink-0 rounded-full ${
                        overdue ? "bg-danger" : "bg-warning"
                      }`}
                    />

                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                      {task.title}
                    </span>

                    <span
                      className={`shrink-0 text-[11px] font-medium ${
                        overdue ? "text-danger" : "text-ink-muted"
                      }`}
                    >
                      {formatShortDate(task.dueDate)}
                    </span>

                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-ink-faint"
                    />
                  </Link>
                </li>
              );
            })}

            {upcomingDeadlines.length === 0 && (
              <li className="p-4">
                <EmptyState
                  icon={CheckCircle2}
                  title="All caught up"
                  message="No open deadlines right now."
                />
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
