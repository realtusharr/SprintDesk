import { useState } from "react";
import KanbanColumn from "./KanbanColumn";

export type TaskStatus = "todo" | "progress" | "review" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: TaskStatus;
  assignee: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design login page",
    description: "Create responsive login UI.",
    priority: "High",
    status: "todo",
    assignee: "TD",
  },
  {
    id: 2,
    title: "Authentication API",
    description: "Implement login authentication.",
    priority: "High",
    status: "progress",
    assignee: "AS",
  },
  {
    id: 3,
    title: "Dashboard UI",
    description: "Build SprintDesk dashboard.",
    priority: "Medium",
    status: "review",
    assignee: "RK",
  },
  {
    id: 4,
    title: "Setup project",
    description: "Configure React and TypeScript.",
    priority: "Low",
    status: "done",
    assignee: "TD",
  },
];

const columns = [
  { id: "todo" as TaskStatus, title: "To Do" },
  { id: "progress" as TaskStatus, title: "In Progress" },
  { id: "review" as TaskStatus, title: "Review" },
  { id: "done" as TaskStatus, title: "Done" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const moveTask = (
    taskId: number,
    status: TaskStatus
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status }
          : task
      )
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          status={column.id}
          tasks={tasks.filter(
            (task) => task.status === column.id
          )}
          onMoveTask={moveTask}
        />
      ))}
    </div>
  );
}