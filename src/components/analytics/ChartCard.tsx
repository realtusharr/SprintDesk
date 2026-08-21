import type { ReactNode } from "react";

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-line bg-elevated px-3 py-2 shadow-pop">
      {label !== undefined && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </p>
      )}

      {payload.map((entry, index) => (
        <p key={index} className="flex items-center gap-2 text-xs text-ink">
          <span
            aria-hidden="true"
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <header className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>

        <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
      </header>

      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}
