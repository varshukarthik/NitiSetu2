// Sign-in page: Unslopped statutory design.
// Quiet chrome, precise hierarchy, one-click persona access, and government-grade typography.

import {
  ArrowLeft,
  ArrowRight,
  Building,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  RefreshCw,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "../lib/api/client";
import { useSession } from "../lib/auth/session";

interface OneClickRole {
  title: string;
  subtitle: string;
  email: string;
  target: string;
  icon: typeof User;
}

const ROLES: OneClickRole[] = [
  {
    title: "Scrutiny Officer",
    subtitle: "South & West Regional Bureaus",
    email: "scrutiny@aicte.demo",
    target: "/official/overview",
    icon: User,
  },
  {
    title: "Competent Authority",
    subtitle: "Tripartite Release Approver",
    email: "supervisor@aicte.demo",
    target: "/official/overview",
    icon: Building,
  },
  {
    title: "Institution Submitter",
    subtitle: "Deposit & Document Submission",
    email: "submitter@coastal.demo",
    target: "/institution/overview",
    icon: GraduationCap,
  },
  {
    title: "Security Administrator",
    subtitle: "Cryptographic & Audit Custodian",
    email: "admin@aicte.demo",
    target: "/admin/overview",
    icon: Settings,
  },
];

const DEMO_PASSWORD = "Demo@12345";

export function LoginPage() {
  const { session, signIn } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const statePrefill = (location.state as { prefillEmail?: string } | null)?.prefillEmail;
  const [email, setEmail] = useState(statePrefill || "scrutiny@aicte.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      from && from !== "/login"
        ? from
        : session.workspace === "institution"
          ? "/institution/overview"
          : session.workspace === "admin"
            ? "/admin/overview"
            : "/official/overview";
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
          : "Sign-in could not be completed. Please try one of the verified demonstration roles.",
      );
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || oneClickEmail !== null) return;
    setSubmitting(true);
    try {
      await handleAuthenticate(email, password);
    } finally {
      setSubmitting(false);
    }
  }

  async function onOneClick(role: OneClickRole) {
    if (submitting || oneClickEmail !== null) return;
    setOneClickEmail(role.email);
    setEmail(role.email);
    setPassword(DEMO_PASSWORD);
    try {
      await handleAuthenticate(role.email, DEMO_PASSWORD, role.target);
    } finally {
      setOneClickEmail(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between py-8 px-4 selection:bg-slate-800 selection:text-white">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to main portal</span>
        </Link>

        <span className="font-mono text-[11px] text-slate-400">
          SIH26265 Environment
        </span>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-xl w-full mx-auto my-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* Dual Brand Logos */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/assets/nidhisetu-logo.png"
                  alt="NidhiSetu Shield Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight text-slate-900 leading-none">
                  NidhiSetu
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  AICTE Security Deposit Portal
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <img
                src="/assets/aicte-logo-full.png"
                alt="AICTE Official Logo"
                className="h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="pt-6 pb-5">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select a designated stakeholder role or enter your institutional credentials.
            </p>
          </div>

          {/* 1-Click Role Login: Quiet, Neutral, Uniform */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Users className="size-3.5 text-slate-500" />
                <span>One-click role access</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Demo authentication
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROLES.map((role) => {
                const RoleIcon = role.icon;
                const isLoggingIn = oneClickEmail === role.email;

                return (
                  <button
                    key={role.email}
                    type="button"
                    disabled={submitting || oneClickEmail !== null}
                    onClick={() => onOneClick(role)}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-400 text-left transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <RoleIcon className="size-4 text-slate-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">
                          {role.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {role.subtitle}
                        </p>
                      </div>
                    </div>

                    {isLoggingIn ? (
                      <RefreshCw className="size-3.5 animate-spin text-slate-600 shrink-0" />
                    ) : (
                      <ArrowRight className="size-3 text-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiet Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400">
              <span className="bg-white px-3 font-medium">Or enter details</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@aicte.demo"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-slate-800 focus:ring-slate-500 size-3.5"
                />
                <span>Keep signed in for 24 hours</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setEmail("scrutiny@aicte.demo");
                  setPassword(DEMO_PASSWORD);
                }}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Reset demo credentials
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || oneClickEmail !== null}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer mt-1"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Verifying credentials...</span>
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Quiet Statutory Footer */}
      <footer className="max-w-xl w-full mx-auto text-center mt-6 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="size-3 text-slate-400" />
            <span>SHA-256 Chained Ledger</span>
          </span>
          <span>&bull;</span>
          <span>AES-256-GCM Vault</span>
          <span>&bull;</span>
          <span>pyHanko CMS Signatures</span>
        </div>
        <p className="text-[11px] text-slate-400">
          All India Council for Technical Education &bull; Regulation Bureau
        </p>
      </footer>
    </div>
  );
}
