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
    <div className="rounded-[24px] border border-white/50 bg-white/55 p-3 backdrop-blur-sm sm:rounded-[28px] sm:p-4">
      <div className="space-y-3 md:hidden">
        {trades.map((trade) => {
          const pnl = decimalToNumber(trade.pnl);
          return (
            <div key={trade.id} className="rounded-[22px] border border-ink/10 bg-[#fcf8f2] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-ink">{trade.symbol}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {toCompactDate(trade.executedAt)} at {formatTime(trade.executedAt)}
                  </p>
                </div>
                <Badge tone={pnl >= 0 ? "positive" : "negative"}>{pnl >= 0 ? "Win" : "Loss"}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ink/45">Qty</p>
                  <p className="mt-1 font-medium text-ink">{trade.quantity ?? "-"}</p>
                </div>
                <div>
                  <p className="text-ink/45">PnL</p>
                  <p className={`mt-1 font-medium ${pnl >= 0 ? "text-[#355742]" : "text-[#8E4B38]"}`}>
                    {toCurrency(pnl)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-ink/45">Setup</p>
                  <div className="mt-2">
                    {trade.setupTag ? <Badge>{trade.setupTag}</Badge> : <span className="text-ink/45">None</span>}
                  </div>
                </div>
              </div>
              <Link
                href={`/trades/${trade.id}`}
                className="mt-4 inline-flex rounded-full border border-ink/12 px-3 py-2 text-xs font-medium text-ink transition hover:border-ink/30"
              >
                Journal
              </Link>
            </div>
          );
        })}
      </div>
      <div className="hidden overflow-x-auto md:block">
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
    </div>
  );
}
