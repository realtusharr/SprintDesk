import { useMemo } from "react";
import { useToastStore } from "../store/toast.store";

export interface ToastApi {
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
}

export function useToast(): ToastApi {
  const addToast = useToastStore((state) => state.addToast);

  return useMemo(
    () => ({
      success: (message: string, duration?: number) =>
        addToast(message, "success", duration),
      error: (message: string, duration?: number) =>
        addToast(message, "error", duration),
      info: (message: string, duration?: number) =>
        addToast(message, "info", duration),
    }),
    [addToast]
  );
}
