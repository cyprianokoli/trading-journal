import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "positive" | "negative" | "warning";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        tone === "default" && "bg-ink/8 text-ink/72",
        tone === "positive" && "bg-moss/15 text-[#2F5A3C]",
        tone === "negative" && "bg-ember/15 text-[#8C3D29]",
        tone === "warning" && "bg-brass/15 text-[#705319]",
      )}
    >
      {children}
    </span>
  );
}
