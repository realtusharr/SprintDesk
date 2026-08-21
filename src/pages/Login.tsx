import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useLogin } from "../hooks/useAuth";
import { cn } from "../utils/cn";

function ShowcasePanel() {
  return (
    <div className="relative hidden overflow-hidden border-l border-line bg-surface lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 80% 10%, var(--brand-soft), transparent 60%), radial-gradient(500px circle at 10% 90%, rgba(0,134,201,0.12), transparent 55%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-center gap-8 px-14">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1 text-xs font-medium text-brand-ink">
            <Sparkles size={12} aria-hidden="true" />
            Built for shipping fast
          </span>

          <h2 className="mt-5 max-w-md text-3xl font-bold leading-tight tracking-tight text-ink">
            Plan sprints, move work forward, measure what matters.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
            A focused workspace for software teams — drag tasks across your
            board, watch velocity trends and keep everyone in sync.
          </p>
        </div>

        <div className="pointer-events-none relative max-w-lg select-none rounded-2xl border border-line bg-canvas p-4 shadow-pop">
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Backlog", count: 7 },
              { title: "In Progress", count: 4 },
              { title: "Done", count: 12 },
            ].map((column) => (
              <div key={column.title} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {column.title}
                  </p>

                  <span className="rounded-full bg-surface px-1.5 text-[9px] font-semibold text-ink-muted ring-1 ring-line">
                    {column.count}
                  </span>
                </div>

                {[0, 1].map((row) => (
                  <div
                    key={row}
                    className="h-14 rounded-lg border border-line bg-surface p-2 shadow-card"
                  >
                    <div className="h-1.5 w-3/4 rounded-full bg-sunken" />

                    <div className="mt-2 h-1.5 w-1/2 rounded-full bg-sunken" />

                    <div className="mt-2 flex items-center gap-1">
                      <span className="size-3 rounded-full bg-brand-soft" />
                      <span className="h-1.5 w-6 rounded-full bg-sunken" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <ul className="space-y-2.5 text-sm text-ink-secondary">
          {[
            "Drag-and-drop sprint board",
            "Live analytics on real data",
            "Real-time notifications",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <CheckCircle2
                size={16}
                aria-hidden="true"
                className="text-success"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Login() {
  const status = useAuthStore((state) => state.status);
  const login = useLogin();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setSubmitting(true);

    try {
      await login(username.trim(), password, remember);
    } catch {
      setError("Sign in failed. Check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "bootstrapping") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="flex size-12 animate-pulse items-center justify-center rounded-2xl bg-brand text-white shadow-pop">
          <Zap size={22} aria-hidden="true" />
        </span>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <main className="flex items-center justify-center bg-canvas px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-pop">
              <Zap size={17} aria-hidden="true" />
            </span>

            <span className="text-lg font-bold tracking-tight text-ink">
              SprintDesk
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm text-ink-secondary">
            Sign in to your workspace to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-[13px] font-medium text-ink-secondary"
              >
                Username
              </label>

              <div className="relative">
                <UserIcon
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />

                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="e.g. emilys"
                  className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-ink-secondary"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-line bg-surface pl-9 pr-10 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff size={15} aria-hidden="true" />
                  ) : (
                    <Eye size={15} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px] text-ink-secondary">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="peer sr-only"
                aria-label="Remember me for 30 days"
              />

              <span
                aria-hidden="true"
                className={cn(
                  "flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  remember
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-surface"
                )}
              >
                {remember && (
                  <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              Remember me for 30 days
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-[13px] text-danger"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover active:bg-brand-active disabled:opacity-60"
            >
              {submitting && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                />
              )}
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-line bg-surface/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Demo credentials
            </p>

            <p className="mt-1 text-xs text-ink-secondary">
              username{" "}
              <code className="font-semibold text-ink">emilys</code> · password{" "}
              <code className="font-semibold text-ink">emilyspass</code>
            </p>
          </div>
        </div>
      </main>

      <ShowcasePanel />
    </div>
  );
}
