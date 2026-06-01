import { ChartCard } from "@/components/dashboard/chart-card";
import { PerformanceTable } from "@/components/dashboard/performance-table";
import { AccountSwitcher } from "@/components/layout/account-switcher";
import { Card } from "@/components/ui/card";
import { calculateAccountAnalytics } from "@/lib/analytics";
import { getSelectedAccount, getTrades } from "@/lib/data";
import { toCompactDate, toCurrency } from "@/lib/utils";

type AnalyticsPageProps = {
  searchParams?: Promise<{ account?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = (await searchParams) || {};
  const { accounts, selected } = await getSelectedAccount(params.account);
  const trades = selected ? await getTrades(selected.id) : [];
  const analytics = selected ? calculateAccountAnalytics(selected, trades) : null;

  if (!selected || !analytics) {
    return <p className="text-sm text-ink/70">Create an account first to unlock analytics.</p>;
  }

  return (
    <div className="space-y-6">
      <AccountSwitcher accounts={accounts} selectedAccountId={selected.id} pathname="/analytics" />
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Equity curve"
          eyebrow="Trade by trade"
          type="area"
          data={analytics.equityCurve.map((point) => ({
            date: toCompactDate(point.date),
            balance: point.balance,
          }))}
          xKey="date"
          yKey="balance"
        />
        <ChartCard
          title="Daily PnL"
          eyebrow="Session outcome"
          type="bar"
          data={analytics.dailyPerformance.map((point) => ({
            date: toCompactDate(point.date),
            pnl: point.pnl,
          }))}
          xKey="date"
          yKey="pnl"
          color="#B68C3B"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <PerformanceTable
          title="Symbol performance"
          eyebrow="Markets"
          keyLabel="Symbol"
          rows={analytics.symbolPerformance.map((row) => ({
            key: row.symbol,
            pnl: row.pnl,
            trades: row.trades,
          }))}
        />
        <PerformanceTable
          title="Setup performance"
          eyebrow="Execution pattern"
          keyLabel="Setup"
          rows={analytics.setupPerformance.map((row) => ({
            key: row.setup,
            pnl: row.pnl,
            trades: row.trades,
            winRate: row.winRate,
          }))}
        />
        <Card title="Time-of-day performance" eyebrow="Clock bias">
          <div className="space-y-3">
            {analytics.timeOfDayPerformance.map((row) => (
              <div key={row.hour} className="flex items-center justify-between rounded-2xl bg-ink/6 px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{row.hour}:00</p>
                  <p className="text-xs text-ink/55">{row.trades} trades</p>
                </div>
                <p className={`font-semibold ${row.pnl >= 0 ? "text-[#355742]" : "text-[#8E4B38]"}`}>
                  {toCurrency(row.pnl)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
