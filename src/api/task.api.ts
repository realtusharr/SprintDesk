import type { Task } from "../types/task.types";
import type { Sprint } from "../types/sprint.types";
import type { User } from "../types/user.types";

interface MockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
}

export async function getMockData(): Promise<MockData> {
  const response = await fetch("/mock-data.json");

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