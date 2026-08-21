import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
        <Compass size={26} aria-hidden="true" />
      </span>

      <div>
        <p className="text-5xl font-bold tracking-tight text-ink">404</p>

        <h2 className="mt-2 text-lg font-semibold text-ink">Page not found</h2>

        <p className="mt-1 max-w-sm text-sm text-ink-muted">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <Link to="/dashboard">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </div>
  );
}
