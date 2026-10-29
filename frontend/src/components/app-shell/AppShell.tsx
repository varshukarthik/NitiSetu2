// Application shell matching the portal UI design.
// Dark navy sidebar with KoshSetu branding, monument bottom card,
// integrated top bar with environment pills, search, notification counter, and user profile.

import {
  ArrowRight,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useUnreadCount } from "../../lib/api/hooks";
import { useSession } from "../../lib/auth/session";
import { titleCase } from "../../lib/format";
import { navigationFor } from "./navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, signOut, meta } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unread = useUnreadCount();

  useEffect(() => {
    setDrawerOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  if (!session) return null;

  const sections = navigationFor(session.workspace);
  const searchBase = session.workspace === "institution" ? "/institution/fdrs" : "/official/fdrs";
  const notificationsPath =
    session.workspace === "institution" ? "/institution/notifications" : "/official/notifications";

  // Derive initial from display name or role
  const userInitial = session.display_name ? session.display_name.charAt(0).toUpperCase() : "S";

  const navigation = (
    <nav aria-label="Primary navigation" className="space-y-6 px-3 py-4">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {section.heading}
          </p>
          <ul className="space-y-1">
            {section.items
              .filter((item) => !item.capability || session.capabilities.includes(item.capability))
              .map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to.endsWith("/new") || item.to.endsWith("overview")}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <item.icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badgeKey === "notifications" && (
                      <span className="rounded-full bg-[#f97316] px-1.5 py-0.2 text-[10px] font-bold text-white shadow-sm">
                        {unread.data?.unread ?? 16}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fc] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Portal sections"
        className="hidden min-h-screen flex-col bg-[#0B132B] text-white lg:flex border-r border-slate-800/60"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-white font-sans">KoshSetu</p>
            <p className="truncate text-[10px] text-slate-400">Security deposit &amp; FDR portal</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto">{navigation}</div>

        {/* Sidebar Bottom Monument Card */}
        <div className="p-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#162544] to-[#0d172a] p-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg overflow-hidden bg-slate-900/60 border border-white/10 flex items-center justify-center shrink-0">
                <img
                  src="/assets/sidebar-monument.png"
                  alt="AICTE Monument"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Secure Deposits</p>
                <p className="text-[10px] text-slate-300">Transparent Governance</p>
              </div>
            </div>

            <Link
              to="/official/fdrs"
              className="size-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition-colors"
              title="View all deposits"
            >
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex w-72 max-w-[85%] flex-col bg-[#0B132B] text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Portal sections"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-blue-400" />
                <span className="text-sm font-bold tracking-tight text-white">KoshSetu</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navigation}</div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-black/60 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}

      {/* Right Content Area */}
      <div className="flex min-w-0 flex-col">
        {/* Unified Top Bar Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-2 sm:px-6 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Demo Environment Pills */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-4" />
                <span className="sr-only">Open navigation</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-orange-100 text-orange-800 border border-orange-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {meta?.environment === "production" ? "Restricted" : "Demo Environment"}
                </span>
                <span className="rounded bg-orange-100 text-orange-800 border border-orange-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Bank: Simulated
                </span>
                <span className="hidden xl:inline text-xs text-slate-500 truncate max-w-md">
                  Simulated bank responses and synthetic records. Not connected to any bank or AICTE production system.
                </span>
              </div>
            </div>

            {/* Right: Search, Notification Bell & User Pill */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Search input */}
              <form
                role="search"
                className="hidden md:flex items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate(`${searchBase}?q=${encodeURIComponent(search)}`);
                }}
              >
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400"
                  />
                  <input
                    id="global-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search institution, AICTE id, bank, instrument..."
                    className="w-64 lg:w-80 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8.5 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </form>

              {/* Notification Bell */}
              <Link
                to={notificationsPath}
                className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell aria-hidden="true" className="size-4.5" />
                <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {unread.data?.unread ?? 16}
                </span>
              </Link>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="size-8.5 rounded-full bg-[#3b82f6] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {userInitial}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {session.display_name || "Scrutiny Officer (Regulatory)"}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {session.roles.map((r) => titleCase(r)).join(", ") || "Scrutiny Officer"}
                    </p>
                  </div>
                  <ChevronDown className="size-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                    <div className="p-2 border-b border-slate-100 sm:hidden">
                      <p className="text-xs font-bold text-slate-800">{session.display_name}</p>
                      <p className="text-[10px] text-slate-500">{session.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut().then(() => navigate("/"))}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
