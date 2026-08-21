import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusSlice } from "../../utils/analytics";
import { useChartTheme, type ChartTheme } from "./useChartTheme";
import ChartCard, { ChartTooltip } from "./ChartCard";

interface StatusDonutProps {
  data: StatusSlice[];
}

const STATUS_COLORS: Record<string, keyof ChartTheme> = {
  backlog: "inkMuted",
  "in-progress": "info",
  review: "warning",
  done: "success",
};

export default function StatusDonut({ data }: StatusDonutProps) {
  const colors = useChartTheme();

  const total = useMemo(
    () => data.reduce((sum, slice) => sum + slice.count, 0),
    [data]
  );

  return (
    <ChartCard
      title="Task status"
      description="Distribution across board columns"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Tooltip content={<ChartTooltip />} />

            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={0}
              minAngle={2}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.status}
                  fill={colors[STATUS_COLORS[slice.status] ?? "brand"]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold tracking-tight text-ink">{total}</p>

          <p className="text-xs text-ink-muted">total tasks</p>
        </div>
      </div>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((slice) => (
          <li key={slice.status} className="flex items-center gap-1.5 text-[11px] font-medium text-ink-secondary">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: colors[STATUS_COLORS[slice.status] ?? "brand"] }}
            />
            {slice.label}
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
