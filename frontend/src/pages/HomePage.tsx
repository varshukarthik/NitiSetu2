// Landing Page: Unslopped statutory design.
// Calm, authoritative layout, asymmetric hero with authentic product preview,
// uniform persona access cards, and clean statutory architecture.

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
  ShieldCheck,
  User,
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
  workspacePath: string;
}

const QUICK_ROLES: QuickRole[] = [
  {
    title: "Scrutiny Officer",
    roleTag: "Official Review",
    email: "scrutiny@aicte.demo",
    institutionOrBureau: "South & West Regional Bureaus",
    description:
      "Review submitted FDR certificates, evaluate optical extraction discrepancies, and verify declared banking parameters.",
    icon: User,
    workspacePath: "/official/overview",
  },
  {
    title: "Competent Authority",
    roleTag: "Statutory Approver",
    email: "supervisor@aicte.demo",
    institutionOrBureau: "Regulation Bureau",
    description:
      "Inspect multi-bureau clearances from Finance, PGRC, and Vigilance to digitally authorize tripartite FDR discharges.",
    icon: Building,
    workspacePath: "/official/overview",
  },
  {
    title: "Institution Submitter",
    roleTag: "Technical College",
    email: "submitter@coastal.demo",
    institutionOrBureau: "Coastal Institute of Technology",
    description:
      "Submit fresh security deposits, upload digitized bank FDR certificates, track scrutiny progress, and file renewals.",
    icon: GraduationCap,
    workspacePath: "/institution/overview",
  },
  {
    title: "Security Administrator",
    roleTag: "Audit Custodian",
    email: "admin@aicte.demo",
    institutionOrBureau: "Risk & Ledger Governance",
    description:
      "Inspect continuous SHA-256 hash chaining, verify rule catalog versions, and examine system audit telemetry.",
    icon: Settings,
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-slate-800 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
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
                <p className="text-[10px] text-slate-400 mt-0.5">
                  AICTE Security Deposit Portal
                </p>
              </div>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-slate-200" />

            <div className="hidden sm:flex items-center">
              <img
                src="/assets/aicte-logo-full.png"
                alt="AICTE Official Emblem"
                className="h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Core architecture
            </a>
            <a href="#quick-roles" className="hover:text-slate-900 transition-colors">
              Stakeholder roles
            </a>
            <a href="#clearances" className="hover:text-slate-900 transition-colors">
              Tripartite matrix
            </a>
            <a href="#ledger" className="hover:text-slate-900 transition-colors">
              Audit trail
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-500">
              SIH26265 Active
            </span>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  to={workspaceUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                >
                  <span>Open workspace ({session.display_name.split(" ")[0]})</span>
                  <ArrowRight className="size-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                <span>Sign in</span>
                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section: Asymmetric Split with Authentic Product Preview */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left Hero Content */}
          <div className="text-left max-w-2xl">
            <p className="text-xs font-medium text-slate-500 mb-2">
              All India Council for Technical Education &bull; Regulation Bureau
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.12]">
              Institutional security deposit management for technical education
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Statutory deposit lifecycle governance for AICTE. Real-time OCR discrepancy scrutiny, tripartite release clearances across Finance, PGRC, and Vigilance, backed by append-only SHA-256 audit chaining.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                <span>Access portal</span>
                <ArrowRight className="size-3.5" />
              </Link>

              <Link
                to="/help"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
              >
                <FileCode className="size-3.5 text-slate-400" />
                <span>Statutory guidelines</span>
              </Link>
            </div>

            {/* Micro guarantees */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500 font-normal">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-slate-600" />
                <span>Client-side AES-256-GCM vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-slate-600" />
                <span>pyHanko CMS digital signatures</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-slate-600" />
                <span>Continuous hash ledger</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Authentic Live Product Preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-600" />
                <span className="font-medium text-slate-800">Instrument record in register</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">STATE: ACTIVE</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Declared FDR amount</span>
                <span className="text-xl font-semibold text-slate-900 tabular-nums">₹1,75,00,000.00</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <p className="text-slate-400">Institution</p>
                  <p className="font-medium text-slate-800 mt-0.5 truncate">Coastal Institute (1-102938475)</p>
                </div>
                <div>
                  <p className="text-slate-400">Bank &amp; Branch</p>
                  <p className="font-medium text-slate-800 mt-0.5 truncate">Axis Bank &bull; Powai</p>
                </div>
                <div>
                  <p className="text-slate-400">Lien Beneficiary</p>
                  <p className="font-medium text-slate-800 mt-0.5 truncate">AICTE, New Delhi</p>
                </div>
                <div>
                  <p className="text-slate-400">Maturity Window</p>
                  <p className="font-medium text-slate-800 mt-0.5 tabular-nums">Oct 2027 (345 days)</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 rounded bg-slate-50 p-2.5 font-mono text-[10px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>OCR_VERIFICATION</span>
                  <span className="text-emerald-700 font-semibold">MATCH_100%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CHAIN_DIGEST</span>
                  <span className="truncate max-w-[200px]">sha256:7f8a9e01bc...48a2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register Headline Numbers */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Active principal on record</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">₹95.40 Cr</p>
            <p className="mt-1 text-[11px] text-slate-400">Across verified technical institutes</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Registered bodies</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">4 Key institutions</p>
            <p className="mt-1 text-[11px] text-slate-400">Coastal, Highland, Apex, Metro</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Ledger verification</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 font-mono">SHA-256</p>
            <p className="mt-1 text-[11px] text-slate-400">Append-only digest chain</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Document vault security</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">AES-256-GCM</p>
            <p className="mt-1 text-[11px] text-slate-400">Encrypted before physical storage</p>
          </div>
        </div>
      </section>

      {/* Stakeholder Personas / One-Click Launch */}
      <section id="quick-roles" className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="max-w-xl text-left mb-8">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Stakeholder access personas
          </h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Select any official or institutional workspace below to evaluate role-governed capabilities directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ROLES.map((role) => {
            const RoleIcon = role.icon;
            const isLoggingIn = loggingInEmail === role.email;

            return (
              <div
                key={role.email}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between transition-colors hover:border-slate-400"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <span className="text-[11px] font-medium text-slate-600">
                      {role.roleTag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Demo@12345</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <RoleIcon className="size-4 text-slate-500 shrink-0" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      {role.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={loggingInEmail !== null}
                    onClick={() => handleQuickLaunch(role.email, role.workspacePath)}
                    className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-medium text-xs transition-colors"
                  >
                    {isLoggingIn ? (
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="size-3.5 animate-spin" />
                        <span>Authenticating...</span>
                      </span>
                    ) : (
                      <>
                        <span>Open workspace</span>
                        <ArrowRight className="size-3 text-slate-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="features" className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="max-w-xl text-left mb-8">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            Statutory architecture &amp; safeguards
          </h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Engineered to fulfill AICTE Problem Statement SIH26265 specifications without dependency on unverified claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Lock className="size-4 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">Encrypted vault</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Documents are encrypted client-side using AES-256-GCM before object store ingestion. Keys remain strictly within the custody service.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Layers className="size-4 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">Optical discrepancy radar</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Multi-layer OCR compares declared instrument numbers, lien beneficiary, amount, and maturity dates against certificate scans.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <ShieldCheck className="size-4 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">pyHanko CMS verification</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Validates RFC 3161 cryptographic timestamps and Adobe CMS digital signatures to verify issuing bank authenticity and seal against tampering.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Fingerprint className="size-4 text-slate-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">Immutable hash chain</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Continuous SHA-256 digest chaining links every submission, scrutiny observation, and release sign-off into an unalterable audit ledger.
            </p>
          </div>
        </div>

        {/* Tripartite Clearance Matrix */}
        <div id="clearances" className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Release governance</p>
              <h3 className="text-lg font-semibold text-slate-900">
                Multi-bureau tripartite clearance matrix
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Security deposits cannot be unpledged unilaterally. Release cases enforce independent clearance decisions from all relevant statutory divisions before the Competent Authority can digitally sign a discharge order.
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-slate-900" />
                  <span className="font-medium text-slate-900">Finance Bureau:</span>
                  <span className="text-slate-500">Verified interest accruals and account reconciliation.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-slate-900" />
                  <span className="font-medium text-slate-900">PGRC Cell:</span>
                  <span className="text-slate-500">Zero pending student fee or salary grievances.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-slate-900" />
                  <span className="font-medium text-slate-900">Chief Vigilance Officer:</span>
                  <span className="text-slate-500">Clean standing with no active show-cause notices.</span>
                </div>
              </div>
            </div>

            <div id="ledger" className="rounded-lg border border-slate-200 bg-slate-900 text-white p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>LEDGER_DIGEST_CHAIN</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                  <p className="text-slate-200">[BLOCK 0849] FDR_REGISTRATION</p>
                  <p className="text-slate-400 text-[10px] truncate">hash: 99c301ab42...f01d</p>
                </div>
                <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                  <p className="text-slate-200">[BLOCK 0850] OCR_EVIDENCE_MATCH</p>
                  <p className="text-slate-400 text-[10px] truncate">hash: a1b2c3d4e5...6789</p>
                </div>
                <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60">
                  <p className="text-slate-200">[BLOCK 0851] TRIPARTITE_CLEARANCE_PASSED</p>
                  <p className="text-slate-400 text-[10px] truncate">hash: edf0123456...7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-8 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center">
            <img
              src="/assets/nidhisetu-logo.png"
              alt="NidhiSetu Shield Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-medium text-slate-800">NidhiSetu</span>
          <span>&bull;</span>
          <span>AICTE Regulation Bureau (SIH26265)</span>
        </div>

        <p className="text-[11px] text-slate-400">
          Demonstration build with synthetic instruments and simulated bank integration.
        </p>
      </footer>
    </div>
  );
}
