import { updateTradeJournalAction } from "@/lib/actions";

type TradeJournalFormProps = {
  trade: {
    id: string;
    setupTag: string | null;
    mistakeTag: string | null;
    screenshotUrl: string | null;
    notes: string | null;
  };
};

export function TradeJournalForm({ trade }: TradeJournalFormProps) {
  return (
    <form action={updateTradeJournalAction} className="grid gap-4">
      <input type="hidden" name="tradeId" value={trade.id} />
      <label className="grid gap-2 text-sm text-ink/72">
        Setup tag
        <input
          name="setupTag"
          defaultValue={trade.setupTag ?? ""}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
          placeholder="Open drive, pullback, reversal..."
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Mistake tag
        <input
          name="mistakeTag"
          defaultValue={trade.mistakeTag ?? ""}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
          placeholder="Overtrade, early exit, size creep..."
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Screenshot URL
        <input
          name="screenshotUrl"
          defaultValue={trade.screenshotUrl ?? ""}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
          placeholder="https://..."
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/72">
        Notes
        <textarea
          name="notes"
          rows={8}
          defaultValue={trade.notes ?? ""}
          className="rounded-2xl border border-ink/10 bg-[#fcf8f2] px-4 py-3 outline-none transition focus:border-ink/30"
          placeholder="What did you see? What was the plan? Did you execute it?"
        />
      </label>
      <button className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-parchment transition hover:opacity-92 sm:w-fit">
        Save journal notes
      </button>
    </form>
  );
}
