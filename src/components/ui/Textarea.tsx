import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref
) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-[13px] font-medium text-ink-secondary"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-faint focus:outline-none focus:ring-2",
          error
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line hover:border-line-strong focus:border-brand focus:ring-brand/15",
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Textarea;
