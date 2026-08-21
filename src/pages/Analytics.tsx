export default function Analytics() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track sprint performance and team progress.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completion Rate
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            72%
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Velocity
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            42
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            12
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Team Members
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            6
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Analytics Charts
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Charts will be added in the next stage.
        </p>
      </div>
    </div>
  );
}