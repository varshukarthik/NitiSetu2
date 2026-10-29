// Charts configured with modern aesthetics matching the portal design.

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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div />
        <div role="group" aria-label="Chart measure" className="flex items-center gap-1.5">
          <button
            type="button"
            aria-pressed={mode === "amount"}
            onClick={() => setMode("amount")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mode === "amount"
                ? "bg-[#2563eb] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            By value
          </button>
          <button
            type="button"
            aria-pressed={mode === "count"}
            onClick={() => setMode("count")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mode === "count"
                ? "bg-[#2563eb] text-white shadow-sm"
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
            <defs>
              <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
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
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload as { label: string; amount: number; count: number };
                return (
                  <div className="rounded-xl bg-[#101828] text-white px-3.5 py-2.5 shadow-2xl border border-slate-700/60 min-w-40">
                    <p className="text-[11px] font-medium text-slate-400">{row.label}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white">
                      <span className="size-2 rounded-sm bg-blue-500 inline-block" />
                      <span>{money(row.amount)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {row.count} instrument{row.count === 1 ? "" : "s"}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey={mode}
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
              onClick={(entry: { label?: string }) => entry.label && onSelectMonth?.(entry.label)}
            >
              {data.map((row) => (
                <Cell
                  key={row.label}
                  fill="url(#barBlueGradient)"
                  cursor={onSelectMonth ? "pointer" : "default"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-3 text-xs text-slate-500">
        <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-700">
          View as accessible data table
        </summary>
        <table className="mt-2 w-full text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th scope="col" className="py-1.5">Month</th>
              <th scope="col" className="py-1.5 text-right">Instruments</th>
              <th scope="col" className="py-1.5 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 font-medium">{row.label}</td>
                <td className="tabular py-1.5 text-right">{row.count}</td>
                <td className="tabular py-1.5 text-right">{money(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export function BacklogBars({ buckets }: { buckets: Bucket[] }) {
  // We determine max count for scale, but ensure non-zero representation
  const max = Math.max(3, ...buckets.map((bucket) => bucket.count));

  return (
    <div className="space-y-4 pt-1">
      {buckets.map((bucket) => {
        const count = bucket.count;
        const widthPercent = count > 0 ? Math.max(12, Math.round((count / max) * 100)) : 0;

        return (
          <div key={bucket.label} className="flex items-center gap-4 text-xs">
            <span className="w-20 font-medium text-slate-700 shrink-0">{bucket.label}</span>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex items-center">
              {widthPercent > 0 && (
                <div
                  className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              )}
            </div>
            <span className="w-5 text-right font-bold text-slate-900 tabular">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
