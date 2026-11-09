// Application shell: Unslopped statutory design.
// Quiet graphite navigation rail, crisp top bar, no marketing decoration.

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
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

  const userInitial = session.display_name ? session.display_name.charAt(0).toUpperCase() : "S";

  const navigation = (
    <nav aria-label="Primary navigation" className="space-y-5 px-3 py-4">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 pb-1.5 text-[11px] font-medium text-slate-400">
            {section.heading}
          </p>
          <ul className="space-y-0.5">
            {section.items
              .filter((item) => !item.capability || session.capabilities.includes(item.capability))
              .map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to.endsWith("/new") || item.to.endsWith("overview")}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      }`
                    }
                  >
                    <item.icon aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badgeKey === "notifications" && (unread.data?.unread ?? 0) > 0 && (
                      <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-200">
                        {unread.data?.unread}
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
    <div className="min-h-screen bg-[#f8fafc] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Portal sections"
        className="hidden min-h-screen flex-col bg-[#0f172a] text-white lg:flex border-r border-slate-800"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <div className="size-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shrink-0">
            <img
              src="/assets/nidhisetu-logo.png"
              alt="NidhiSetu Shield"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white">NidhiSetu</p>
            <p className="truncate text-[10px] text-slate-400">AICTE Security Deposit Portal</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto">{navigation}</div>

        {/* Quiet System Footnote */}
        <div className="border-t border-slate-800 p-4 text-[11px] text-slate-400">
          <p className="font-medium text-slate-300">Regulation Bureau</p>
          <p className="text-slate-500 mt-0.5 font-mono text-[10px]">SIH26265 &bull; Prototype</p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex w-72 max-w-[85%] flex-col bg-[#0f172a] text-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Portal sections"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/nidhisetu-logo.png"
                  alt="NidhiSetu"
                  className="size-6 object-contain"
                />
                <span className="text-sm font-semibold text-white">NidhiSetu</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navigation}</div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Quiet Environment Status */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-4" />
                <span className="sr-only">Open navigation</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 text-[11px]">
                  {meta?.environment === "production" ? "Restricted" : "Demo environment"}
                </span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 text-[11px]">
                  Bank: Simulated
                </span>
                <span className="hidden xl:inline text-[11px] text-slate-400 truncate max-w-sm">
                  Synthetic records for AICTE regulatory demonstration.
                </span>
              </div>
            </div>

            {/* Right: Search, Notifications & Profile */}
            <div className="flex items-center gap-3 shrink-0">
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
                    placeholder="Search institution, AICTE ID, bank..."
                    className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8.5 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors"
                  />
                </div>
              </form>

              {/* Notification Link */}
              <Link
                to={notificationsPath}
                className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Notifications"
              >
                <Bell aria-hidden="true" className="size-4" />
                {(unread.data?.unread ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 size-1.5 rounded-full bg-slate-800" />
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="size-7 rounded-md bg-slate-800 text-white font-medium text-xs flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-medium text-slate-800 leading-tight">
                      {session.display_name}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {session.roles.map((r) => titleCase(r)).join(", ")}
                    </p>
                  </div>
                  <ChevronDown className="size-3 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg z-50">
                    <div className="px-2 py-1.5 border-b border-slate-100 sm:hidden text-xs">
                      <p className="font-medium text-slate-800">{session.display_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut().then(() => navigate("/"))}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded transition-colors text-left"
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

        {/* Content Viewport */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
