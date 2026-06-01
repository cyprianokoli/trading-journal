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
      <div className="overflow-x-auto">
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
