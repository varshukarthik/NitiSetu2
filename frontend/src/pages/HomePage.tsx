import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileCode,
  Fingerprint,
  Layers,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
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
    badgeTone: "bg-teal-500/20 text-teal-300 ring-teal-400/30",
    workspacePath: "/official/overview",
  },
  {
    title: "Competent Authority",
    roleTag: "Release Approver",
    email: "supervisor@aicte.demo",
    institutionOrBureau: "AICTE Regulation Bureau",
    description:
      "Inspect multi-bureau clearances (Finance, PGRC, Vigilance) and grant cryptographic release authorizations.",
    badgeTone: "bg-indigo-500/20 text-indigo-300 ring-indigo-400/30",
    workspacePath: "/official/overview",
  },
  {
    title: "Institution Submitter",
    roleTag: "Coastal Institute",
    email: "submitter@coastal.demo",
    institutionOrBureau: "AICTE Permanent ID: 1-102938475",
    description:
      "Submit fresh security deposits, upload bank FDR certificates, track scrutiny progress, and request releases.",
    badgeTone: "bg-amber-500/20 text-amber-300 ring-amber-400/30",
    workspacePath: "/institution/overview",
  },
  {
    title: "Security Administrator",
    roleTag: "Cryptographic Custodian",
    email: "admin@aicte.demo",
    institutionOrBureau: "Audit & Risk Governance",
    description:
      "Verify SHA-256 append-only ledger integrity, inspect rule version manifests, and manage system telemetry.",
    badgeTone: "bg-emerald-500/20 text-emerald-300 ring-emerald-400/30",
    workspacePath: "/admin/overview",
  },
];

