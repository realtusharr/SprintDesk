import type { Task, TaskPriority, TaskStatus } from "../types/task.types";
import type { Sprint } from "../types/sprint.types";
import { TASK_COLUMNS } from "./constants";

export interface VelocityPoint {
  sprint: string;
  completed: number;
  total: number;
}

export interface StatusSlice {
  status: TaskStatus;
  label: string;
  count: number;
}

export interface PriorityBreakdownPoint {
  column: string;
  low: number;
  medium: number;
  high: number;
}

export interface TrendPoint {
  date: string;
  completed: number;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function getVelocity(tasks: Task[], sprints: Sprint[]): VelocityPoint[] {
  return sprints.map((sprint) => {
    const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);

    return {
      sprint: sprint.name,
      completed: sprintTasks.filter((task) => task.status === "done").length,
      total: sprintTasks.length,
    };
  });
}

export function getStatusDistribution(tasks: Task[]): StatusSlice[] {
  return TASK_COLUMNS.map((column) => ({
    status: column.id,
    label: column.title,
    count: tasks.filter((task) => task.status === column.id).length,
  }));
}

export function getPriorityBreakdown(tasks: Task[]): PriorityBreakdownPoint[] {
  return TASK_COLUMNS.map((column) => {
    const columnTasks = tasks.filter((task) => task.status === column.id);

    return {
      column: column.title,
      low: columnTasks.filter((task) => task.priority === "low").length,
      medium: columnTasks.filter((task) => task.priority === "medium").length,
      high: columnTasks.filter((task) => task.priority === "high").length,
    };
  });
}

export function getCompletionTrend(tasks: Task[]): TrendPoint[] {
  const completed = tasks
    .filter((task) => task.completedAt)
    .map((task) => task.completedAt!.slice(0, 10))
    .sort();

  if (completed.length === 0) return [];

  const counts = new Map<string, number>();

  for (const day of completed) {
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const days = [...counts.keys()].sort();
  const first = new Date(days[0]);
  const last = new Date(days[days.length - 1]);
  const points: TrendPoint[] = [];
  let cumulative = 0;

  for (let cursor = new Date(first); cursor <= last; cursor.setDate(cursor.getDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10);
    cumulative += counts.get(key) ?? 0;
    points.push({ date: key, completed: cumulative });
  }

  return points;
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}
