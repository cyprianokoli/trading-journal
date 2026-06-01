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
        "rounded-[24px] border border-white/55 bg-[#f8f1e7]/85 p-4 shadow-glow backdrop-blur-sm sm:rounded-[28px] sm:p-6",
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
          <div>
            {eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/55">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="mt-2 text-lg font-semibold text-ink sm:text-xl">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
