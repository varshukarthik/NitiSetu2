// Main Landing Page styled with the authoritative AICTE government fintech aesthetic.
// Matching the light palette, architectural backdrop, dual branding, and 1-click role logins.

import {
  ArrowRight,
  Building,
  CheckCircle2,
  FileCode,
  Fingerprint,
  GraduationCap,
  Layers,
  Lock,
  LogOut,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSession } from "../lib/auth/session";

interface QuickRole {
  title: string;
  roleTag: string;
  email: string;
  institutionOrBureau: string;
  description: string;
  icon: typeof User;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  badgeTone: string;
  workspacePath: string;
}

const QUICK_ROLES: QuickRole[] = [
  {
    title: "AICTE Scrutiny Officer",
    roleTag: "Official Scrutiny",
    email: "scrutiny@aicte.demo",
    institutionOrBureau: "South & West Regional Bureaus",
    description:
      "Review FDR submissions, inspect optical discrepancy heatmaps, and evaluate simulated bank verification responses.",
    icon: User,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    cardBg: "bg-blue-50/40 hover:bg-white",
    badgeTone: "bg-blue-100 text-blue-800 border-blue-200",
    workspacePath: "/official/overview",
  },
  {
    title: "Competent Authority",
    roleTag: "Release Approver",
    email: "supervisor@aicte.demo",
    institutionOrBureau: "AICTE Regulation Bureau",
    description:
      "Inspect multi-bureau clearances (Finance, PGRC, Vigilance) and digitally authorize tripartite FDR discharges.",
    icon: Building,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    cardBg: "bg-emerald-50/40 hover:bg-white",
    badgeTone: "bg-emerald-100 text-emerald-800 border-emerald-200",
    workspacePath: "/official/overview",
  },
  {
    title: "Institution Submitter",
    roleTag: "Coastal Institute",
    email: "submitter@coastal.demo",
    institutionOrBureau: "AICTE Permanent ID: 1-102938475",
    description:
      "Submit fresh security deposits, upload bank FDR certificates, track scrutiny progress, and request releases.",
    icon: GraduationCap,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    cardBg: "bg-purple-50/40 hover:bg-white",
    badgeTone: "bg-purple-100 text-purple-800 border-purple-200",
    workspacePath: "/institution/overview",
  },
  {
    title: "Security Administrator",
    roleTag: "Cryptographic Custodian",
    email: "admin@aicte.demo",
    institutionOrBureau: "Audit & Risk Governance",
    description:
      "Verify SHA-256 append-only ledger integrity, inspect rule version manifests, and manage system telemetry.",
    icon: Settings,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    cardBg: "bg-amber-50/40 hover:bg-white",
    badgeTone: "bg-amber-100 text-amber-800 border-amber-200",
    workspacePath: "/admin/overview",
  },
];

