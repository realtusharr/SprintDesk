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
import type { VelocityPoint } from "../../utils/analytics";
import { useChartTheme } from "./useChartTheme";
import ChartCard, { ChartTooltip } from "./ChartCard";

interface VelocityChartProps {
  data: VelocityPoint[];
}

export default function VelocityChart({ data }: VelocityChartProps) {
  const colors = useChartTheme();

  return (
    <ChartCard
      title="Sprint velocity"
      description="Completed tasks per sprint"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.line}
            vertical={false}
          />

          <XAxis
            dataKey="sprint"
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
            dataKey="total"
            name="Total tasks"
            fill={colors.brand}
            fillOpacity={0.25}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />

          <Bar
            dataKey="completed"
            name="Completed"
            fill={colors.brand}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
