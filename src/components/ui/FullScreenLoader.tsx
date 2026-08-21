import { Zap } from "lucide-react";

export default function FullScreenLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-pop">
        <Zap size={22} aria-hidden="true" />
      </span>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: `${delay}ms` }}
            className="size-1.5 animate-bounce rounded-full bg-ink-faint"
          />
        ))}
      </div>

      <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        SprintDesk
      </p>
    </div>
  );
}
