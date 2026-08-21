import type { TaskStatus } from "../types/task.types";

export const TASK_COLUMNS: {
  id: TaskStatus;
  title: string;
}[] = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
] as const;