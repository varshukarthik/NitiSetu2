// KPI Card component matching the high-fidelity design specification.
// Displays label, value, growth badge, subtext, link, and right-hand sparkline/mini-bar chart.

import {
  ArrowRight,
  Coins,
  Clock,
  FileText,
  FolderClosed,
  Info,
  Landmark,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Kpi } from "../../lib/api/types";
import { dateTime, money } from "../../lib/format";

interface KpiCardConfig {
  icon: typeof Coins;
  iconBg: string;
  iconColor: string;
  trendText: string;
  trendPositive: boolean | null; // true = green, false = red, null = gray
  chartType: "blue-area" | "purple-bars" | "orange-line" | "pink-line" | "amber-bars" | "blue-line";
}

const KPI_CONFIGS: Record<string, KpiCardConfig> = {
  active_principal: {
    icon: Coins,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    trendText: "↑ 12.5% vs last period",
    trendPositive: true,
    chartType: "blue-area",
  },
  active_instruments: {
    icon: FileText,
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    trendText: "↑ 20% vs last period",
    trendPositive: true,
    chartType: "purple-bars",
  },
  maturing_30: {
    icon: Clock,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    trendText: "↓ 50% vs last period",
    trendPositive: false,
    chartType: "orange-line",
  },
  pending_verification: {
    icon: Landmark,
    iconBg: "bg-rose-100 border border-rose-200",
    iconColor: "text-rose-600",
    trendText: "0% vs last period",
    trendPositive: null,
    chartType: "pink-line",
  },
  awaiting_review: {
    icon: User,
    iconBg: "bg-amber-400",
    iconColor: "text-white",
    trendText: "↑ 200% vs last period",
    trendPositive: true,
    chartType: "amber-bars",
  },
  open_release_cases: {
    icon: FolderClosed,
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    trendText: "↑ 100% vs last period",
    trendPositive: true,
    chartType: "blue-line",
  },
};

const DEFAULT_CONFIG: KpiCardConfig = {
  icon: Coins,
  iconBg: "bg-blue-500",
  iconColor: "text-white",
  trendText: "↑ 10% vs last period",
  trendPositive: true,
  chartType: "blue-area",
};

function MiniChart({ type }: { type: KpiCardConfig["chartType"] }) {
  if (type === "blue-area") {
    return (
      <svg className="w-24 h-12" viewBox="0 0 100 50" fill="none">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d="M0 40 C 20 38, 40 45, 60 25 C 80 10, 90 12, 100 8 L 100 50 L 0 50 Z"
          fill="url(#blueGrad)"
        />
        <path
          d="M0 40 C 20 38, 40 45, 60 25 C 80 10, 90 12, 100 8"
          stroke="#3b82f6"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "purple-bars") {
    return (
      <div className="flex items-end gap-1.5 h-10 w-20 justify-end">
        <span className="w-2 rounded-t bg-purple-200 h-[25%]" />
        <span className="w-2 rounded-t bg-purple-300 h-[45%]" />
        <span className="w-2 rounded-t bg-purple-400 h-[65%]" />
        <span className="w-2 rounded-t bg-purple-500 h-[85%]" />
        <span className="w-2 rounded-t bg-purple-600 h-[100%]" />
      </div>
    );
  }

  if (type === "orange-line") {
    return (
      <svg className="w-24 h-10" viewBox="0 0 100 40" fill="none">
        <path
          d="M0 25 C 20 15, 40 10, 55 28 C 70 42, 85 10, 100 15"
          stroke="#f97316"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "pink-line") {
    return (
      <svg className="w-24 h-10" viewBox="0 0 100 40" fill="none">
        <path
          d="M0 30 C 25 35, 45 15, 65 20 C 85 25, 95 10, 100 12"
          stroke="#f43f5e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "amber-bars") {
    return (
      <div className="flex items-end gap-1.5 h-10 w-20 justify-end">
        <span className="w-2 rounded-t bg-amber-200 h-[20%]" />
        <span className="w-2 rounded-t bg-amber-300 h-[35%]" />
        <span className="w-2 rounded-t bg-amber-400 h-[55%]" />
        <span className="w-2 rounded-t bg-amber-500 h-[80%]" />
        <span className="w-2 rounded-t bg-amber-500 h-[100%]" />
      </div>
    );
  }

  return (
    <svg className="w-24 h-10" viewBox="0 0 100 40" fill="none">
      <path
        d="M0 32 C 20 30, 40 38, 60 20 C 75 10, 90 15, 100 10"
        stroke="#3b82f6"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KpiCard({ kpi, asOf, linkBase }: { kpi: Kpi; asOf: string; linkBase?: string }) {
  const display = kpi.unit === "INR" ? money(kpi.value) : kpi.value;
  const query = new URLSearchParams(kpi.filter_hint).toString();
  const config = KPI_CONFIGS[kpi.key] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  const targetLink = linkBase ? `${linkBase}?${query}` : "#";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative">
      <div>
        {/* Top Header Row: Icon + Title + Info Tooltip */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${config.iconBg} ${config.iconColor}`}
            >
              <Icon className="size-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-tight">{kpi.label}</p>
          </div>

          <span className="group relative">
            <button type="button" aria-label="KPI Info" className="text-slate-400 hover:text-slate-600">
              <Info className="size-4" />
            </button>
            <span className="pointer-events-none absolute right-0 top-5 z-20 hidden w-64 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 shadow-xl group-hover:block group-focus-within:block">
              {kpi.inclusion_criteria}
            </span>
          </span>
        </div>

        {/* Value + Growth Pill */}
        <div className="mt-4 flex items-center gap-2.5 flex-wrap">
          <p className="tabular text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 leading-none">
            {display}
          </p>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
              config.trendPositive === true
                ? "bg-emerald-50 text-emerald-700"
                : config.trendPositive === false
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {config.trendText}
          </span>
        </div>
      </div>

      {/* Bottom Row: Subtext & Link (Left) vs Mini Chart (Right) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] text-slate-400">As of {dateTime(asOf)}</p>
          <Link
            to={targetLink}
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View details</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="shrink-0 flex items-end justify-end">
          <MiniChart type={config.chartType} />
        </div>
      </div>
    </div>
  );
}
