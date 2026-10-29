// Sign-in.
//
// Demonstration sign-in page engineered with 1-click role switcher,
// AES-256-GCM status beacon, and seamless fallback resilience.

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "../lib/api/client";
import { useSession } from "../lib/auth/session";

const DEMO_ACCOUNTS = [
  {
    email: "scrutiny@aicte.demo",
    role: "AICTE Scrutiny Officer",
    division: "South & West Regional Bureaus",
    target: "/official/overview",
    badge: "Official",
  },
  {
    email: "supervisor@aicte.demo",
    role: "Competent Authority",
    division: "Release Approver (Tripartite)",
    target: "/official/overview",
    badge: "Approver",
  },
  {
    email: "submitter@coastal.demo",
    role: "Institution Submitter",
    division: "Coastal Institute of Technology",
    target: "/institution/overview",
    badge: "Institution",
  },
  {
    email: "admin@aicte.demo",
    role: "Security Administrator",
    division: "Cryptographic Custodian",
    target: "/admin/overview",
    badge: "Security",
  },
  {
    email: "submitter@highland.demo",
    role: "Institution Submitter",
    division: "Highland School of Management",
    target: "/institution/overview",
    badge: "Institution",
  },
  {
    email: "pgrc@aicte.demo",
    role: "PGRC Clearance Officer",
    division: "Public Grievance Redressal",
    target: "/official/overview",
    badge: "Clearance",
  },
  {
    email: "vigilance@aicte.demo",
    role: "Vigilance Clearance Officer",
    division: "Chief Vigilance Office",
    target: "/official/overview",
    badge: "Clearance",
  },
  {
    email: "finance@aicte.demo",
    role: "Finance Bureau Officer",
    division: "Accounts & Reconciliation",
    target: "/official/overview",
    badge: "Clearance",
  },
  {
    email: "auditor@aicte.demo",
    role: "Read-Only Auditor",
    division: "Statutory Audit Cell",
    target: "/official/overview",
    badge: "Auditor",
  },
];

const DEMO_PASSWORD = "Demo@12345";

export function LoginPage() {
  const { session, signIn, meta } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const statePrefill = (location.state as { prefillEmail?: string } | null)?.prefillEmail;
  const [email, setEmail] = useState(statePrefill || "scrutiny@aicte.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [oneClickEmail, setOneClickEmail] = useState<string | null>(null);

  useEffect(() => {
    if (statePrefill) {
      setEmail(statePrefill);
    }
  }, [statePrefill]);

  if (session) {
    const from = (location.state as { from?: string } | null)?.from;
    const dest =
      from ??
      (session.workspace === "institution"
        ? "/institution/overview"
        : session.workspace === "admin"
          ? "/admin/overview"
          : "/official/overview");
    return <Navigate to={dest} replace />;
  }

  async function handleAuthenticate(targetEmail: string, targetPassword: string, destPath?: string) {
    setError(null);
    try {
      const next = await signIn(targetEmail.trim(), targetPassword);
      const destination =
        destPath ||
        (next.workspace === "institution"
          ? "/institution/overview"
          : next.workspace === "admin"
            ? "/admin/overview"
            : "/official/overview");
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Sign-in could not be completed. Please try one of the 1-click demo accounts below.",
      );
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await handleAuthenticate(email, password);
    } finally {
      setSubmitting(false);
    }
  }

  async function onOneClick(account: (typeof DEMO_ACCOUNTS)[0]) {
    setOneClickEmail(account.email);
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    try {
      await handleAuthenticate(account.email, DEMO_PASSWORD, account.target);
    } finally {
      setOneClickEmail(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1726] text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="glass-dark border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="size-4 text-teal-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Main Page</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-emerald-300 font-medium">SIH26265 Environment Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context & Architecture */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/40 shadow-lg shadow-teal-500/10">
                <ShieldCheck className="size-6 text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">NIDHISETU</p>
                <p className="text-xs uppercase tracking-wider text-teal-300">
                  AICTE Security Deposit Portal
                </p>
              </div>
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-white leading-tight">
              Statutory Security Deposit &amp; FDR Management
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Institutional deposit governance with explainable optical discrepancy detection, multi-bureau tripartite release workflows, and tamper-evident SHA-256 hash chaining.
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-5 border border-white/10 space-y-3 text-xs text-slate-300">
            <p className="font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="size-3.5" /> Cryptographic Guarantees
            </p>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
              <span>AES-256-GCM encrypted vault for sensitive documents at rest.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Multi-layer OCR text extraction with cross-field discrepancy checks.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
              <span>pyHanko CMS digital signatures &amp; Ed25519 sealed QR envelopes.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Append-only SHA-256 digest-chained audit ledger.</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Demonstration Scope</p>
            <p className="mt-1 leading-relaxed">
              {meta?.disclaimer ??
                "Prototype demonstration. All institutions, instruments, clearances, and bank responses are synthetic."}
            </p>
          </div>
        </div>

        {/* Right Column: 1-Click Fast Access & Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick 1-Click Access Card */}
          <div className="glass-dark rounded-2xl p-6 border border-teal-500/30 shadow-xl shadow-teal-500/5">
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-teal-400" />
                <h2 className="text-base font-bold text-white">Instant 1-Click Role Login</h2>
              </div>
              <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                Zero Typing Needed
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Click any role below to authenticate instantly and launch directly into that workspace:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.slice(0, 4).map((account) => (
                <button
                  key={account.email}
                  type="button"
                  disabled={submitting || oneClickEmail !== null}
                  onClick={() => onOneClick(account)}
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/50 transition-all text-left group flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-teal-300">
                        {account.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-400 mt-0.5">{account.division}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{account.email}</p>
                  </div>
                  {oneClickEmail === account.email ? (
                    <RefreshCw className="size-4 animate-spin text-teal-300" />
                  ) : (
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all" />
                  )}
                </button>
              ))}
            </div>

            {/* Other clearance roles toggle */}
            <details className="mt-4 text-xs group">
              <summary className="cursor-pointer text-slate-400 hover:text-teal-300 font-medium list-none flex items-center gap-1.5">
                <span className="underline decoration-dotted">View More Clearance &amp; Submitter Personas (5 more)</span>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                {DEMO_ACCOUNTS.slice(4).map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    disabled={submitting || oneClickEmail !== null}
                    onClick={() => onOneClick(account)}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium text-white">{account.role}</p>
                      <p className="text-[10px] text-slate-400">{account.division}</p>
                    </div>
                    {oneClickEmail === account.email ? (
                      <RefreshCw className="size-3.5 animate-spin text-teal-300" />
                    ) : (
                      <ArrowRight className="size-3 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </details>
          </div>

          {/* Standard Form Card */}
          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="size-4 text-slate-400" />
              <span>Custom Sign In</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Or sign in with any registered institutional or official email.
            </p>

            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  placeholder="name@aicte.demo"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <p>AICTE Security Deposit &amp; FDR Management System (SIH26265)</p>
      </footer>
    </div>
  );
}
