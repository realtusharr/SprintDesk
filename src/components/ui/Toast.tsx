import { useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore, type ToastType } from "../../store/toast.store";
import { cn } from "../../utils/cn";

const iconByType: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const iconColorByType: Record<ToastType, string> = {
  success: "text-success",
  error: "text-danger",
  info: "text-brand",
};

function ToastItem({ id }: { id: number }) {
  const toast = useToastStore((state) =>
    state.toasts.find((item) => item.id === id)
  );
  const dismissToast = useToastStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => dismissToast(toast.id),
      toast.duration
    );

    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const Icon = iconByType[toast.type];

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-elevated p-3.5 shadow-pop animate-toast-in"
    >
      <Icon
        size={18}
        aria-hidden="true"
        className={cn("mt-0.5 shrink-0", iconColorByType[toast.type])}
      />

      <p className="flex-1 pt-0.5 text-[13px] leading-snug text-ink">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 top-4 z-[100] mx-auto flex max-w-sm flex-col gap-2 sm:left-auto sm:right-5 sm:mx-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} />
      ))}
    </div>
  );
}
