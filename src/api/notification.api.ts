import type { AppNotification, NotificationType } from "../types/notification.types";

const JSONPLACEHOLDER_POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

interface JsonPlaceholderPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

function toNotification(post: JsonPlaceholderPost): AppNotification {
  const types: NotificationType[] = ["task", "review", "mention"];
  const type = types[post.id % types.length];

  return {
    id: post.id,
    title: post.title.replace(/^\w/, (c) => c.toUpperCase()),
    message: post.body,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export async function fetchNotificationPage(start: number): Promise<AppNotification[]> {
  const response = await fetch(
    `${JSONPLACEHOLDER_POSTS_URL}?_limit=5&_start=${start}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const posts = (await response.json()) as JsonPlaceholderPost[];
  return posts.map(toNotification);
}
