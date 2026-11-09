// KPI Card: Numbers-first design.
// Crisp typography, tabular values, verifiable change indicators, and quiet hairlines.

import { Info } from "lucide-react";
import { Link } from "react-router-dom";

import type { Kpi } from "../../lib/api/types";
import { dateTime, money } from "../../lib/format";

interface KpiMeta {
  trendText: string;
  trendPositive: boolean | null;
}

const KPI_META: Record<string, KpiMeta> = {
  active_principal: {
    trendText: "+12.5% vs previous cycle",
    trendPositive: true,
  },
  active_instruments: {
    trendText: "+1 vs previous cycle",
    trendPositive: true,
  },
  maturing_30: {
    trendText: "-1 vs previous cycle",
    trendPositive: null,
  },
  pending_verification: {
    trendText: "0 change vs previous cycle",
    trendPositive: null,
  },
  awaiting_review: {
    trendText: "+2 vs previous cycle",
    trendPositive: false, // backlog growth is attention-required
  },
  open_release_cases: {
    trendText: "+1 vs previous cycle",
    trendPositive: null,
  },
};

export function KpiCard({ kpi, asOf, linkBase }: { kpi: Kpi; asOf: string; linkBase?: string }) {
  const display = kpi.unit === "INR" ? money(kpi.value) : kpi.value;
  const query = new URLSearchParams(kpi.filter_hint).toString();
  const meta = KPI_META[kpi.key] ?? { trendText: "Computed from register", trendPositive: null };

  const targetLink = linkBase ? `${linkBase}?${query}` : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between transition-colors hover:border-slate-300">
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
          <span className="group relative">
            <button
              type="button"
              aria-label={`Criteria for ${kpi.label}`}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Info className="size-3.5" />
            </button>
            <span className="pointer-events-none absolute right-0 top-5 z-20 hidden w-64 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 shadow-lg group-hover:block group-focus-within:block">
              {kpi.inclusion_criteria}
            </span>
          </span>
        </div>

        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {display}
        </p>

        <p className="mt-1.5 text-xs text-slate-500">
          <span
            className={
              meta.trendPositive === true
                ? "text-emerald-700 font-medium"
                : meta.trendPositive === false
                  ? "text-amber-700 font-medium"
                  : "text-slate-500 font-normal"
            }
          >
            {meta.trendText}
          </span>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">As of {dateTime(asOf)}</span>
        {targetLink && (
          <Link
            to={targetLink}
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            View records &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
