import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  positive?: boolean;
};

export function StatCard({ label, value, hint, positive }: StatCardProps) {
  return (
    <Card className="min-h-[132px] sm:min-h-[156px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/48">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-ink sm:mt-4 sm:text-3xl">{value}</p>
          {hint ? <p className="mt-2 text-sm text-ink/60 sm:mt-3">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "rounded-full p-2.5 sm:p-3",
            positive === undefined && "bg-ink/10 text-ink",
            positive === true && "bg-moss/15 text-[#355742]",
            positive === false && "bg-ember/15 text-[#8E4B38]",
          )}
        >
          {positive === false ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
        </div>
      </div>
    </Card>
  );
}
