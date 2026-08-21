import {
  ArrowRight,
  User,
} from "lucide-react";

import type { Task, TaskStatus } from "./KanbanBoard";

interface TaskCardProps {
  task: Task;
  currentStatus: TaskStatus;
  onMoveTask: (
    taskId: number,
    status: TaskStatus
  ) => void;
}

const nextStatus: Record<
  TaskStatus,
  TaskStatus | null
> = {
  todo: "progress",
  progress: "review",
  review: "done",
  done: null,
};

const priorityClass = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function TaskCard({
  task,
  currentStatus,
  onMoveTask,
}: TaskCardProps) {
  const next = nextStatus[currentStatus];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-800">
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${priorityClass[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="mb-4 text-xs leading-5 text-slate-500">
        {task.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
            {task.assignee}
          </div>

          <User size={13} className="text-slate-400" />
        </div>

        {next && (
          <button
            type="button"
            onClick={() => onMoveTask(task.id, next)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
          >
            Move
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}