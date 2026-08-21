import {
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Tasks",
    value: "30",
    change: "+12%",
    icon: ListTodo,
  },
  {
    title: "In Progress",
    value: "8",
    change: "+5%",
    icon: Clock3,
  },
  {
    title: "Completed",
    value: "12",
    change: "+18%",
    icon: CheckCircle2,
  },
  {
    title: "Team Members",
    value: "6",
    change: "+1",
    icon: Users,
  },
];

const recentTasks = [
  {
    title: "Design login page",
    project: "SprintDesk",
    status: "In Progress",
    priority: "High",
  },
  {
    title: "Create authentication API",
    project: "SprintDesk",
    status: "Review",
    priority: "High",
  },
  {
    title: "Build dashboard UI",
    project: "SprintDesk",
    status: "Done",
    priority: "Medium",
  },
  {
    title: "Create notification system",
    project: "SprintDesk",
    status: "To Do",
    priority: "Low",
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-blue-100 text-blue-700";

    case "Review":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case "High":
      return "text-red-600";

    case "Medium":
      return "text-orange-600";

    default:
      return "text-green-600";
  }
}

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6 md:p-8">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here's what's happening with your sprint.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-4 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={14} />
                {stat.change} from last sprint
              </p>
            </div>
          );
        })}
      </div>

      {/* Sprint progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-800">
              Sprint 1
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current sprint progress
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-500">
              18 of 30 tasks completed
            </span>

            <span className="font-semibold text-slate-700">
              60%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[60%] rounded-full bg-indigo-600" />
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="font-semibold text-slate-800">
              Recent Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest activity from your team
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTasks.map((task) => (
            <div
              key={task.title}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-medium text-slate-800">
                  {task.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {task.project}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

                <span
                  className={`text-xs font-semibold ${getPriorityClass(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}