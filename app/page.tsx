import { AccountSwitcher } from "@/components/layout/account-switcher";
import { ChartCard } from "@/components/dashboard/chart-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { TradesTable } from "@/components/dashboard/trades-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { calculateAccountAnalytics } from "@/lib/analytics";
import { getSelectedAccount, getTrades } from "@/lib/data";
import { toCompactDate, toCurrency, toPercent } from "@/lib/utils";

type DashboardPageProps = {
  searchParams?: Promise<{ account?: string }>;
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) || {};
  const { accounts, selected } = await getSelectedAccount(params.account);

  if (!selected) {
    return (
      <div className="rounded-[32px] border border-white/40 bg-white/50 p-10 shadow-glow">
        <h2 className="font-[var(--font-display)] text-4xl">Create your first account</h2>
        <p className="mt-4 max-w-2xl text-ink/68">
          Start in Settings by adding your Lucid funded account rules. Once the account exists, upload a Tradovate CSV and the dashboard will populate automatically.
        </p>
      </div>
    );
  }

  const trades = await getTrades(selected.id);
  const analytics = calculateAccountAnalytics(selected, trades);

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr] xl:gap-5">
        <Card className="border-ink/8 bg-ink p-4 text-parchment sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warning">LucidFunded</Badge>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-parchment/50">
                  {selected.provider} via {selected.broker}
                </p>
              </div>
              <h1 className="mt-3 font-[var(--font-display)] text-2xl sm:text-3xl">{selected.name}</h1>
              <p className="mt-2 text-sm text-parchment/70">
                Gross P/L, fees, consistency, and funded-account risk are kept visible together.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-auto xl:min-w-[250px]">
              <div className="rounded-3xl border border-white/12 bg-white/6 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-parchment/52">Balance</p>
                <p className="mt-2 text-2xl font-semibold">{toCurrency(analytics.currentBalance)}</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/6 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-parchment/52">Max profit day</p>
                <p className="mt-2 text-2xl font-semibold">{toCurrency(analytics.bestDay.pnl)}</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/6 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-parchment/52">To payout</p>
                <p className="mt-2 text-2xl font-semibold">{toCurrency(analytics.distanceToPayoutTarget)}</p>
              </div>
            </div>
          </div>
        </Card>
        <AccountSwitcher accounts={accounts} selectedAccountId={selected.id} pathname="/" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6 xl:gap-5">
        <StatCard label="Gross PnL" value={toCurrency(analytics.grossPnl)} positive={analytics.grossPnl >= 0} />
        <StatCard label="Fees & Comm." value={toCurrency(analytics.totalCosts)} positive={false} />
        <StatCard label="Total net PnL" value={toCurrency(analytics.netPnl)} positive={analytics.netPnl >= 0} />
        <StatCard label="Win rate" value={toPercent(analytics.winRate)} hint={`${analytics.totalTrades} total trades`} positive={analytics.winRate >= 50} />
        <StatCard label="Average winner" value={toCurrency(analytics.averageWinner)} positive />
        <StatCard label="Average loser" value={toCurrency(analytics.averageLoser)} positive={false} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6 xl:gap-5">
        <StatCard label="Profit factor" value={analytics.profitFactor >= 999 ? "INF" : analytics.profitFactor.toFixed(2)} positive={analytics.profitFactor >= 1.5} />
        <StatCard
          label="Best day"
          value={analytics.bestDay.date ? toCurrency(analytics.bestDay.pnl) : "$0.00"}
          hint={analytics.bestDay.date ? toCompactDate(analytics.bestDay.date) : "No trading days yet"}
          positive
        />
        <StatCard
          label="Worst day"
          value={analytics.worstDay.date ? toCurrency(analytics.worstDay.pnl) : "$0.00"}
          hint={analytics.worstDay.date ? toCompactDate(analytics.worstDay.date) : "No trading days yet"}
          positive={false}
        />
        <StatCard
          label="Consistency %"
          value={toPercent(analytics.consistencyPct)}
          hint={`Threshold ${toPercent(analytics.consistencyThreshold)}`}
          positive={analytics.consistencyPct <= analytics.consistencyThreshold}
        />
        <StatCard
          label="Contracts"
          value={String(analytics.totalContracts)}
          hint={`${analytics.winningContracts} winning / ${analytics.losingContracts} losing`}
        />
        <StatCard
          label="Largest winner"
          value={toCurrency(analytics.largestWinningTrade)}
          positive
        />
        <StatCard
          label="Largest loser"
          value={toCurrency(analytics.largestLosingTrade)}
          positive={false}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        <ChartCard
          title="Equity curve"
          eyebrow="Balance trajectory"
          type="area"
          data={analytics.equityCurve.map((point) => ({
            date: toCompactDate(point.date),
            balance: point.balance,
          }))}
          xKey="date"
          yKey="balance"
          color="#0B1015"
        />
        <Card title="Lucid Summary" eyebrow="Funded account pulse">
          <div className="space-y-4">
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Profit target remaining</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{toCurrency(analytics.distanceToPayoutTarget)}</p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Distance to drawdown limit</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{toCurrency(analytics.distanceToDrawdownLimit)}</p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Gross profit / gross loss</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {toCurrency(analytics.grossProfit)} / {toCurrency(analytics.grossLoss)}
              </p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Tracking start</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {"trackingStartDate" in selected && selected.trackingStartDate
                  ? toCompactDate(selected.trackingStartDate)
                  : "All imported trades"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Recent trades"
        eyebrow="Execution log"
        action={<Badge>{trades.length ? `${trades.length} rows` : "No trades"}</Badge>}
      >
        <TradesTable trades={trades.slice(0, 10)} />
      </Card>
    </>
  );
}
