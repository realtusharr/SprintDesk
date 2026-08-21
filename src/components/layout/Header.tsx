import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Moon, Sun, Zap } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useThemeStore } from "../../store/theme.store";
import { useSprints } from "../../hooks/useTask";
import { useLogout } from "../../hooks/useAuth";
import { findActiveSprint } from "../../utils/date";
import NotificationBell from "../notifications/NotificationBell";
import Avatar from "../ui/Avatar";

function ActiveSprintChip() {
  const { data: sprints } = useSprints();

  const activeSprint = sprints ? findActiveSprint(sprints) : null;

  if (!activeSprint) return null;

  return (
    <span
      aria-hidden="true"
      className="mr-1 hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted lg:inline-flex"
    >
      <Zap size={11} className="text-brand" />
      {activeSprint.name} · ends{" "}
      {new Date(activeSprint.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </span>
  );
}

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-sunken hover:text-ink"
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}

function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-sunken"
      >
        <Avatar name={fullName} src={user?.image} size="md" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-elevated p-1.5 shadow-pop animate-slide-up"
        >
          <div className="px-3 py-2">
            <p className="truncate text-[13px] font-medium text-ink">{fullName}</p>

            <p className="truncate text-xs text-ink-muted">{user?.email}</p>
          </div>

          <div className="my-1 h-px bg-line" />

          <button
            role="menuitem"
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger-soft"
          >
            <LogOut size={15} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-sunken hover:text-ink md:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <h1 className="text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <ActiveSprintChip />

        <NotificationBell />

        <ThemeToggle />

        <div className="ml-1.5 flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
