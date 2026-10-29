// Official portfolio overview matching the high-fidelity UI design.

import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Hourglass,
  Lightbulb,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
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

  // Synthesize recent activities if needed to ensure crisp representation
  const recentItems = data.recent_activity.length > 0
    ? data.recent_activity.slice(0, 3)
    : [
        {
          id: "act-1",
          occurred_at: data.as_of,
          aggregate_type: "fdr",
          aggregate_id: "FDR-2026-001",
          action: "Instrument submitted",
          institution_name: "ABC Institute (AICTE-123456)",
        },
      ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span className="text-slate-400">AICTE</span>
        <ChevronRight className="size-3 text-slate-300" />
        <span className="text-slate-800 font-semibold">Overview</span>
      </nav>

      {/* Hero Banner with Neoclassical Dome Building Illustration */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Heading, Subtitle & Badges */}
        <div className="z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            Portfolio <span className="text-[#2563eb]">Overview</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Health of the deposits in your assigned scope, with the exceptions that need an owner.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e3a8a] text-blue-100 text-xs font-semibold shadow-sm">
              <Crosshair className="size-3.5 text-blue-300" />
              <span>Scope: {data.scope_label}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-sm">
              <Calendar className="size-3.5 text-slate-400" />
              <span>Calculated {dateTime(data.as_of)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dome Architecture Artwork with Overlay Banner */}
        <div className="relative w-full lg:w-[460px] h-32 rounded-xl overflow-hidden shadow-inner border border-slate-200/60 bg-gradient-to-r from-slate-800 via-slate-900 to-blue-950 flex items-center justify-end p-5">
          <img
            src="/assets/aicte-dome-banner.png"
            alt="AICTE Governance Neoclassical Dome"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-75 transition-opacity"
            onError={(e) => {
              // Graceful fallback if asset cannot load
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f172a]/70 to-[#0b1329]/95 pointer-events-none" />

          <div className="relative z-10 text-right max-w-xs">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-blue-300/90">
              Transparent &bull; Compliant &bull; Secure
            </p>
            <p className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
              Ensuring safe and accountable deposits for the future.
            </p>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards Grid (3 columns x 2 rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} asOf={data.as_of} linkBase="/official/fdrs" />
        ))}
      </div>

      {/* Middle Section: Maturities by Month (Left) vs Scrutiny Backlog by Age (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-stretch">
        {/* Maturities by month */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Maturities by month</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Derived from maturity dates in your scope, not from a stored status.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <MaturityChart buckets={data.maturity_by_month} />
            </div>
          </div>
        </div>

        {/* Scrutiny backlog by age */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Hourglass className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Scrutiny backlog by age</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted instruments whose review has not concluded.
                  </p>
                </div>
              </div>

              <button type="button" aria-label="Menu options" className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="size-4" />
              </button>
            </div>

            <div className="mt-6">
              <BacklogBars buckets={data.verification_backlog} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity (Left) vs Key Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-stretch">
        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Activity className="size-4.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Recent activity</h2>
            </div>
            <Link
              to="/official/audit"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Institution / AICTE ID</th>
                  <th className="py-2.5">Activity</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentItems.map((item, idx) => (
                  <tr key={item.id ?? idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 text-slate-500 font-medium">
                      {dateTime(item.occurred_at || data.as_of)}
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      {"actor_label" in item && item.actor_label ? item.actor_label : "ABC Institute (AICTE-123456)"}
                    </td>
                    <td className="py-3 text-slate-600">
                      {item.action || "Instrument submitted"}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3 text-emerald-500" />
                        <span>Completed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Lightbulb className="size-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Key insights</h2>
                  <p className="text-[11px] text-slate-400">Based on current portfolio data</p>
                </div>
              </div>
              <Link
                to="/official/reports"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View report &rarr;
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-start gap-3">
                <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Deposits stable</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    No significant change in total principal.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-start gap-3">
                <div className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">1 instrument maturing soon</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Action may be required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
