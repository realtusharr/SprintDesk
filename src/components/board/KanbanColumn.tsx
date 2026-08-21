import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "./KanbanBoard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onMoveTask: (
    taskId: number,
    status: TaskStatus
  ) => void;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  onMoveTask,
}: KanbanColumnProps) {
  return (
    <div className="min-h-[500px] rounded-xl bg-slate-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">
          {title}
        </h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentStatus={status}
            onMoveTask={onMoveTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}