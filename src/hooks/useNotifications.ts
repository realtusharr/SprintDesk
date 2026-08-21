import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotificationPage } from "../api/notification.api";
import { getMockData } from "../api/task.api";
import { useNotificationStore } from "../store/notification.store";
import { useToastStore } from "../store/toast.store";
import type { AppNotification } from "../types/notification.types";

const POLL_INTERVAL_MS = 15_000;
const PAGE_SIZE = 5;
const MAX_START = 95;

async function getSeedNotifications(): Promise<AppNotification[]> {
  const data = await getMockData();
  return data.notifications as AppNotification[];
}

export function useNotifications() {
  const mergeIncoming = useNotificationStore((state) => state.mergeIncoming);
  const panelOpen = useNotificationStore((state) => state.panelOpen);
  const addToast = useToastStore((state) => state.addToast);
  const cursorRef = useRef(0);

  const seedQuery = useQuery({
    queryKey: ["notification-seed"],
    queryFn: getSeedNotifications,
    staleTime: Infinity,
  });

  const pollQuery = useQuery({
    queryKey: ["notification-poll"],
    queryFn: () => {
      const start = cursorRef.current;
      cursorRef.current = (start + PAGE_SIZE) % (MAX_START + PAGE_SIZE);
      return fetchNotificationPage(start);
    },
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (seedQuery.data) {
      mergeIncoming(seedQuery.data);
    }
  }, [seedQuery.data, mergeIncoming]);

  useEffect(() => {
    if (!pollQuery.data) return;

    const addedCount = mergeIncoming(pollQuery.data);

    if (addedCount > 0 && !panelOpen) {
      addToast(
        addedCount === 1
          ? "You have 1 new notification"
          : `You have ${addedCount} new notifications`,
        "info"
      );
    }
  }, [pollQuery.data, mergeIncoming, panelOpen, addToast]);

  return pollQuery;
}
