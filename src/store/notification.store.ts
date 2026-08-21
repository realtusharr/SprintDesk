import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification } from "../types/notification.types";
import { NOTIFICATIONS_MAX_STORED } from "../utils/constants";

interface NotificationState {
  notifications: AppNotification[];
  panelOpen: boolean;

  mergeIncoming: (incoming: AppNotification[]) => number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setPanelOpen: (open: boolean) => void;
}

function sortByNewest(notifications: AppNotification[]): AppNotification[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      panelOpen: false,

      mergeIncoming: (incoming) => {
        let addedCount = 0;

        set((state) => {
          const knownIds = new Set(state.notifications.map((n) => n.id));
          const fresh = incoming.filter((item) => !knownIds.has(item.id));

          if (fresh.length === 0) return state;

          addedCount = fresh.length;

          const merged = sortByNewest([...fresh, ...state.notifications]).slice(
            0,
            NOTIFICATIONS_MAX_STORED
          );

          return { notifications: merged };
        });

        return addedCount;
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),

      setPanelOpen: (open) => set({ panelOpen: open }),
    }),
    {
      name: "sprintdesk-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
