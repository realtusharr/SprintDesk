import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PriorityBreakdownPoint } from "../../utils/analytics";
import { useChartTheme } from "./useChartTheme";
import ChartCard, { ChartTooltip } from "./ChartCard";

interface PriorityBreakdownChartProps {
  data: PriorityBreakdownPoint[];
}

export default function PriorityBreakdownChart({
  data,
}: PriorityBreakdownChartProps) {
  const colors = useChartTheme();

  return (
    <ChartCard
      title="Priority breakdown"
      description="Task priorities across columns"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.line}
            vertical={false}
          />

          <XAxis
            dataKey="column"
            tick={{ fontSize: 11, fill: colors.inkMuted }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: colors.inkMuted }}
            axisLine={false}
            tickLine={false}
            width={28}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.line, opacity: 0.4 }} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: colors.inkSecondary, paddingTop: 8 }}
          />

          <Bar
            dataKey="high"
            name="High"
            stackId="priority"
            fill={colors.danger}
            radius={[0, 0, 0, 0]}
          />

          <Bar
            dataKey="medium"
            name="Medium"
            stackId="priority"
            fill={colors.warning}
          />

          <Bar
            dataKey="low"
            name="Low"
            stackId="priority"
            fill={colors.success}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
