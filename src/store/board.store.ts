import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskComment, TaskPriority, TaskStatus } from "../types/task.types";
import { TASK_COLUMNS } from "../utils/constants";

export interface NewTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  status: TaskStatus;
}

export type TaskUpdates = Partial<
  Pick<
    Task,
    "title" | "description" | "priority" | "assigneeId" | "dueDate" | "status" | "sprintId"
  >
>;

interface BoardState {
  tasks: Task[];
  comments: TaskComment[];
  hydrated: boolean;
  lastMoveSnapshot: Task[] | null;

  hydrateBoard: (tasks: Task[], comments: TaskComment[]) => void;
  addTask: (input: NewTaskInput) => Task;
  updateTask: (taskId: number, updates: TaskUpdates) => void;
  deleteTask: (taskId: number) => void;
  moveTask: (activeId: number, overId: number | null, targetStatus: TaskStatus) => void;
  undoLastMove: () => void;
  addComment: (taskId: number, authorId: number, message: string) => void;
}

function nowISO(): string {
  return new Date().toISOString();
}

function orderedColumn(tasks: Task[], status: TaskStatus): Task[] {
  return tasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.order - b.order);
}

function resolveCompletedAt(
  current: string | null,
  nextStatus: TaskStatus
): string | null {
  if (nextStatus === "done") return current ?? nowISO();
  return null;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      comments: [],
      hydrated: false,
      lastMoveSnapshot: null,

      hydrateBoard: (tasks, comments) => {
        if (get().hydrated) return;

        const normalized = TASK_COLUMNS.flatMap((column) =>
          orderedColumn(tasks, column.id).map((task, index) => ({
            ...task,
            order: index + 1,
          }))
        );

        set({ tasks: normalized, comments, hydrated: true });
      },

      addTask: (input) => {
        const timestamp = nowISO();
        const column = orderedColumn(get().tasks, input.status);
        const nextId =
          get().tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

        const task: Task = {
          ...input,
          id: nextId,
          order: column.length + 1,
          createdAt: timestamp,
          completedAt: input.status === "done" ? timestamp : null,
          updatedAt: timestamp,
        };

        set((state) => ({ tasks: [...state.tasks, task] }));

        return task;
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            const status = updates.status ?? task.status;

            return {
              ...task,
              ...updates,
              completedAt: resolveCompletedAt(task.completedAt, status),
              updatedAt: nowISO(),
            };
          }),
        }));
      },

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          comments: state.comments.filter((comment) => comment.taskId !== taskId),
        })),

      moveTask: (activeId, overId, targetStatus) => {
        const previous = get().tasks;
        const active = previous.find((task) => task.id === activeId);

        if (!active) return;

        const sameColumn = active.status === targetStatus;

        if (sameColumn && overId === null) return;

        const sourceColumn = orderedColumn(previous, active.status);
        const remainingSource = sourceColumn.filter(
          (task) => task.id !== activeId
        );

        const insertionBase = sameColumn
          ? remainingSource
          : orderedColumn(previous, targetStatus);

        let insertIndex = insertionBase.length;

        if (overId !== null && overId !== activeId) {
          const overIndex = insertionBase.findIndex(
            (task) => task.id === overId
          );

          if (overIndex >= 0) insertIndex = overIndex;
        }

        const moved: Task = {
          ...active,
          status: targetStatus,
          completedAt: resolveCompletedAt(active.completedAt, targetStatus),
          updatedAt: nowISO(),
        };

        const nextTarget = [...insertionBase];
        nextTarget.splice(insertIndex, 0, moved);

        const reindex = (column: Task[]): Task[] =>
          column.map((task, index) => ({ ...task, order: index + 1 }));

        set({
          lastMoveSnapshot: previous,
          tasks: [
            ...previous.filter(
              (task) =>
                task.status !== active.status &&
                task.status !== targetStatus &&
                task.id !== activeId
            ),
            ...(sameColumn ? [] : reindex(remainingSource)),
            ...reindex(nextTarget),
          ],
        });
      },

      undoLastMove: () => {
        const snapshot = get().lastMoveSnapshot;

        if (!snapshot) return;

        set({ tasks: snapshot, lastMoveSnapshot: null });
      },

      addComment: (taskId, authorId, message) => {
        const comment: TaskComment = {
          id:
            get().comments.reduce((max, item) => Math.max(max, item.id), 0) + 1,
          taskId,
          authorId,
          message,
          createdAt: nowISO(),
        };

        set((state) => ({ comments: [...state.comments, comment] }));
      },
    }),
    {
      name: "sprintdesk-board",
      version: 1,
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
        hydrated: state.hydrated,
      }),
    }
  )
);
