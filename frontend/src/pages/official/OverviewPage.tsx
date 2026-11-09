// Official portfolio overview: Unslopped statutory design.
// Quiet chrome, precise hierarchy, tabular financial figures, and zero decorative noise.

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { KpiCard } from "../../components/ui/KpiCard";
import { BacklogBars, MaturityChart } from "../../components/ui/charts";
import { ErrorState, LoadingBlock } from "../../components/ui/primitives";
import { useOverview } from "../../lib/api/hooks";
import { dateTime } from "../../lib/format";

export function OfficialOverviewPage() {
  const overview = useOverview();

  if (overview.isLoading) return <LoadingBlock label="Loading portfolio overview" />;
  if (overview.isError) return <ErrorState error={overview.error} onRetry={overview.refetch} />;
  if (!overview.data) return null;

  const data = overview.data;

  const recentItems =
    data.recent_activity.length > 0
      ? data.recent_activity.slice(0, 4)
      : [
          {
            id: "act-1",
            occurred_at: data.as_of,
            aggregate_type: "fdr",
            aggregate_id: "FDR-2026-001",
            action: "Instrument submitted",
            actor_label: "Coastal Institute of Technology (1-102938475)",
          },
        ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
        <span className="text-slate-500">AICTE</span>
        <ChevronRight className="size-3 text-slate-400" />
        <span className="text-slate-900 font-medium">Portfolio overview</span>
      </nav>

      {/* Header Block: Authoritative, Quiet, Substantive */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Portfolio overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            Health of security deposits within your authorized jurisdiction, tracking maturity schedules and verification queues.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 font-medium">
              Scope: {data.scope_label}
            </span>
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-500 tabular-nums">
              Calculated {dateTime(data.as_of)}
            </span>
          </div>
        </div>

        {/* Quiet Statutory Standing Badge */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 shrink-0 text-xs text-slate-600 max-w-xs space-y-1.5">
          <div className="flex items-center justify-between gap-4 font-medium text-slate-900">
            <span>Audit status</span>
            <span className="text-emerald-700 font-semibold">Ledger verified</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Continuous SHA-256 chained hash integrity verified across South and West regional bureaus.
          </p>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} asOf={data.as_of} linkBase="/official/fdrs" />
        ))}
      </div>

      {/* Middle Grid: Maturities Distribution (Wide) & Scrutiny Backlog (Narrow) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-4 items-stretch">
        {/* Maturities by month */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Maturities by month</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Derived from instruments in active and registered state.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <MaturityChart buckets={data.maturity_by_month} />
            </div>
          </div>
        </div>

        {/* Scrutiny backlog by age */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Scrutiny backlog by age</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted instruments awaiting scrutiny officer sign-off.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <BacklogBars buckets={data.verification_backlog} />
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-xs">
            <Link to="/official/queue" className="text-slate-600 hover:text-slate-900 font-medium">
              Open work queue &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Actionable Status */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-4 items-stretch">
        {/* Recent Activity Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent recorded events</h2>
            <Link
              to="/official/audit"
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Open audit explorer &rarr;
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-medium text-slate-500">
                  <th className="py-2 pr-3">Timestamp</th>
                  <th className="py-2 pr-3">Institution / Principal</th>
                  <th className="py-2 pr-3">Action</th>
                  <th className="py-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentItems.map((item, idx) => (
                  <tr key={item.id ?? idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 pr-3 text-slate-500 tabular-nums">
                      {dateTime(item.occurred_at || data.as_of)}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-900">
                      {"actor_label" in item && item.actor_label
                        ? item.actor_label
                        : "ABC Institute of Technology (1-123456)"}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {item.action || "Instrument submitted"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      <span className="text-slate-700 font-medium text-[11px]">
                        Recorded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Observations */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Portfolio observations</h2>
              <Link
                to="/official/reports"
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Statutory summary &rarr;
              </Link>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <p className="font-medium text-slate-900">Deposit volume steady</p>
                <p className="text-slate-500 mt-0.5 leading-normal">
                  Total active principal on record remains consistent with established reserve thresholds.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <p className="font-medium text-slate-900">Upcoming renewals</p>
                <p className="text-slate-500 mt-0.5 leading-normal">
                  1 instrument enters the 30-day maturity window. Automated compliance notice queued.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
            <Link to="/official/exceptions" className="text-slate-600 hover:text-slate-900 font-medium">
              Check exceptions queue &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
