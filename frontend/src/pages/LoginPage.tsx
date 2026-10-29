// Sign-in page matching the exact design specification:
// Light aesthetic, AICTE building backdrop, dual NIDHISETU & AICTE logos,
// 4-card 1-click role login grid with pastel badges, icon inputs, and bottom trust indicators.

import {
  ArrowLeft,
  ArrowRight,
  Building,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
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
  iconBg: string;
  iconColor: string;
  cardBg: string;
  borderHover: string;
}

const ROLES: OneClickRole[] = [
  {
    title: "AICTE Scrutiny Officer",
    subtitle: "South & West Regional Bureaus",
    email: "scrutiny@aicte.demo",
    target: "/official/overview",
    icon: User,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    cardBg: "bg-blue-50/30 hover:bg-white",
    borderHover: "hover:border-blue-400 hover:shadow-sm",
  },
  {
    title: "Competent Authority",
    subtitle: "Release Approver (Tripartite)",
    email: "supervisor@aicte.demo",
    target: "/official/overview",
    icon: Building,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    cardBg: "bg-emerald-50/30 hover:bg-white",
    borderHover: "hover:border-emerald-400 hover:shadow-sm",
  },
  {
    title: "Institution Submitter",
    subtitle: "Submit Deposits & Documents",
    email: "submitter@coastal.demo",
    target: "/institution/overview",
    icon: GraduationCap,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    cardBg: "bg-purple-50/30 hover:bg-white",
    borderHover: "hover:border-purple-400 hover:shadow-sm",
  },
  {
    title: "Security Administrator",
    subtitle: "Cryptographic Custodian",
    email: "admin@aicte.demo",
    target: "/admin/overview",
    icon: Settings,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    cardBg: "bg-amber-50/30 hover:bg-white",
    borderHover: "hover:border-amber-400 hover:shadow-sm",
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
          : "Sign-in could not be completed. Please try one of the 1-click role logins.",
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
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#edf2f9] to-[#e4ecf7] text-slate-800 relative overflow-hidden flex flex-col justify-between py-6 px-4 selection:bg-blue-600 selection:text-white">
      {/* Background Architectural Illustrations */}
      <img
        src="/assets/aicte-building-left.png"
        alt="AICTE Bhavan Artwork Left"
        className="absolute bottom-0 -left-6 w-72 sm:w-96 lg:w-[480px] pointer-events-none opacity-35 mix-blend-multiply select-none"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <img
        src="/assets/aicte-building-right.png"
        alt="AICTE Bhavan Artwork Right"
        className="absolute bottom-0 -right-6 w-72 sm:w-96 lg:w-[480px] pointer-events-none opacity-35 mix-blend-multiply select-none"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Top Bar Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between relative z-20 mb-4 sm:mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="size-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Page</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SIH26265 Environment Active</span>
        </div>
      </header>

      {/* Central Floating White Card */}
      <main className="relative z-20 max-w-[690px] w-full mx-auto my-auto">
        <div className="bg-white rounded-[26px] border border-slate-200/90 shadow-2xl shadow-blue-950/8 p-6 sm:p-9 transition-all">
          {/* Card Top: Dual Logos (NIDHISETU + AICTE) */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 gap-4">
            {/* Left: NidhiSetu Brand */}
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-slate-900/5 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/assets/nidhisetu-logo.png"
                  alt="NidhiSetu Shield Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                  NidhiSetu
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  AICTE Security Deposit Portal
                </p>
              </div>
            </div>

            {/* Right: AICTE Emblem */}
            <div className="flex items-center gap-2 text-right">
              <img
                src="/assets/aicte-logo-full.png"
                alt="AICTE Official Logo"
                className="h-10 object-contain"
                onError={(e) => {
                  // Fallback HTML logo if image fails
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center pt-6 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome <span className="text-[#2563EB]">Back</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to access the Security Deposit &amp; FDR Management Portal
            </p>
          </div>

          {/* 1-Click Role Login Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                <h2 className="text-xs font-bold text-slate-800">Instant 1-Click Role Login</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                <Zap className="size-3 text-blue-500" />
                <span>Zero Typing Needed</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLES.map((role) => {
                const RoleIcon = role.icon;
                const isLoggingIn = oneClickEmail === role.email;

                return (
                  <button
                    key={role.email}
                    type="button"
                    disabled={submitting || oneClickEmail !== null}
                    onClick={() => onOneClick(role)}
                    className={`p-2.5 rounded-xl border border-slate-200/90 text-left transition-all flex items-center justify-between gap-2 group ${role.cardBg} ${role.borderHover}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${role.iconBg} ${role.iconColor}`}
                      >
                        <RoleIcon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 flex items-center gap-1">
                          <span>{role.title}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-blue-600">&rarr;</span>
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                          {role.subtitle}
                        </p>
                      </div>
                    </div>

                    {isLoggingIn && (
                      <RefreshCw className="size-3.5 animate-spin text-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-semibold text-slate-400">
              <span className="bg-white px-3">Or</span>
            </div>
          </div>

          {/* Custom Sign In Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <KeyRound className="size-4 text-slate-500" />
              <span>Custom Sign In</span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2">
              Or sign in with any registered institutional or official email.
            </p>

            <form onSubmit={onSubmit} className="space-y-3.5">
              {/* Work Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@aicte.demo"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setPassword(DEMO_PASSWORD);
                    setEmail("scrutiny@aicte.demo");
                  }}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || oneClickEmail !== null}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Signing In...</span>
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

      {/* Bottom 4 Trust / Security Badges Row */}
      <footer className="relative z-20 max-w-4xl w-full mx-auto mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          {/* Badge 1: Encrypted Vault */}
          <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 p-2.5 flex items-center gap-2.5 shadow-xs">
            <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Encrypted Vault</p>
              <p className="text-[10px] text-slate-400 mt-0.5">AES-256-GCM secure storage</p>
            </div>
          </div>

          {/* Badge 2: Smart OCR */}
          <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 p-2.5 flex items-center gap-2.5 shadow-xs">
            <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Smart OCR</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Multi-layer text extraction</p>
            </div>
          </div>

          {/* Badge 3: Digital Signatures */}
          <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 p-2.5 flex items-center gap-2.5 shadow-xs">
            <div className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Digital Signatures</p>
              <p className="text-[10px] text-slate-400 mt-0.5">pyHanko CMS &amp; Ed25519</p>
            </div>
          </div>

          {/* Badge 4: Tamper Evident */}
          <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 p-2.5 flex items-center gap-2.5 shadow-xs">
            <div className="size-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Tamper Evident</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Append-only audit ledger</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
