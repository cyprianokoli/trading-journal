import { AccountForm } from "@/components/forms/account-form";
import { DeleteAccountForm } from "@/components/forms/delete-account-form";
import { AccountSwitcher } from "@/components/layout/account-switcher";
import { Card } from "@/components/ui/card";
import { decimalToNumber } from "@/lib/analytics";
import { getSelectedAccount } from "@/lib/data";

type SettingsPageProps = {
  searchParams?: Promise<{ account?: string }>;
};

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = (await searchParams) || {};
  const { accounts, selected } = await getSelectedAccount(params.account);
  const selectedWithRules = selected as (typeof selected & {
    costPerContract?: unknown;
    trackingStartDate?: Date | null;
  }) | null;

  const formattedAccount = selectedWithRules
    ? {
        id: selectedWithRules.id,
        name: selectedWithRules.name,
        broker: selectedWithRules.broker,
        provider: selectedWithRules.provider,
        startingBalance: String(decimalToNumber(selectedWithRules.startingBalance)),
        payoutTarget: String(decimalToNumber(selectedWithRules.payoutTarget)),
        maxDrawdown: String(decimalToNumber(selectedWithRules.maxDrawdown)),
        consistencyThreshold: String(decimalToNumber(selectedWithRules.consistencyThreshold)),
        dailyLossLimit: String(decimalToNumber(selectedWithRules.dailyLossLimit)),
        profitShare: String(decimalToNumber(selectedWithRules.profitShare)),
        costPerContract: String(decimalToNumber(selectedWithRules.costPerContract)),
        trackingStartDate: selectedWithRules.trackingStartDate
          ? selectedWithRules.trackingStartDate.toISOString().slice(0, 10)
          : "",
        notes: selectedWithRules.notes || "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      <AccountSwitcher accounts={accounts} selectedAccountId={selected?.id} pathname="/settings" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Create account" eyebrow="New funded profile">
          <AccountForm mode="create" />
        </Card>
        <Card title="Funded account rules" eyebrow="Editable account settings">
          {formattedAccount ? (
            <div className="space-y-5">
              <AccountForm mode="update" account={formattedAccount} />
              <DeleteAccountForm accountId={formattedAccount.id} accountName={formattedAccount.name} />
            </div>
          ) : (
            <p className="text-sm text-ink/70">Create an account to start journaling.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
