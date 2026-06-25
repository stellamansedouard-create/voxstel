"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface CategoryData {
  category: string;
  label: string;
  count: number;
  percentage: number;
}

interface DailyData {
  date: string;
  count: number;
}

interface Props {
  categories: CategoryData[];
  daily: DailyData[];
}

const CATEGORY_COLORS: Record<string, string> = {
  image: "#C8910A",
  video: "#3B82F6",
  text: "#8B5CF6",
  music: "#10B981",
  other: "#9CA3AF",
};

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function EmptyState() {
  return (
    <div className="h-[156px] flex flex-col items-center justify-center gap-2">
      <span className="text-3xl">📊</span>
      <p className="text-sm text-muted">Pas encore de données</p>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-[156px] rounded-xl shimmer" />;
}

export default function AnalyticsCharts({ categories, daily }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hasData = categories.length > 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Donut chart — répartition par catégorie */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
          Répartition par catégorie
        </p>
        {!mounted ? (
          <ChartSkeleton />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={42}
                    outerRadius={66}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {categories.map((cat) => (
                      <Cell
                        key={cat.category}
                        fill={CATEGORY_COLORS[cat.category] ?? CATEGORY_COLORS.other}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #E5E5E3",
                      borderRadius: 10,
                      fontSize: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.category} className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[cat.category] ?? CATEGORY_COLORS.other,
                    }}
                  />
                  <span className="text-sm text-foreground flex-1">{cat.label}</span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {cat.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Line chart — activité 30 derniers jours */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
          Activité — 30 derniers jours
        </p>
        {!mounted ? (
          <ChartSkeleton />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <div className="h-[156px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={daily}
                margin={{ top: 4, right: 8, bottom: 0, left: -24 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E5E3"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDayLabel}
                  interval={6}
                  tick={{ fontSize: 10, fill: "#6B6B6B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6B6B6B" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip
                  labelFormatter={(v) => formatDayLabel(v as string)}
                  formatter={(value) => [value, "Générations"]}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E5E3",
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#C8910A"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#C8910A", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
