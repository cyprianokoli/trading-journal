import { AccountSwitcher } from "@/components/layout/account-switcher";
import { TradesTable } from "@/components/dashboard/trades-table";
import { Card } from "@/components/ui/card";
import { getSelectedAccount, getTrades } from "@/lib/data";

type TradesPageProps = {
  searchParams?: Promise<{
    account?: string;
    symbol?: string;
    startDate?: string;
    endDate?: string;
    setupTag?: string;
    outcome?: "win" | "loss";
  }>;
};

export const dynamic = "force-dynamic";

export default async function TradesPage({ searchParams }: TradesPageProps) {
  const params = (await searchParams) || {};
  const { accounts, selected } = await getSelectedAccount(params.account);
  const trades = selected ? await getTrades(selected.id, params) : [];
  const uniqueSymbols = [...new Set(trades.map((trade) => trade.symbol))].sort();
  const uniqueSetups = [...new Set(trades.map((trade) => trade.setupTag).filter(Boolean) as string[])];

  return (
    <div className="space-y-6">
      <AccountSwitcher accounts={accounts} selectedAccountId={selected?.id} pathname="/trades" />
      <Card title="Trade filters" eyebrow="Review slices">
        <form className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="account" defaultValue={selected?.id} />
          <label className="grid gap-2 text-sm text-ink/70">
            Symbol
            <select
              name="symbol"
              defaultValue={params.symbol || ""}
              className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3"
            >
              <option value="">All symbols</option>
              {uniqueSymbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-ink/70">
            Start date
            <input
              type="date"
              name="startDate"
              defaultValue={params.startDate || ""}
              className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink/70">
            End date
            <input
              type="date"
              name="endDate"
              defaultValue={params.endDate || ""}
              className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink/70">
            Setup
            <select
              name="setupTag"
              defaultValue={params.setupTag || ""}
              className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3"
            >
              <option value="">All setups</option>
              {uniqueSetups.map((setup) => (
                <option key={setup} value={setup}>
                  {setup}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-ink/70">
            Outcome
            <select
              name="outcome"
              defaultValue={params.outcome || ""}
              className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3"
            >
              <option value="">Wins and losses</option>
              <option value="win">Wins only</option>
              <option value="loss">Losses only</option>
            </select>
          </label>
          <div className="sm:col-span-2 xl:col-span-5">
            <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-parchment sm:w-fit">
              Apply filters
            </button>
          </div>
        </form>
      </Card>
      <Card title="Trades" eyebrow="Journalable fills">
        <TradesTable trades={trades} />
      </Card>
    </div>
  );
}
