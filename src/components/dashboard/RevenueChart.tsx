"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/types/dashboard";
import { Panel } from "./Panel";

export function RevenueChart({ data, currency }: { data: RevenuePoint[]; currency: string }) {
  const money = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return (
    <Panel
      title="Revenue"
      description="Revenue from paid orders in the selected period"
      className="min-w-0"
    >
      <div
        className="h-[250px] w-full px-1 pb-3 pt-4 sm:h-[280px] sm:px-3"
        role="img"
        aria-label="Revenue over time area chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#29845a" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#29845a" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ededed" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8a8a8a", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8a8a8a", fontSize: 11 }}
              tickFormatter={(value) =>
                money
                  .format(value >= 1000 ? value / 1000 : value)
                  .replace(/\s?\d+(?:\.\d+)?/, value >= 1000 ? `${value / 1000}k` : String(value))
              }
            />
            <Tooltip
              cursor={{ stroke: "#b5b5b5", strokeDasharray: "3 3" }}
              formatter={(value) => [money.format(Number(value)), "Revenue"]}
              contentStyle={{
                border: "1px solid #dedede",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#29845a"
              strokeWidth={2}
              fill="url(#revenueFill)"
              activeDot={{ r: 3.5, fill: "#29845a", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
