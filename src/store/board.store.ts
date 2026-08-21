import { create } from "zustand";
import type { Task, TaskStatus } from "../types/task.types";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (
    taskId: number,
    updates: Partial<Task>
  ) => void;

  deleteTask: (taskId: number) => void;

  moveTask: (
    taskId: number,
    status: TaskStatus
  ) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  tasks: [],

  setTasks: (tasks) =>
    set({
      tasks,
    }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter(
        (task) => task.id !== taskId
      ),
    })),

  moveTask: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              updatedAt: new Date().toISOString(),
            }
          : task
      ),
    })),
}));