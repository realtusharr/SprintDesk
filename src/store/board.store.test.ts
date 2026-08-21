import { beforeEach, describe, expect, it } from "vitest";
import { useBoardStore } from "./board.store";
import type { Task } from "../types/task.types";

function makeTask(overrides: Partial<Task> & { id: number }): Task {
  return {
    title: `Task ${overrides.id}`,
    description: "",
    status: "backlog",
    priority: "medium",
    assigneeId: 1,
    dueDate: "2026-08-30",
    sprintId: 1,
    order: overrides.id,
    createdAt: "2026-08-01T00:00:00Z",
    completedAt: null,
    updatedAt: "2026-08-01T00:00:00Z",
    ...overrides,
  };
}

const seedTasks: Task[] = [
  makeTask({ id: 1, status: "backlog", order: 1 }),
  makeTask({ id: 2, status: "backlog", order: 2 }),
  makeTask({ id: 3, status: "in-progress", order: 1 }),
];

function ids(status: string): number[] {
  return useBoardStore
    .getState()
    .tasks.filter((task) => task.status === status)
    .sort((a, b) => a.order - b.order)
    .map((task) => task.id);
}

describe("board store", () => {
  beforeEach(() => {
    useBoardStore.setState({
      tasks: seedTasks.map((task) => ({ ...task })),
      comments: [],
      hydrated: true,
      lastMoveSnapshot: null,
    });
  });

  it("adds a task at the end of its column", () => {
    const created = useBoardStore.getState().addTask({
      title: "New task",
      description: "",
      priority: "high",
      assigneeId: 1,
      dueDate: "2026-09-01",
      sprintId: 1,
      status: "in-progress",
    });

    expect(created.id).toBe(4);

    const state = useBoardStore.getState();
    const column = state.tasks.filter((task) => task.status === "in-progress");

    expect(column).toHaveLength(2);
    expect(created.order).toBe(2);
    expect(created.completedAt).toBeNull();
  });

  it("marks a task completed when added directly to Done", () => {
    const created = useBoardStore.getState().addTask({
      title: "Instantly done",
      description: "",
      priority: "low",
      assigneeId: 1,
      dueDate: "2026-09-01",
      sprintId: 1,
      status: "done",
    });

    expect(created.completedAt).not.toBeNull();
  });

  it("moves a task between columns and reindexes orders", () => {
    useBoardStore.getState().moveTask(1, null, "done");

    const state = useBoardStore.getState();

    expect(ids("backlog")).toEqual([2]);
    expect(ids("done")).toEqual([1]);

    const moved = state.tasks.find((task) => task.id === 1);
    expect(moved?.status).toBe("done");
    expect(moved?.order).toBe(1);
    expect(moved?.completedAt).not.toBeNull();
  });

  it("reorders a task within the same column", () => {
    useBoardStore.getState().moveTask(2, 1, "backlog");

    expect(ids("backlog")).toEqual([2, 1]);
  });

  it("clears completedAt when a done task moves out of Done", () => {
    useBoardStore.getState().moveTask(1, null, "review");

    const moved = useBoardStore
      .getState()
      .tasks.find((task) => task.id === 1);

    expect(moved?.status).toBe("review");
    expect(moved?.completedAt).toBeNull();
  });

  it("undoes the last move", () => {
    useBoardStore.getState().moveTask(1, null, "done");
    useBoardStore.getState().undoLastMove();

    const state = useBoardStore.getState();

    expect(ids("backlog")).toEqual([1, 2]);
    expect(state.lastMoveSnapshot).toBeNull();
  });

  it("updates task fields", () => {
    useBoardStore.getState().updateTask(2, { priority: "high" });

    const updated = useBoardStore
      .getState()
      .tasks.find((task) => task.id === 2);

    expect(updated?.priority).toBe("high");
  });

  it("deletes a task and its comments", () => {
    useBoardStore.setState({
      comments: [
        { id: 1, taskId: 2, authorId: 1, message: "Hello", createdAt: "" },
        { id: 2, taskId: 3, authorId: 1, message: "Keep", createdAt: "" },
      ],
    });

    useBoardStore.getState().deleteTask(2);

    const state = useBoardStore.getState();

    expect(state.tasks.find((task) => task.id === 2)).toBeUndefined();
    expect(state.comments).toHaveLength(1);
    expect(state.comments[0]?.taskId).toBe(3);
  });
});
