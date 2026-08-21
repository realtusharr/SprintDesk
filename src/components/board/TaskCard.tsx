import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, MessageSquare, Trash2 } from "lucide-react";
import type { Task } from "../../types/task.types";
import { PRIORITY_LABELS } from "../../utils/constants";
import { formatShortDate, isOverdue } from "../../utils/date";
import Avatar from "../ui/Avatar";
import Badge, { type BadgeTone } from "../ui/Badge";
import { cn } from "../../utils/cn";

const PRIORITY_TONES: Record<Task["priority"], BadgeTone> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export interface TaskCardProps {
  task: Task;
  assigneeName?: string;
  assigneeAvatar?: string;
  commentCount: number;
  onOpen?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export const TaskCardBody = memo(function TaskCardBody({
  task,
  assigneeName,
  assigneeAvatar,
  commentCount,
  onOpen,
  onDelete,
}: TaskCardProps) {
  const overdue = task.status !== "done" && isOverdue(task.dueDate);

  return (
    <div
      className="group/card cursor-grab rounded-xl border border-line bg-surface p-3 shadow-card transition-shadow hover:shadow-pop active:cursor-grabbing"
      onClick={() => onOpen?.(task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.stopPropagation();
          onOpen?.(task.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge tone={PRIORITY_TONES[task.priority]} dot>
          {PRIORITY_LABELS[task.priority]}
        </Badge>

        <span className="flex items-center gap-0.5">
          <GripVertical
            size={14}
            aria-hidden="true"
            className="text-ink-faint opacity-0 transition-opacity group-hover/card:opacity-100"
          />

          {onDelete && (
            <button
              type="button"
              aria-label={`Delete task ${task.title}`}
              className="rounded-md p-1 text-ink-faint opacity-0 transition-all hover:bg-danger-soft hover:text-danger focus-visible:opacity-100 group-hover/card:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-ink">
        {task.title}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {assigneeName && (
            <Avatar name={assigneeName} src={assigneeAvatar} size="sm" />
          )}

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              overdue
                ? "bg-danger-soft text-danger"
                : "bg-sunken text-ink-secondary"
            )}
          >
            <CalendarDays size={11} aria-hidden="true" />
            {formatShortDate(task.dueDate)}
          </span>
        </div>

        {commentCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted">
            <MessageSquare size={11} aria-hidden="true" />
            {commentCount}
          </span>
        )}
      </div>
    </div>
  );
});

function TaskCard(props: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.task.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={cn("touch-none", isDragging && "opacity-40")}
    >
      <TaskCardBody {...props} />
    </div>
  );
}

export default memo(TaskCard);
