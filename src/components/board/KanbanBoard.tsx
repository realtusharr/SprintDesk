import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Filter, Plus, Undo2 } from "lucide-react";
import type { TaskPriority, TaskStatus } from "../../types/task.types";
import { TASK_COLUMNS, PRIORITY_LABELS } from "../../utils/constants";
import { useBoardStore } from "../../store/board.store";
import { useUsers, useSprints } from "../../hooks/useTask";
import { useToast } from "../../hooks/useToast";
import Button from "../ui/Button";
import Select from "../ui/Select";
import KanbanColumn from "./KanbanColumn";
import { TaskCardBody } from "./TaskCard";
import TaskDrawer from "./TaskDrawer";
import CreateTaskModal from "./CreateTaskModal";
import ConfirmDialog from "../ui/ConfirmDialog";

interface BoardFilters {
  priority: TaskPriority | "all";
  assignee: string;
}

export default function KanbanBoard() {
  const tasks = useBoardStore((state) => state.tasks);
  const comments = useBoardStore((state) => state.comments);
  const moveTask = useBoardStore((state) => state.moveTask);
  const undoLastMove = useBoardStore((state) => state.undoLastMove);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const hasLastMove = useBoardStore(
    (state) => state.lastMoveSnapshot !== null
  );

  const { data: users = [] } = useUsers();
  const { data: sprints = [] } = useSprints();
  const toast = useToast();

  const [filters, setFilters] = useState<BoardFilters>({
    priority: "all",
    assignee: "all",
  });
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [drawerTaskId, setDrawerTaskId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<TaskStatus | undefined>();
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const assigneeById = useMemo(() => {
    const map = new Map<number, { name: string; avatar?: string }>();

    for (const user of users) {
      map.set(user.id, { name: user.name, avatar: user.avatar });
    }

    return map;
  }, [users]);

  const commentCounts = useMemo(() => {
    const map = new Map<number, number>();

    for (const comment of comments) {
      map.set(comment.taskId, (map.get(comment.taskId) ?? 0) + 1);
    }

    return map;
  }, [comments]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (filters.priority === "all" || task.priority === filters.priority) &&
        (filters.assignee === "all" ||
          String(task.assigneeId) === filters.assignee)
    );
  }, [tasks, filters]);

  const columns = useMemo(() => {
    return TASK_COLUMNS.map((column) => ({
      ...column,
      tasks: filteredTasks
        .filter((task) => task.status === column.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [filteredTasks]);

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;

  const findColumnByTaskId = useCallback(
    (taskId: number): TaskStatus | null =>
      tasks.find((task) => task.id === taskId)?.status ?? null,
    [tasks]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(Number(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overIdRaw = over.id;

    const sourceStatus = findColumnByTaskId(activeId);

    if (!sourceStatus) return;

    const isOverColumn = TASK_COLUMNS.some((column) => column.id === overIdRaw);

    if (isOverColumn) {
      const targetStatus = overIdRaw as TaskStatus;

      if (targetStatus !== sourceStatus) {
        moveTask(activeId, null, targetStatus);
      }

      return;
    }

    const overTaskId = Number(overIdRaw);

    const targetStatus = findColumnByTaskId(overTaskId);

    if (!targetStatus) return;

    moveTask(activeId, overTaskId === activeId ? null : overTaskId, targetStatus);
  }

  function handleUndo() {
    undoLastMove();
    toast.info("Last move undone");
  }

  function confirmDelete() {
    if (deleteCandidateId === null) return;

    deleteTask(deleteCandidateId);
    setDrawerTaskId((current) =>
      current === deleteCandidateId ? null : current
    );
    setDeleteCandidateId(null);
    toast.success("Task deleted");
  }

  function openCreateForm(status?: TaskStatus) {
    setFormStatus(status);
    setFormOpen(true);
  }

  const deleteCandidate = tasks.find((task) => task.id === deleteCandidateId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Filter size={15} aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Filters
          </span>
        </div>

        <div className="w-36">
          <Select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                priority: event.target.value as TaskPriority | "all",
              }))
            }
            options={[
              { label: "All priorities", value: "all" },
              ...(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map(
                (value) => ({ label: PRIORITY_LABELS[value], value })
              ),
            ]}
          />
        </div>

        <div className="w-40">
          <Select
            aria-label="Filter by assignee"
            value={filters.assignee}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                assignee: event.target.value,
              }))
            }
            options={[
              { label: "All assignees", value: "all" },
              ...users.map((user) => ({
                label: user.name,
                value: String(user.id),
              })),
            ]}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleUndo}
            disabled={!hasLastMove}
          >
            <Undo2 size={15} aria-hidden="true" />
            Undo move
          </Button>

          <Button onClick={() => openCreateForm()}>
            <Plus size={15} aria-hidden="true" />
            New task
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTaskId(null)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-h-0 xl:flex-1 xl:grid-cols-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              status={column.id}
              title={column.title}
              tasks={column.tasks}
              assigneeById={assigneeById}
              commentCounts={commentCounts}
              onOpenTask={setDrawerTaskId}
              onDeleteTask={setDeleteCandidateId}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask && (
              <div className="w-72 rotate-1 opacity-95">
                <TaskCardBody
                  task={activeTask}
                  assigneeName={assigneeById.get(activeTask.assigneeId)?.name}
                  commentCount={commentCounts.get(activeTask.id) ?? 0}
                />
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <TaskDrawer
        taskId={drawerTaskId}
        onClose={() => setDrawerTaskId(null)}
        users={users}
      />

      <CreateTaskModal
        key={formOpen ? "form-open" : "form-closed"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setFormStatus(undefined);
        }}
        defaultStatus={formStatus}
        users={users}
        sprints={sprints}
      />

      <ConfirmDialog
        open={deleteCandidateId !== null}
        title="Delete task"
        message={`Are you sure you want to delete "${
          deleteCandidate?.title ?? "this task"
        }"? This action cannot be undone.`}
        loading={false}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
}
