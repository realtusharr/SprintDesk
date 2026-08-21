import KanbanBoard from "../components/board/KanbanBoard";

export default function Board() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Kanban Board
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage tasks across your current sprint.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}