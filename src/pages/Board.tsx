import { AlertTriangle, RotateCcw } from "lucide-react";
import KanbanBoard from "../components/board/KanbanBoard";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import { useBoardHydration } from "../hooks/useTask";

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((column) => (
        <div
          key={column}
          className="rounded-2xl border border-line bg-sunken/60 p-2.5"
        >
          <div className="flex items-center gap-2 px-1.5 pb-3 pt-1">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-5 w-8 rounded-full" />
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((card) => (
              <Skeleton key={card} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Board() {
  const { isLoading, isError, refetch } = useBoardHydration();

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <AlertTriangle size={22} aria-hidden="true" />
        </span>

        <div>
          <p className="font-semibold text-ink">Failed to load the board</p>

          <p className="mt-1 text-sm text-ink-muted">
            Something went wrong while fetching sprint data.
          </p>
        </div>

        <Button variant="secondary" onClick={() => refetch()}>
          <RotateCcw size={14} aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6 md:px-6 xl:h-[calc(100vh-6rem)] xl:min-h-0">
      {isLoading ? <BoardSkeleton /> : <KanbanBoard />}
    </div>
  );
}
