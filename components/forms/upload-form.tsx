import { uploadTradesAction } from "@/lib/actions";

type UploadFormProps = {
  accountId?: string;
};

export function UploadForm({ accountId }: UploadFormProps) {
  return (
    <form action={uploadTradesAction} className="grid gap-4">
      <input type="hidden" name="accountId" value={accountId} />
      <label className="grid gap-2 text-sm text-ink/72">
        Tradovate CSV export
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          className="rounded-2xl border border-dashed border-ink/18 bg-[#fcf8f2] px-4 py-6 text-sm"
        />
      </label>
      <button
        disabled={!accountId}
        className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-parchment transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
      >
        Import trades
      </button>
    </form>
  );
}
