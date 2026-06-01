import Link from "next/link";
import { BarChart3, Import, LayoutDashboard, Settings2, TableProperties } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Import },
  { href: "/trades", label: "Trades", icon: TableProperties },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  return (
    <aside className="rounded-[28px] border border-white/20 bg-ink px-4 py-5 text-parchment shadow-glow lg:rounded-[32px] lg:px-5 lg:py-6">
      <div className="mb-5 lg:mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-parchment/55">
          Lucid Journal
        </p>
        <h1 className="mt-2 text-2xl font-semibold lg:mt-3 lg:text-3xl">Futures edge, traced daily.</h1>
        <p className="mt-2 max-w-xs text-sm text-parchment/68 lg:mt-3">
          Upload Tradovate fills, journal context, and keep the funded-account rules visible.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 lg:block lg:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-parchment/80 transition hover:bg-white/10 hover:text-parchment lg:border-transparent"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
