import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line px-6 py-10 text-center",
        className
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-sunken text-ink-muted">
        <Icon size={18} aria-hidden="true" />
      </span>

      <p className="text-sm font-medium text-ink-secondary">{title}</p>

      {message && <p className="max-w-xs text-xs text-ink-muted">{message}</p>}
    </div>
  );
}
