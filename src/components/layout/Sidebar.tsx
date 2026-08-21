import { useMemo } from "react";
import {
  BarChart3,
  Bell,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useLogout } from "../../hooks/useAuth";
import { useNotificationStore } from "../../store/notification.store";
import Avatar from "../ui/Avatar";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Board", path: "/board", icon: KanbanSquare },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Notifications", path: "/notifications", icon: Bell },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
          <Zap size={16} aria-hidden="true" />
        </span>

        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            SprintDesk
          </p>

          <p className="text-[11px] text-ink-muted">Sprint management</p>
        </div>
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-soft text-brand-ink"
                    : "text-ink-secondary hover:bg-sunken hover:text-ink"
                )
              }
            >
              <Icon size={17} aria-hidden="true" />
              <span>{item.label}</span>

              {item.path === "/notifications" && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold leading-4 text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar name={user ? `${user.firstName} ${user.lastName}` : "User"} />

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-ink">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>

            <p className="truncate text-[11px] text-ink-muted">
              {user?.email ?? ""}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            title="Log out"
            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
