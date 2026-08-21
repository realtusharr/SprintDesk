import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-medium text-ink-secondary"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(
          "h-9.5 w-full rounded-lg border bg-surface px-3 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-faint focus:outline-none focus:ring-2",
          error
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line hover:border-line-strong focus:border-brand focus:ring-brand/15",
          className
        )}
        {...props}
      />

      {(error || hint) && (
        <p
          id={messageId}
          className={cn("mt-1.5 text-xs", error ? "text-danger" : "text-ink-muted")}
          role={error ? "alert" : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export default Input;
