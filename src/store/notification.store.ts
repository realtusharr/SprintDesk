import { create } from "zustand";
import type { AppNotification } from "../types/notification.types";

interface NotificationState {
  notifications: AppNotification[];

  setNotifications: (
    notifications: AppNotification[]
  ) => void;

  markAsRead: (id: number) => void;

  markAllAsRead: () => void;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    notifications: [],

    setNotifications: (notifications) =>
      set({
        notifications,
      }),

    markAsRead: (id) =>
      set((state) => ({
        notifications:
          state.notifications.map((notification) =>
            notification.id === id
              ? {
                  ...notification,
                  read: true,
                }
              : notification
          ),
      })),

    markAllAsRead: () =>
      set((state) => ({
        notifications:
          state.notifications.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          ),
      })),
  }));