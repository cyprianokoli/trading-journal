import { Card } from "@/components/ui/card";
import { toCurrency, toPercent } from "@/lib/utils";

type PerformanceRow = {
  key: string;
  pnl: number;
  trades: number;
  winRate?: number;
};

type PerformanceTableProps = {
  title: string;
  eyebrow?: string;
  rows: PerformanceRow[];
  keyLabel: string;
};

export function PerformanceTable({
  title,
  eyebrow,
  rows,
  keyLabel,
}: PerformanceTableProps) {
  return (
    <Card title={title} eyebrow={eyebrow}>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.key} className="rounded-[22px] border border-ink/10 bg-[#fcf8f2] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-ink">{row.key}</p>
              <p className={`font-semibold ${row.pnl >= 0 ? "text-[#355742]" : "text-[#8E4B38]"}`}>
                {toCurrency(row.pnl)}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-ink/70">
              <div>
                <p className="text-ink/45">Trades</p>
                <p className="mt-1">{row.trades}</p>
              </div>
              <div>
                <p className="text-ink/45">Win rate</p>
                <p className="mt-1">{row.winRate === undefined ? "n/a" : toPercent(row.winRate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink/48">
            <tr>
              <th className="pb-3 font-medium">{keyLabel}</th>
              <th className="pb-3 font-medium">PnL</th>
              <th className="pb-3 font-medium">Trades</th>
              <th className="pb-3 font-medium">Win rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="py-3 font-medium text-ink">{row.key}</td>
                <td className={`py-3 ${row.pnl >= 0 ? "text-[#355742]" : "text-[#8E4B38]"}`}>
                  {toCurrency(row.pnl)}
                </td>
                <td className="py-3 text-ink/72">{row.trades}</td>
                <td className="py-3 text-ink/72">
                  {row.winRate === undefined ? "n/a" : toPercent(row.winRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
