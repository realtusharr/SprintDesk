import { CheckCircle2, Info, MessageSquare } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Task completed",
    message: "Dashboard UI has been marked as completed.",
    time: "10 minutes ago",
    type: "success",
  },
  {
    id: 2,
    title: "New task assigned",
    message: "You have been assigned a new task.",
    time: "30 minutes ago",
    type: "info",
  },
  {
    id: 3,
    title: "New comment",
    message: "A team member commented on your task.",
    time: "1 hour ago",
    type: "message",
  },
];

export default function Notifications() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Stay updated with your team's activity.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {notifications.map((notification) => {
          const Icon =
            notification.type === "success"
              ? CheckCircle2
              : notification.type === "message"
                ? MessageSquare
                : Info;

          return (
            <div
              key={notification.id}
              className="flex gap-4 border-b border-slate-100 p-5 last:border-b-0 hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon size={19} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-slate-800">
                  {notification.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {notification.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}