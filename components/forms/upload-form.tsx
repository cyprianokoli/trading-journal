"use client";

import { useState, useTransition } from "react";

import { uploadTradesAction } from "@/lib/actions";

type UploadFormProps = {
  accountId?: string;
};

export function UploadForm({ accountId }: UploadFormProps) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      encType="multipart/form-data"
      className="grid gap-4"
      action={(formData) => {
        setError("");

        startTransition(async () => {
          try {
            await uploadTradesAction(formData);
            setSelectedFileName("");
          } catch (actionError) {
            const message =
              actionError instanceof Error ? actionError.message : "Upload failed. Try another CSV export.";
            setError(message);
          }
        });
      }}
    >
      <input type="hidden" name="accountId" value={accountId} />
      <label className="grid gap-2 text-sm text-ink/72">
        Tradovate CSV export
        <input
          required
          type="file"
          name="file"
          accept=".csv,text/csv,application/csv,application/vnd.ms-excel,text/plain"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            setSelectedFileName(file?.name ?? "");
            setError("");
          }}
          className="min-h-28 rounded-2xl border border-dashed border-ink/18 bg-[#fcf8f2] px-4 py-6 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-parchment"
        />
      </label>
      <p className="text-sm text-ink/58">
        {selectedFileName || "On mobile, choose the CSV from Files or Downloads after exporting it from Tradovate."}
      </p>
      {error ? <p className="text-sm text-[#b24f39]">{error}</p> : null}
      <button
        disabled={!accountId || isPending}
        className="w-full rounded-full bg-ink px-5 py-3 text-sm font-medium text-parchment transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
      >
        {isPending ? "Importing..." : "Import trades"}
      </button>
    </form>
  );
}
