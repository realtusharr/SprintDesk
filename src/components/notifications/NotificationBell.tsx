import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotificationStore } from "../../store/notification.store";
import { useNotifications } from "../../hooks/useNotifications";
import { NOTIFICATIONS_PAGE_SIZE } from "../../utils/constants";
import { formatRelativeTime } from "../../utils/date";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import EmptyState from "../ui/EmptyState";

const TYPE_STYLES = {
  task: "bg-info-soft text-info",
  review: "bg-warning-soft text-warning",
  mention: "bg-brand-soft text-brand-ink",
} as const;

function NotificationRow({ id }: { id: number }) {
  const notification = useNotificationStore((state) =>
    state.notifications.find((item) => item.id === id)
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  if (!notification) return null;

  return (
    <li>
      <button
        type="button"
        onClick={() => markAsRead(notification.id)}
        className={cn(
          "flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-sunken",
          !notification.read && "bg-brand-soft/50"
        )}
        aria-label={
          notification.read
            ? notification.title
            : `Mark "${notification.title}" as read`
        }
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            notification.read ? "bg-transparent" : "bg-brand"
          )}
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-ink">
              {notification.title}
            </span>

            <span className="shrink-0 text-[11px] text-ink-muted">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </span>

          <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-ink-secondary">
            {notification.message}
          </span>

          <span
            className={cn(
              "mt-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
              TYPE_STYLES[notification.type]
            )}
          >
            {notification.type}
          </span>
        </span>
      </button>
    </li>
  );
}

export default function NotificationBell() {
  useNotifications();

  const notifications = useNotificationStore((state) => state.notifications);
  const panelOpen = useNotificationStore((state) => state.panelOpen);
  const setPanelOpen = useNotificationStore((state) => state.setPanelOpen);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const pageCount = Math.max(
    1,
    Math.ceil(notifications.length / NOTIFICATIONS_PAGE_SIZE)
  );

  const visibleIds = useMemo(
    () =>
      notifications
        .slice((page - 1) * NOTIFICATIONS_PAGE_SIZE, page * NOTIFICATIONS_PAGE_SIZE)
        .map((notification) => notification.id),
    [notifications, page]
  );

  useEffect(() => {
    if (!panelOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [panelOpen, setPanelOpen]);

  function togglePanel() {
    setPage(1);
    setPanelOpen(!panelOpen);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={togglePanel}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={panelOpen}
        className={cn(
          "relative rounded-lg p-2 text-ink-secondary transition-colors hover:bg-sunken hover:text-ink",
          panelOpen && "bg-sunken text-ink"
        )}
      >
        <Bell size={18} aria-hidden="true" />

        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-semibold leading-4 text-white ring-2 ring-surface"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen &&
        createPortal(
          <div
            role="dialog"
            aria-label="Notifications panel"
            className="fixed inset-x-3 top-14 z-[60] mx-auto max-w-sm overflow-hidden rounded-xl border border-line bg-elevated shadow-pop animate-slide-up sm:inset-x-auto sm:right-5"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold tracking-tight text-ink">
                Notifications
              </p>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-brand-ink transition-colors hover:bg-brand-soft disabled:pointer-events-none disabled:opacity-40"
              >
                <CheckCheck size={13} aria-hidden="true" />
                Mark all read
              </button>
            </div>

            {visibleIds.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="You're all caught up"
                message="New activity will show up here."
                className="m-3 border-none bg-transparent"
              />
            ) : (
              <>
                <ul className="max-h-80 overflow-y-auto p-1.5">
                  {visibleIds.map((id) => (
                    <NotificationRow key={id} id={id} />
                  ))}
                </ul>

                {pageCount > 1 && (
                  <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-md px-2 py-1 text-xs font-medium text-ink-secondary transition-colors hover:bg-sunken disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="text-xs text-ink-muted">
                      Page {page} of {pageCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      disabled={page === pageCount}
                      className="rounded-md px-2 py-1 text-xs font-medium text-ink-secondary transition-colors hover:bg-sunken disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
