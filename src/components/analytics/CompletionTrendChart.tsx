import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "../../utils/analytics";
import { useChartTheme } from "./useChartTheme";
import ChartCard, { ChartTooltip } from "./ChartCard";

interface CompletionTrendChartProps {
  data: TrendPoint[];
}

export default function CompletionTrendChart({
  data,
}: CompletionTrendChartProps) {
  const colors = useChartTheme();

  const gradientId = "completion-gradient";

  return (
    <ChartCard
      title="Completion trend"
      description="Cumulative tasks completed over time"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.brand} stopOpacity={0.35} />
              <stop offset="100%" stopColor={colors.brand} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.line}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fontSize: 11, fill: colors.inkMuted }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: colors.inkMuted }}
            axisLine={false}
            tickLine={false}
            width={28}
          />

          <Tooltip content={<ChartTooltip />} />

          <Area
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke={colors.brand}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