export function HomePage() {
  const { session, signIn, signOut } = useSession();
  const navigate = useNavigate();
  const [loggingInEmail, setLoggingInEmail] = useState<string | null>(null);

  async function handleQuickLaunch(email: string, targetPath: string) {
    if (loggingInEmail !== null) return;
    setLoggingInEmail(email);
    try {
      await signIn(email, "Demo@12345");
      navigate(targetPath, { replace: true });
    } catch {
      navigate("/login", { state: { prefillEmail: email } });
    } finally {
      setLoggingInEmail(null);
    }
  }

  const workspaceUrl =
    session?.workspace === "institution"
      ? "/institution/overview"
      : session?.workspace === "admin"
        ? "/admin/overview"
        : "/official/overview";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#edf2f9] to-[#e4ecf7] text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Architectural Illustrations */}
      <img
        src="/assets/aicte-building-left.png"
        alt="AICTE Bhavan Artwork Left"
        className="absolute top-48 -left-10 w-80 sm:w-96 lg:w-[480px] pointer-events-none opacity-25 mix-blend-multiply select-none"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <img
        src="/assets/aicte-building-right.png"
        alt="AICTE Bhavan Artwork Right"
        className="absolute top-48 -right-10 w-80 sm:w-96 lg:w-[480px] pointer-events-none opacity-25 mix-blend-multiply select-none"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Brand with Dual Emblem */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="size-5.5 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  NIDHISETU
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  AICTE Security Deposit Portal
                </p>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-200" />

            <div className="hidden sm:flex items-center">
              <img
                src="/assets/aicte-logo-full.png"
                alt="AICTE Official Emblem"
                className="h-9 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Core Architecture
            </a>
            <a href="#quick-roles" className="hover:text-blue-600 transition-colors">
              Roles &amp; Access
            </a>
            <a href="#forensics" className="hover:text-blue-600 transition-colors">
              Discrepancy Radar
            </a>
            <a href="#security" className="hover:text-blue-600 transition-colors">
              Audit Ledger
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SIH26265 Environment Active</span>
            </div>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  to={workspaceUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>My Workspace ({session.display_name.split(" ")[0]})</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Login / Sign In</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="size-3.5 text-blue-600" />
          <span>Statutory Security Deposit &amp; FDR Management Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.18] text-slate-900">
          Secure Deposits. Smarter Decisions.{" "}
          <span className="text-[#2563EB]">Complete Accountability.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          AICTE institutional security deposit governance engineered for regulatory rigor. Real-time multi-layer OCR discrepancy scrutiny, pyHanko CMS digital signatures, multi-vector duplicate radar, and append-only SHA-256 hash-chained audit integrity.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <span>Access Portal</span>
            <ArrowRight className="size-4" />
          </Link>

          <a
            href="#quick-roles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-xs transition-all"
          >
            <Users className="size-4 text-blue-600" />
            <span>1-Click Role Logins</span>
          </a>

          <Link
            to="/help"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors text-xs font-semibold"
          >
            <FileCode className="size-4 text-slate-400" />
            <span>Statutory Regulations &amp; Guide</span>
          </Link>
        </div>

        {/* Live System Stat Cards (Matching Overview KPI Style) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 text-left">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Active Deposits Tracked</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tabular leading-none">₹95.40+ Cr</p>
            <p className="mt-2 text-xs text-blue-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-blue-500" /> 100% Encrypted at Rest
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Registered Bodies</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tabular leading-none">4 Key Entities</p>
            <p className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Building className="size-3.5" /> Coastal, Highland, Apex, Metro
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Audit Ledger Hash</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">SHA-256</p>
            <p className="mt-2 text-xs text-purple-600 font-semibold flex items-center gap-1">
              <Fingerprint className="size-3.5 text-purple-500" /> Append-Only Immutable
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Optical Scrutiny Engine</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">3-Way OCR</p>
            <p className="mt-2 text-xs text-amber-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-amber-500" /> Tesseract + PyMuPDF + RegEx
            </p>
          </div>
        </div>
      </section>

      {/* 1-Click Role Login Showcase (Matching Login Page Style) */}
      <section id="quick-roles" className="relative z-10 py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Zap className="size-3.5 text-blue-600" />
            <span>Interactive Demonstration Environment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Experience Every Stakeholder Lens
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Select any official or institutional persona below for immediate, 1-click authentication without typing credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_ROLES.map((role) => {
            const RoleIcon = role.icon;
            const isLoggingIn = loggingInEmail === role.email;

            return (
              <div
                key={role.email}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${role.badgeTone}`}>
                      {role.roleTag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Demo@12345</span>
                  </div>

                  <div className="flex items-center gap-2.5 mt-2">
                    <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${role.iconBg} ${role.iconColor}`}>
                      <RoleIcon className="size-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-[10px] text-blue-600 font-semibold">{role.institutionOrBureau}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={loggingInEmail !== null}
                    onClick={() => handleQuickLaunch(role.email, role.workspacePath)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#2563EB] text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 font-bold text-xs transition-all shadow-xs"
                  >
                    {isLoggingIn ? (
                      <RefreshCw className="size-3.5 animate-spin text-blue-600" />
                    ) : (
                      <>
                        <span>Launch as {role.title.split(" ")[0]}</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Architecture & Trust Framework */}
      <section id="features" className="relative z-10 py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-3">
            <Layers className="size-3.5 text-blue-600" />
            <span>Built to SIH26265 Technical Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Statutory Security Architecture
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Four foundational cryptographic and optical scrutiny guarantees protecting government custody.
          </p>
        </div>

        {/* 4 Pillars Matching Bottom Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Lock className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Encrypted Vault</h3>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">AES-256-GCM Secure Storage</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Every document is encrypted client-side before S3/local vault storage with unique IVs and authenticated tags, eliminating plain-text credential leaks.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <Sparkles className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Smart OCR Radar</h3>
            <p className="text-xs font-semibold text-purple-600 mt-0.5">Multi-Layer Text Extraction</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Cross-validates declared FDR number, lien beneficiary, amount, and maturity date against certificate text with visual discrepancy highlights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Digital Signatures</h3>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">pyHanko CMS &amp; Ed25519</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              RFC 3161 cryptographic timestamping and high-density 2D QR envelope decoding to verify bank authenticity and seal against tampering.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Shield className="size-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tamper Evident</h3>
            <p className="text-xs font-semibold text-rose-600 mt-0.5">Append-Only Audit Ledger</p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Continuous SHA-256 digest chaining linking every action, scrutiny review, and tripartite release authorization into an immutable ledger.
            </p>
          </div>
        </div>

        {/* Multi-Bureau Tripartite Release Section */}
        <div id="forensics" className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
                Statutory Release Gateways
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Multi-Bureau Tripartite Clearance Matrix
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Security deposits cannot be unpledged or refunded unilaterally. Release cases enforce independent clearances across all relevant statutory divisions before the Competent Authority can digitally authorize a discharge.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-bold text-slate-900">Finance Bureau:</span> Verified interest accruals &amp; account reconciliation.
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-bold text-slate-900">Public Grievance Redressal (PGRC):</span> Zero pending student fee or salary disputes.
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-bold text-slate-900">Vigilance Division:</span> Clean standing with no open inquiries or show-cause notices.
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span>SIMULATED_LEDGER_CHAIN</span>
                <span className="text-emerald-400 font-semibold">VERIFIED_STABLE</span>
              </div>
              <div className="mt-3 space-y-2.5 font-mono text-[11px] text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <p className="text-blue-300 font-semibold">[BLOCK #0849] FDR_CREATION</p>
                  <p className="text-slate-400 text-[10px] truncate">PrevHash: 7f8a9e01bc...48a2 &bull; Hash: 99c301ab42...f01d</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <p className="text-purple-300 font-semibold">[BLOCK #0850] OCR_EXTRACTION_MATCH</p>
                  <p className="text-slate-400 text-[10px] truncate">PrevHash: 99c301ab42...f01d &bull; Hash: a1b2c3d4e5...6789</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <p className="text-emerald-300 font-semibold">[BLOCK #0851] TRIPARTITE_CLEARANCE_PASSED</p>
                  <p className="text-slate-400 text-[10px] truncate">PrevHash: a1b2c3d4e5...6789 &bull; Hash: edf0123456...7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <ShieldCheck className="size-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">NIDHISETU (KoshSetu)</p>
              <p className="text-[10px] text-slate-400">All India Council for Technical Education &bull; SIH26265</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400 max-w-lg">
            Demonstration prototype. All institutions, instruments, clearances and bank responses are synthetic.
            Bank verification is simulated and does not move funds. AES-256-GCM vault active.
          </div>
        </div>
      </footer>
    </div>
  );
}
