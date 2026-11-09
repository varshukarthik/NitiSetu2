// Charts: Clean, accessible data representations.
// Solid data bars without gradient fills, muted grid lines, and tabular numbers.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

import type { Bucket } from "../../lib/api/types";
import { money, moneyCompact } from "../../lib/format";

export function MaturityChart({
  buckets,
  onSelectMonth,
}: {
  buckets: Bucket[];
  onSelectMonth?: (month: string) => void;
}) {
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const data = buckets.map((bucket) => ({
    label: bucket.label,
    amount: Number(bucket.amount),
    count: bucket.count,
  }));

  const maxVal = Math.max(...data.map((d) => (mode === "amount" ? d.amount : d.count)), 1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Showing projected maturity distribution across scheduled calendar windows.
        </p>
        <div role="group" aria-label="Chart measure" className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={mode === "amount"}
            onClick={() => setMode("amount")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "amount"
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            By value
          </button>
          <button
            type="button"
            aria-pressed={mode === "count"}
            onClick={() => setMode("count")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              mode === "count"
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            By count
          </button>
        </div>
      </div>

      <div className="h-64 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="2 2" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(value: number) =>
                mode === "amount" ? moneyCompact(value) : String(value)
              }
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload as { label: string; amount: number; count: number };
                return (
                  <div className="rounded-lg bg-slate-900 text-white px-3 py-2 text-xs shadow-md border border-slate-800">
                    <p className="font-medium text-slate-300">{row.label}</p>
                    <p className="mt-1 font-semibold text-white tabular-nums">
                      {money(row.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {row.count} instrument{row.count === 1 ? "" : "s"}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey={mode}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              onClick={(entry: { label?: string }) => entry.label && onSelectMonth?.(entry.label)}
            >
              {data.map((row) => {
                const val = mode === "amount" ? row.amount : row.count;
                const isPeak = val === maxVal && val > 0;
                return (
                  <Cell
                    key={row.label}
                    fill={isPeak ? "#1d4ed8" : "#93c5fd"}
                    cursor={onSelectMonth ? "pointer" : "default"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-3 text-xs text-slate-500">
        <summary className="cursor-pointer font-medium text-slate-600 hover:text-slate-900">
          View as accessible data table
        </summary>
        <table className="mt-2 w-full text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th scope="col" className="py-1.5 font-medium">Month</th>
              <th scope="col" className="py-1.5 text-right font-medium">Instruments</th>
              <th scope="col" className="py-1.5 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 font-medium text-slate-700">{row.label}</td>
                <td className="tabular-nums py-1.5 text-right">{row.count}</td>
                <td className="tabular-nums py-1.5 text-right font-medium text-slate-800">{money(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export function BacklogBars({ buckets }: { buckets: Bucket[] }) {
  const max = Math.max(3, ...buckets.map((bucket) => bucket.count));

  return (
    <div className="space-y-3.5 pt-1">
      {buckets.map((bucket) => {
        const count = bucket.count;
        const widthPercent = count > 0 ? Math.max(8, Math.round((count / max) * 100)) : 0;
        const isCritical = bucket.label.includes("> 30") || bucket.label.includes("15-30");

        return (
          <div key={bucket.label} className="flex items-center gap-3 text-xs">
            <span className="w-24 font-normal text-slate-600 shrink-0">{bucket.label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              {widthPercent > 0 && (
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCritical && count > 0 ? "bg-amber-600" : "bg-slate-700"
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              )}
            </div>
            <span className="w-6 text-right font-medium text-slate-900 tabular-nums">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
