import Image from "next/image";
import { notFound } from "next/navigation";

import { TradeJournalForm } from "@/components/forms/trade-journal-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { decimalToNumber } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { formatTime, toCompactDate, toCurrency } from "@/lib/utils";

type TradeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function TradeDetailPage({ params }: TradeDetailPageProps) {
  const { id } = await params;
  const trade = await prisma.trade.findUnique({
    where: { id },
    include: { account: true },
  });

  if (!trade) {
    notFound();
  }

  const pnl = decimalToNumber(trade.pnl);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
      <Card title="Trade snapshot" eyebrow="Execution">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={pnl >= 0 ? "positive" : "negative"}>{pnl >= 0 ? "Winner" : "Loser"}</Badge>
            <Badge>{trade.symbol}</Badge>
            {trade.side ? <Badge>{trade.side}</Badge> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Date</p>
              <p className="mt-2 font-semibold text-ink">{toCompactDate(trade.executedAt)}</p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Time</p>
              <p className="mt-2 font-semibold text-ink">{formatTime(trade.executedAt)}</p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Realized PnL</p>
              <p className="mt-2 font-semibold text-ink">{toCurrency(pnl)}</p>
            </div>
            <div className="rounded-3xl bg-ink/6 p-4">
              <p className="text-sm text-ink/55">Quantity</p>
              <p className="mt-2 font-semibold text-ink">{trade.quantity ?? "-"}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-[#fcf8f2] p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/45">Imported metadata</p>
            <div className="mt-3 space-y-2 text-sm text-ink/72">
              <p>Account: {trade.account.name}</p>
              <p>Order ID: {trade.orderId || "n/a"}</p>
              <p>Source account: {trade.sourceAccount || "n/a"}</p>
              <p>Fees: {toCurrency(decimalToNumber(trade.fees))}</p>
              <p>Commission: {toCurrency(decimalToNumber(trade.commission))}</p>
            </div>
          </div>
          {trade.screenshotUrl ? (
            <div className="overflow-hidden rounded-[28px] border border-ink/10">
              <Image
                src={trade.screenshotUrl}
                alt="Trade screenshot"
                width={900}
                height={600}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </Card>
      <Card title="Journal this trade" eyebrow="Context and review">
        <TradeJournalForm trade={trade} />
      </Card>
    </div>
  );
}
