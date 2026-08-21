import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "../../store/toast.store";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon =
          toast.type === "success"
            ? CheckCircle
            : toast.type === "error"
              ? XCircle
              : Info;

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            <Icon
              size={20}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <p className="flex-1 text-sm text-slate-700">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}