export function HomePage() {
  const { session, signIn, signOut } = useSession();
  const navigate = useNavigate();
  const [loggingInEmail, setLoggingInEmail] = useState<string | null>(null);

  async function handleQuickLaunch(email: string, targetPath: string) {
    setLoggingInEmail(email);
    try {
      await signIn(email, "Demo@12345");
      navigate(targetPath);
    } catch {
      // If direct login fails, fallback to login page with prefill
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
    <div className="min-h-screen bg-[#0d1726] text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 size-[550px] rounded-full bg-brand/20 blur-[130px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-teal-500/15 blur-[150px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 left-1/4 size-[500px] rounded-full bg-indigo-600/15 blur-[140px] animate-pulse-glow" style={{ animationDelay: "4s" }} />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/40 shadow-lg shadow-teal-500/10">
              <ShieldCheck className="size-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">NIDHISETU</span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-teal-400/10 px-2 py-0.5 text-[11px] font-semibold text-teal-300 ring-1 ring-teal-400/30">
                  SIH26265
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AICTE Security Deposit &amp; FDR Management Portal
              </p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-300 transition-colors">
              Core Architecture
            </a>
            <a href="#quick-roles" className="hover:text-teal-300 transition-colors">
              Roles &amp; Access
            </a>
            <a href="#forensics" className="hover:text-teal-300 transition-colors">
              Discrepancy Radar
            </a>
            <a href="#security" className="hover:text-teal-300 transition-colors">
              Audit Ledger
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>System Operational</span>
            </div>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  to={workspaceUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-teal-500/20"
                >
                  <span>My Workspace ({session.display_name.split(" ")[0]})</span>
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-teal-500/20 hover:scale-[1.02]"
              >
                <span>Login / Sign In</span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 animate-float">
          <Sparkles className="size-3.5 text-teal-400" />
          <span>Next-Generation AICTE Statutory Deposit Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Secure Deposits. Smarter Decisions.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300">
            Complete Accountability.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          AICTE institutional security deposit governance engineered for regulatory rigor. Real-time multi-layer OCR discrepancy detection, pyHanko CMS digital signature verification, multi-vector duplicate radar, and append-only SHA-256 hash-chained audit trails.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-teal-500/25 hover:scale-105"
          >
            <span>Access Portal</span>
            <ArrowRight className="size-5" />
          </Link>

          <a
            href="#quick-roles"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition-all hover:scale-105"
          >
            <Users className="size-5 text-teal-300" />
            <span>1-Click Role Logins</span>
          </a>

          <Link
            to="/help"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <FileCode className="size-4 text-slate-400" />
            <span>Statutory Regulations &amp; Guide</span>
          </Link>
        </div>

        {/* Live System Stat Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="glass-dark rounded-2xl p-5 border border-white/10 hover:border-teal-500/40 transition-all shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Deposits Tracked</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tabular">₹95.40+ Cr</p>
            <p className="mt-1 text-xs text-teal-300 flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-teal-400" /> 100% Encrypted at Rest
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Registered Institutions</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tabular">4 Key Bodies</p>
            <p className="mt-1 text-xs text-indigo-300 flex items-center gap-1">
              <Building2Icon className="size-3.5" /> Coastal, Highland, Apex, Metro
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-5 border border-white/10 hover:border-teal-500/40 transition-all shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Audit Ledger Hash</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">SHA-256</p>
            <p className="mt-1 text-xs text-teal-300 flex items-center gap-1">
              <Fingerprint className="size-3.5 text-teal-400" /> Append-Only Immutable
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Optical Scrutiny Engine</p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">3-Way OCR</p>
            <p className="mt-1 text-xs text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-400" /> Tesseract + PyMuPDF + RegEx
            </p>
          </div>
        </div>
      </section>

      {/* 1-Click Role Login Showcase */}
      <section id="quick-roles" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <UserCheck className="size-3.5" />
            <span>Interactive Demonstration Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Experience Every Stakeholder Lens
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Select any official or institutional persona below for immediate, 1-click authentication without typing credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_ROLES.map((role) => (
            <div
              key={role.email}
              className="glass-dark rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${role.badgeTone}`}>
                    {role.roleTag}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Demo@12345</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">{role.email}</p>
                <p className="text-xs text-teal-400 font-medium mt-1">{role.institutionOrBureau}</p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  disabled={loggingInEmail !== null}
                  onClick={() => handleQuickLaunch(role.email, role.workspacePath)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-200 hover:text-slate-950 border border-teal-500/40 font-semibold text-xs transition-all shadow-sm group-hover:scale-[1.02]"
                >
                  {loggingInEmail === role.email ? (
                    <RefreshCw className="size-4 animate-spin text-teal-300" />
                  ) : (
                    <>
                      <span>Launch as {role.title.split(" ")[0]}</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Architecture & Forensics Section */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
            <Layers className="size-3.5" />
            <span>Built to SIH26265 Technical Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Comprehensive Statutory Security Architecture
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Every layer from physical certificate ingestion to tripartite release approval is guarded by explainable algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="size-11 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-4 ring-1 ring-teal-400/30">
              <Search className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Explainable Optical Discrepancy Radar</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Compares declared values against scanned certificate text across 6 critical dimensions: FDR Number, Beneficiary Lien, Amount, Maturity Date, IFSC, and Bank Branch. Highlights mismatches directly in an interactive PDF viewer.
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="size-11 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 ring-1 ring-indigo-400/30">
              <Fingerprint className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">pyHanko CMS &amp; Ed25519 QR Envelope</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Validates digital signature certificates (RFC 3161 timestamps, Adobe CMS signatures) and decodes high-density Ed25519 sealed QR codes to detect paper alteration or counterfeit stamps instantly.
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="size-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 ring-1 ring-emerald-400/30">
              <Database className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Append-Only SHA-256 Audit Trail</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Every submission, document upload, scrutiny observation, and release sign-off writes an immutable record with a continuous cryptographic hash chain. Any tampering causes an instant integrity alarm.
            </p>
          </div>
        </div>

        {/* Multi-Bureau Tripartite Release Section */}
        <div id="forensics" className="mt-12 glass-dark rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30 mb-4">
                Statutory Release Gateways
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Multi-Bureau Tripartite Clearance Matrix
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Security deposits cannot be unpledged or refunded unilaterally. Release cases enforce independent clearances across all relevant statutory divisions before the Competent Authority can digitally authorize a discharge.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="size-2 rounded-full bg-teal-400" />
                  <span className="font-semibold text-white">Finance Bureau:</span> Verified interest accruals &amp; account reconciliation.
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="size-2 rounded-full bg-teal-400" />
                  <span className="font-semibold text-white">Public Grievance Redressal (PGRC):</span> Zero pending student fee or salary disputes.
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="size-2 rounded-full bg-teal-400" />
                  <span className="font-semibold text-white">Vigilance Division:</span> Clean standing with no open inquiries or show-cause notices.
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-slate-400">
                <span>SIMULATED_LEDGER_CHAIN</span>
                <span className="text-emerald-400 font-semibold">VERIFIED_STABLE</span>
              </div>
              <div className="mt-4 space-y-3 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-teal-300 font-semibold">[BLOCK #0849] FDR_CREATION</p>
                  <p className="text-slate-400 text-[11px] truncate">PrevHash: 7f8a9e01bc...48a2 • Hash: 99c301ab42...f01d</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-indigo-300 font-semibold">[BLOCK #0850] OCR_EXTRACTION_MATCH</p>
                  <p className="text-slate-400 text-[11px] truncate">PrevHash: 99c301ab42...f01d • Hash: a1b2c3d4e5...6789</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-emerald-300 font-semibold">[BLOCK #0851] TRIPARTITE_CLEARANCE_PASSED</p>
                  <p className="text-slate-400 text-[11px] truncate">PrevHash: a1b2c3d4e5...6789 • Hash: edf0123456...7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Vault Compliance */}
      <section id="security" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="glass-dark rounded-3xl p-8 sm:p-12 border border-teal-500/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock className="size-48 text-teal-300" />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 ring-1 ring-emerald-500/40">
              <ShieldCheck className="size-4" />
              <span>Government-Grade Cryptographic Storage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Explore NIDHISETU?
            </h2>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Experience the end-to-end prototype with pre-populated synthetic instruments, interactive OCR workbench, and tamper-evident audit history.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-teal-500/30 hover:scale-105"
              >
                <span>Launch Portal Sign In</span>
                <ArrowRight className="size-5" />
              </Link>

              <Link
                to="/help"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
              >
                <span>System Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 py-10 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 ring-1 ring-teal-400/40">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-white">NIDHISETU (KoshSetu)</p>
              <p className="text-[11px]">AICTE Regulation Bureau • SIH26265 Prototype</p>
            </div>
          </div>

          <div className="text-center md:text-right max-w-xl text-[11px] leading-relaxed text-slate-400">
            Demonstration prototype. All institutions, instruments, clearances and bank responses are synthetic.
            Bank verification is simulated and does not move funds. AES-256-GCM vault active.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
