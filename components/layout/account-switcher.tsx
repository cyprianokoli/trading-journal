import Link from "next/link";
import type { Account } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

type AccountSwitcherProps = {
  accounts: Account[];
  selectedAccountId?: string;
  pathname: string;
};

export function AccountSwitcher({
  accounts,
  selectedAccountId,
  pathname,
}: AccountSwitcherProps) {
  return (
    <div className="rounded-[24px] border border-white/50 bg-white/55 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="warning">Funded Account</Badge>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
          Active journal context
        </p>
      </div>
      <div className="mt-3 grid gap-3">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`${pathname}?account=${account.id}`}
            className={`rounded-2xl border px-4 py-3 text-sm transition ${
              selectedAccountId === account.id
                ? "border-ink bg-ink text-parchment"
                : "border-ink/10 bg-[#faf4ec] text-ink hover:border-ink/30"
            }`}
          >
            <div className="font-semibold">{account.name}</div>
            <div className="text-xs opacity-70">{account.provider} via {account.broker}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
