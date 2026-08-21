import { cn } from "../../utils/cn";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-6 text-[9px]",
  md: "size-8 text-[11px]",
  lg: "size-10 text-sm",
};

const palette = [
  "bg-brand-soft text-brand-ink",
  "bg-success-soft text-success",
  "bg-warning-soft text-warning",
  "bg-danger-soft text-danger",
  "bg-info-soft text-info",
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const fallbackTone =
    palette[
      Math.abs(
        name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % palette.length
    ];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-line",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        fallbackTone,
        sizeClasses[size],
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
