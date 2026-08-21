import { useState } from "react";
import type { TaskPriority, TaskStatus } from "../../types/task.types";
import type { Sprint } from "../../types/sprint.types";
import type { User } from "../../types/user.types";
import { PRIORITY_LABELS, TASK_COLUMNS } from "../../utils/constants";
import { todayInputValue } from "../../utils/date";
import { useBoardStore } from "../../store/board.store";
import { useToast } from "../../hooks/useToast";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
  users: User[];
  sprints: Sprint[];
}

export default function CreateTaskModal({
  open,
  onClose,
  defaultStatus,
  users,
  sprints,
}: CreateTaskModalProps) {
  const addTask = useBoardStore((state) => state.addTask);
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState(() =>
    String(users[0]?.id ?? "")
  );
  const [dueDate, setDueDate] = useState(todayInputValue);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus ?? "backlog");
  const [sprintId, setSprintId] = useState(() =>
    String(sprints[sprints.length - 1]?.id ?? "")
  );
  const [titleError, setTitleError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      assigneeId: Number(assigneeId),
      dueDate,
      status,
      sprintId: Number(sprintId),
    });

    toast.success("Task created");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create task"
      description="Add a new task to the sprint board."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (event.target.value.trim()) setTitleError("");
          }}
          placeholder="e.g. Implement login flow"
          error={titleError}
          required
          autoFocus
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add context, acceptance criteria or links…"
          rows={3}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            options={TASK_COLUMNS.map((column) => ({
              label: column.title,
              value: column.id,
            }))}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            options={(["high", "medium", "low"] as TaskPriority[]).map(
              (value) => ({ label: PRIORITY_LABELS[value], value })
            )}
          />

          <Select
            label="Assignee"
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            options={users.map((user) => ({
              label: user.name,
              value: String(user.id),
            }))}
          />

          <Input
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />

          <Select
            label="Sprint"
            value={sprintId}
            onChange={(event) => setSprintId(event.target.value)}
            options={sprints.map((sprint) => ({
              label: sprint.name,
              value: String(sprint.id),
            }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Create task</Button>
        </div>
      </form>
    </Modal>
  );
}
