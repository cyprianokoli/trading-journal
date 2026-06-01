import Link from "next/link";
import type { Trade } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { decimalToNumber } from "@/lib/analytics";
import { formatTime, toCompactDate, toCurrency } from "@/lib/utils";

type TradesTableProps = {
  trades: Trade[];
};

export function TradesTable({ trades }: TradesTableProps) {
  return (
    <div className="overflow-x-auto rounded-[28px] border border-white/50 bg-white/55 p-4 backdrop-blur-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="text-ink/48">
          <tr>
            <th className="px-3 pb-3 font-medium">Date</th>
            <th className="px-3 pb-3 font-medium">Time</th>
            <th className="px-3 pb-3 font-medium">Symbol</th>
            <th className="px-3 pb-3 font-medium">Qty</th>
            <th className="px-3 pb-3 font-medium">PnL</th>
            <th className="px-3 pb-3 font-medium">Setup</th>
            <th className="px-3 pb-3 font-medium">Outcome</th>
            <th className="px-3 pb-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/8">
          {trades.map((trade) => {
            const pnl = decimalToNumber(trade.pnl);
            return (
              <tr key={trade.id}>
                <td className="px-3 py-4 text-ink">{toCompactDate(trade.executedAt)}</td>
                <td className="px-3 py-4 text-ink/70">{formatTime(trade.executedAt)}</td>
                <td className="px-3 py-4 font-medium text-ink">{trade.symbol}</td>
                <td className="px-3 py-4 text-ink/70">{trade.quantity ?? "-"}</td>
                <td className={`px-3 py-4 font-medium ${pnl >= 0 ? "text-[#355742]" : "text-[#8E4B38]"}`}>
                  {toCurrency(pnl)}
                </td>
                <td className="px-3 py-4">
                  {trade.setupTag ? <Badge>{trade.setupTag}</Badge> : <span className="text-ink/45">None</span>}
                </td>
                <td className="px-3 py-4">
                  <Badge tone={pnl >= 0 ? "positive" : "negative"}>{pnl >= 0 ? "Win" : "Loss"}</Badge>
                </td>
                <td className="px-3 py-4 text-right">
                  <Link
                    href={`/trades/${trade.id}`}
                    className="rounded-full border border-ink/12 px-3 py-2 text-xs font-medium text-ink transition hover:border-ink/30"
                  >
                    Journal
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
