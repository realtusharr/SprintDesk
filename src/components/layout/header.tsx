import { Bell, Menu, Search } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search tasks..."
            className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {fullName}
            </p>

            <p className="text-xs text-slate-400">
              Team Member
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {user?.firstName?.charAt(0) ?? "U"}
            {user?.lastName?.charAt(0) ?? ""}
          </div>
        </div>
      </div>
    </header>
  );
}