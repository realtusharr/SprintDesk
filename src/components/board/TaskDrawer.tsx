import { useMemo, useState } from "react";
import { CalendarDays, Send } from "lucide-react";
import { useBoardStore } from "../../store/board.store";
import { useAuthStore } from "../../store/auth.store";
import type { TaskPriority, TaskStatus } from "../../types/task.types";
import type { User } from "../../types/user.types";
import { PRIORITY_LABELS, TASK_COLUMNS } from "../../utils/constants";
import { formatRelativeTime, formatDate, toDateInputValue } from "../../utils/date";
import { useToast } from "../../hooks/useToast";
import Drawer from "../ui/Drawer";
import Avatar from "../ui/Avatar";
import Badge, { type BadgeTone } from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const PRIORITY_TONES: Record<TaskPriority, BadgeTone> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

interface TaskDrawerProps {
  taskId: number | null;
  onClose: () => void;
  users: User[];
}

export default function TaskDrawer({ taskId, onClose, users }: TaskDrawerProps) {
  const task = useBoardStore((state) =>
    state.tasks.find((item) => item.id === taskId)
  );
  const allComments = useBoardStore((state) => state.comments);
  const comments = useMemo(
    () => allComments.filter((comment) => comment.taskId === taskId),
    [allComments, taskId]
  );
  const updateTask = useBoardStore((state) => state.updateTask);
  const addComment = useBoardStore((state) => state.addComment);
  const user = useAuthStore((state) => state.user);
  const toast = useToast();

  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState("");

  const assignee = useMemo(
    () => users.find((candidate) => candidate.id === task?.assigneeId),
    [users, task]
  );

  if (!task) return null;

  const title = draftTitle ?? task.title;

  function commitTitle() {
    if (draftTitle === null) return;

    const trimmed = draftTitle.trim();

    if (!trimmed) {
      setDraftTitle(null);
      return;
    }

    if (trimmed !== task!.title) {
      updateTask(task!.id, { title: trimmed });
      toast.success("Task updated");
    }

    setDraftTitle(null);
  }

  function commitDescription() {
    const trimmed = draftDescription.trim();

    if (trimmed !== task!.description) {
      updateTask(task!.id, { description: trimmed });
      toast.success("Description updated");
    }

    setEditingDescription(false);
  }

  function submitComment(event: React.FormEvent) {
    event.preventDefault();

    const message = newComment.trim();

    if (!message) return;

    addComment(task!.id, user?.id ?? assignee?.id ?? 1, message);
    setNewComment("");
  }

  return (
    <Drawer open onClose={onClose} title="Task details">
      <div className="space-y-6">
        <div>
          <textarea
            aria-label="Task title"
            value={title}
            rows={2}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={commitTitle}
            className="w-full resize-none rounded-lg border border-transparent bg-transparent p-1.5 -m-1.5 text-base font-semibold leading-snug tracking-tight text-ink transition-colors hover:border-line focus:border-brand focus:bg-surface focus:outline-none"
          />

          <div className="mt-2 flex flex-wrap items-center gap-2 px-0.5">
            <Badge tone={PRIORITY_TONES[task.priority]} dot>
              {PRIORITY_LABELS[task.priority]} priority
            </Badge>

            <span
              className={
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium " +
                (task.status === "done"
                  ? "bg-success-soft text-success"
                  : "bg-sunken text-ink-secondary")
              }
            >
              <CalendarDays size={11} aria-hidden="true" />
              Due {formatDate(task.dueDate)}
            </span>

            {assignee && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sunken py-0.5 pl-0.5 pr-2 text-[11px] font-medium text-ink-secondary">
                <Avatar name={assignee.name} src={assignee.avatar} size="sm" />
                {assignee.name}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={task.status}
            onChange={(event) => {
              updateTask(task.id, { status: event.target.value as TaskStatus });
              toast.success("Task status updated");
            }}
            options={TASK_COLUMNS.map((column) => ({
              label: column.title,
              value: column.id,
            }))}
          />

          <Select
            label="Priority"
            value={task.priority}
            onChange={(event) => {
              updateTask(task.id, { priority: event.target.value as TaskPriority });
            }}
            options={(["high", "medium", "low"] as TaskPriority[]).map((value) => ({
              label: `${PRIORITY_LABELS[value]} priority`,
              value,
            }))}
          />

          <Select
            label="Assignee"
            value={String(task.assigneeId)}
            onChange={(event) => {
              updateTask(task.id, { assigneeId: Number(event.target.value) });
            }}
            options={users.map((candidate) => ({
              label: candidate.name,
              value: String(candidate.id),
            }))}
          />

          <Input
            label="Due date"
            type="date"
            value={toDateInputValue(task.dueDate)}
            onChange={(event) => {
              if (event.target.value) {
                updateTask(task.id, { dueDate: event.target.value });
              }
            }}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink-secondary">Description</p>

            {!editingDescription && (
              <button
                type="button"
                onClick={() => {
                  setDraftDescription(task.description);
                  setEditingDescription(true);
                }}
                className="text-xs font-medium text-brand-ink hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editingDescription ? (
            <div className="space-y-2">
              <Textarea
                aria-label="Edit description"
                value={draftDescription}
                rows={4}
                autoFocus
                onChange={(event) => setDraftDescription(event.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingDescription(false)}
                >
                  Cancel
                </Button>

                <Button size="sm" onClick={commitDescription}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-sunken/70 p-3 text-sm leading-relaxed text-ink-secondary">
              {task.description || "No description provided."}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-secondary">
            Comments{" "}
            <span className="text-ink-muted">({comments.length})</span>
          </p>

          <ul className="space-y-3">
            {comments.map((comment) => {
              const author =
                comment.authorId === user?.id
                  ? {
                      name: user ? `${user.firstName} ${user.lastName}` : "You",
                      avatar: user?.image,
                    }
                  : users.find((candidate) => candidate.id === comment.authorId);

              return (
                <li key={comment.id} className="flex gap-2.5">
                  <Avatar
                    name={author?.name ?? "Unknown"}
                    src={author?.avatar}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm bg-sunken/70 px-3 py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-xs font-semibold text-ink">
                        {author?.name ?? "Unknown"}
                      </p>

                      <p className="shrink-0 text-[10px] text-ink-muted">
                        {formatRelativeTime(comment.createdAt)}
                      </p>
                    </div>

                    <p className="mt-0.5 text-[13px] leading-snug text-ink-secondary">
                      {comment.message}
                    </p>
                  </div>
                </li>
              );
            })}

            {comments.length === 0 && (
              <li className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-ink-muted">
                No comments yet — start the discussion.
              </li>
            )}
          </ul>

          <form onSubmit={submitComment} className="mt-3 flex items-end gap-2">
            <Textarea
              aria-label="Add a comment"
              placeholder="Add a comment…"
              value={newComment}
              rows={1}
              onChange={(event) => setNewComment(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submitComment(event);
                }
              }}
            />

            <Button
              type="submit"
              size="md"
              aria-label="Send comment"
              disabled={!newComment.trim()}
              className="shrink-0 !px-3"
            >
              <Send size={15} aria-hidden="true" />
            </Button>
          </form>
        </div>

        <p className="text-[11px] text-ink-faint">
          Created {formatDate(task.createdAt)} · Updated{" "}
          {formatRelativeTime(task.updatedAt)}
        </p>
      </div>
    </Drawer>
  );
}
