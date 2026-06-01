import { createAccountAction, updateAccountRulesAction } from "@/lib/actions";

type AccountFormProps = {
  mode: "create" | "update";
  account?: {
    id: string;
    name: string;
    broker: string;
    provider: string;
    startingBalance: string;
    payoutTarget: string;
    maxDrawdown: string;
    consistencyThreshold: string;
    dailyLossLimit: string;
    profitShare: string;
    costPerContract: string;
    trackingStartDate: string;
    notes: string;
  };
};

export function AccountForm({ mode, account }: AccountFormProps) {
  const action = mode === "create" ? createAccountAction : updateAccountRulesAction;

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {account ? <input type="hidden" name="accountId" defaultValue={account.id} /> : null}
      <label className="grid gap-2 text-sm text-ink/72">
        Account name
        <input
          name="name"
          defaultValue={account?.name}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none ring-0 transition focus:border-ink/30"
          placeholder="Lucid 25k"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Broker
        <input
          name="broker"
          defaultValue={account?.broker || "Tradovate"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Provider
        <input
          name="provider"
          defaultValue={account?.provider || "Lucid"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Starting balance
        <input
          name="startingBalance"
          defaultValue={account?.startingBalance || "25000"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Payout target
        <input
          name="payoutTarget"
          defaultValue={account?.payoutTarget || "1500"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Trailing/max drawdown
        <input
          name="maxDrawdown"
          defaultValue={account?.maxDrawdown || "1500"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Consistency threshold %
        <input
          name="consistencyThreshold"
          defaultValue={account?.consistencyThreshold || "30"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Daily loss limit
        <input
          name="dailyLossLimit"
          defaultValue={account?.dailyLossLimit || "0"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Profit share %
        <input
          name="profitShare"
          defaultValue={account?.profitShare || "0"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Cost per contract (round turn)
        <input
          name="costPerContract"
          defaultValue={account?.costPerContract || "1.0192513369"}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Tracking start date
        <input
          type="date"
          name="trackingStartDate"
          defaultValue={account?.trackingStartDate || ""}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72 md:col-span-2">
        Notes
        <textarea
          name="notes"
          rows={4}
          defaultValue={account?.notes}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
          placeholder="Rules, payout notes, personal reminders..."
        />
      </label>
      <div className="md:col-span-2">
        <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-parchment transition hover:opacity-92 sm:w-fit">
          {mode === "create" ? "Create account" : "Save funded rules"}
        </button>
      </div>
    </form>
  );
}
