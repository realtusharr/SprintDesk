import type { AppNotification } from "../types/notification.types";

interface MockData {
  notifications: AppNotification[];
}

export async function getNotifications(): Promise<
  AppNotification[]
> {
  const response = await fetch("/mock-data.json");

  if (!response.ok) {
    throw new Error("Unable to load notifications");
  }

  const data = (await response.json()) as MockData;

  return data.notifications;
}