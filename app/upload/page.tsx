import { AccountSwitcher } from "@/components/layout/account-switcher";
import { UploadForm } from "@/components/forms/upload-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSelectedAccount } from "@/lib/data";

type UploadPageProps = {
  searchParams?: Promise<{ account?: string }>;
};

export const dynamic = "force-dynamic";

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const params = (await searchParams) || {};
  const { accounts, selected } = await getSelectedAccount(params.account);

  return (
    <div className="space-y-6">
      <AccountSwitcher accounts={accounts} selectedAccountId={selected?.id} pathname="/upload" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card title="Import Tradovate CSV" eyebrow="Upload">
          <UploadForm accountId={selected?.id} />
        </Card>
        <Card title="Parser assumptions" eyebrow="Flexible mapping">
          <div className="space-y-4 text-sm text-ink/70">
            <p>
              The parser looks for common Tradovate-style headers and aliases for symbol, side, quantity,
              price, timestamp, PnL, fees, commission, order ID, and account.
            </p>
            <p>
              Required columns for MVP import are symbol, execution time, and realized PnL. Everything else is optional and will be stored when present.
            </p>
            <div className="flex flex-wrap gap-2">
              {["symbol", "buy/sell", "quantity", "price", "timestamp", "pnl", "fees", "commission", "order id", "account"].map((field) => (
                <Badge key={field}>{field}</Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
