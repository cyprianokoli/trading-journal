import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, eyebrow, action, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/55 bg-[#f8f1e7]/85 p-6 shadow-glow backdrop-blur-sm",
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/55">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
