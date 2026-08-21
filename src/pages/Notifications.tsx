import { useMemo, useState } from "react";
import { Bell, BellRing, Check, CheckCheck } from "lucide-react";
import { useNotificationStore } from "../store/notification.store";
import { useNotifications } from "../hooks/useNotifications";
import { NOTIFICATIONS_PAGE_SIZE } from "../utils/constants";
import { formatRelativeTime } from "../utils/date";
import Badge, { type BadgeTone } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function Notifications() {
  useNotifications();

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? notifications
        : notifications.filter((notification) => !notification.read),
    [notifications, filter]
  );

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / NOTIFICATIONS_PAGE_SIZE)
  );

  const visible = useMemo(
    () =>
      filtered.slice(
        (page - 1) * NOTIFICATIONS_PAGE_SIZE,
        page * NOTIFICATIONS_PAGE_SIZE
      ),
    [filtered, page]
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  function changeFilter(value: "all" | "unread") {
    setFilter(value);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Notifications
          </h2>

          <p className="mt-0.5 text-sm text-ink-muted">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={15} aria-hidden="true" />
          Mark all as read
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="Filter notifications"
        className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-card"
      >
        {(["all", "unread"] as const).map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={filter === value}
            onClick={() => changeFilter(value)}
            className={
              "rounded-lg px-4 py-1.5 text-[13px] font-medium capitalize transition-colors " +
              (filter === value
                ? "bg-brand-soft text-brand-ink"
                : "text-ink-secondary hover:text-ink")
            }
          >
            {value}

            {value === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {visible.length === 0 ? (
          <EmptyState
            icon={BellRing}
            title="Nothing here yet"
            message="New notifications will appear as your team and integrations post updates."
            className="m-4"
          />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((notification) => {
              const tone: BadgeTone =
                notification.type === "review"
                  ? "warning"
                  : notification.type === "mention"
                    ? "brand"
                    : "info";

              return (
                <li key={notification.id}>
                  <div
                    className={
                      "flex gap-3 px-5 py-4 transition-colors hover:bg-sunken/60 " +
                      (!notification.read ? "bg-brand-soft/40" : "")
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-transparent"
                    >
                      {!notification.read && (
                        <span className="block size-2 rounded-full bg-brand" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-semibold text-ink">
                          {notification.title}
                        </p>

                        <Badge tone={tone} className="capitalize">
                          {notification.type}
                        </Badge>

                        <span className="ml-auto text-[11px] text-ink-muted">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-[13px] leading-snug text-ink-secondary">
                        {notification.message}
                      </p>

                      <div className="mt-2">
                        {notification.read ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-faint">
                            <Check size={12} aria-hidden="true" />
                            Read
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 -mx-1.5 text-[11px] font-medium text-brand-ink transition-colors hover:bg-brand-soft"
                          >
                            <Bell size={11} aria-hidden="true" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pageCount > 1 && (
        <nav
          aria-label="Notification pages"
          className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-2.5 shadow-card"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span aria-live="polite" className="text-xs font-medium text-ink-muted">
            Page {page} of {pageCount} · {filtered.length} total
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}
