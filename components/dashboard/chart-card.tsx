"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { toCurrency } from "@/lib/utils";

type Point = Record<string, string | number>;

type ChartCardProps = {
  title: string;
  eyebrow?: string;
  type?: "area" | "bar";
  data: Point[];
  xKey: string;
  yKey: string;
  color?: string;
};

export function ChartCard({
  title,
  eyebrow,
  type = "area",
  data,
  xKey,
  yKey,
  color = "#0B1015",
}: ChartCardProps) {
  const commonProps = {
    data,
    margin: { top: 8, right: 8, left: 0, bottom: 0 },
  };

  return (
    <Card title={title} eyebrow={eyebrow} className="h-[300px] sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.45} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(11, 16, 21, 0.07)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: "#415261", fontSize: 12 }} />
            <YAxis tick={{ fill: "#415261", fontSize: 12 }} />
            <Tooltip formatter={(value: number) => toCurrency(value)} />
            <Area
              dataKey={yKey}
              stroke={color}
              strokeWidth={2.5}
              fill="url(#equityFill)"
              type="monotone"
            />
          </AreaChart>
        ) : (
          <BarChart {...commonProps}>
            <CartesianGrid stroke="rgba(11, 16, 21, 0.07)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: "#415261", fontSize: 12 }} />
            <YAxis tick={{ fill: "#415261", fontSize: 12 }} />
            <Tooltip formatter={(value: number) => toCurrency(value)} />
            <Bar dataKey={yKey} fill={color} radius={[10, 10, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
