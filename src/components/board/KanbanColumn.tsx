import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../../types/task.types";
import { cn } from "../../utils/cn";
import TaskCard from "./TaskCard";

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  backlog: "bg-ink-faint",
  "in-progress": "bg-info",
  review: "bg-warning",
  done: "bg-success",
};

export interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  assigneeById: Map<number, { name: string; avatar?: string }>;
  commentCounts: Map<number, number>;
  onOpenTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

function KanbanColumn({
  status,
  title,
  tasks,
  assigneeById,
  commentCounts,
  onOpenTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      aria-label={`${title} column, ${tasks.length} tasks`}
      className="flex min-h-0 flex-col rounded-2xl border border-line bg-sunken/60 p-2.5 transition-colors"
    >
      <header className="flex items-center justify-between px-1.5 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("size-2 rounded-full", COLUMN_ACCENTS[status])}
          />

          <h2 className="text-[13px] font-semibold tracking-tight text-ink">
            {title}
          </h2>

          <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink-muted ring-1 ring-line">
            {tasks.length}
          </span>
        </div>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-xl p-0.5 transition-colors",
            isOver && "bg-brand-soft/40 ring-1 ring-inset ring-brand/30"
          )}
        >
          {tasks.map((task) => {
            const assignee = assigneeById.get(task.assigneeId);

            return (
              <TaskCard
                key={task.id}
                task={task}
                assigneeName={assignee?.name}
                assigneeAvatar={assignee?.avatar}
                commentCount={commentCounts.get(task.id) ?? 0}
                onOpen={onOpenTask}
                onDelete={onDeleteTask}
              />
            );
          })}

          {tasks.length === 0 && (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-line-strong text-xs text-ink-muted">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

export default memo(KanbanColumn);
