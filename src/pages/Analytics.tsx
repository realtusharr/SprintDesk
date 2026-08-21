import { useMemo } from "react";
import { useBoardStore } from "../store/board.store";
import { useSprints } from "../hooks/useTask";
import {
  getCompletionTrend,
  getPriorityBreakdown,
  getStatusDistribution,
  getVelocity,
} from "../utils/analytics";
import VelocityChart from "../components/analytics/VelocityChart";
import StatusDonut from "../components/analytics/StatusDonut";
import PriorityBreakdownChart from "../components/analytics/PriorityBreakdownChart";
import CompletionTrendChart from "../components/analytics/CompletionTrendChart";

export default function Analytics() {
  const tasks = useBoardStore((state) => state.tasks);
  const { data: sprints = [] } = useSprints();

  const velocity = useMemo(() => getVelocity(tasks, sprints), [tasks, sprints]);
  const statusDistribution = useMemo(
    () => getStatusDistribution(tasks),
    [tasks]
  );
  const priorityBreakdown = useMemo(
    () => getPriorityBreakdown(tasks),
    [tasks]
  );
  const completionTrend = useMemo(() => getCompletionTrend(tasks), [tasks]);

  return (
    <div className="space-y-4 px-4 py-6 md:px-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VelocityChart data={velocity} />

        <StatusDonut data={statusDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PriorityBreakdownChart data={priorityBreakdown} />

        <CompletionTrendChart data={completionTrend} />
      </div>
    </div>
  );
}
