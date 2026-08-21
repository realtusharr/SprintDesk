import type { Task, TaskComment } from "../types/task.types";
import type { Sprint } from "../types/sprint.types";
import type { User } from "../types/user.types";

export interface MockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: TaskComment[];
  notifications: unknown[];
}

const MOCK_DATA_URL = "/mock-data.json";

export async function getMockData(): Promise<MockData> {
  const response = await fetch(MOCK_DATA_URL);

  if (!response.ok) {
    throw new Error("Failed to load application data");
  }

  return response.json() as Promise<MockData>;
}

export async function getTasks(): Promise<Task[]> {
  const data = await getMockData();
  return data.tasks.slice(0, 30);
}

export async function getUsers(): Promise<User[]> {
  const data = await getMockData();
  return data.users;
}

export async function getSprints(): Promise<Sprint[]> {
  const data = await getMockData();
  return data.sprints;
}

export async function getComments(): Promise<TaskComment[]> {
  const data = await getMockData();
  return data.comments;
}
