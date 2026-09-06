import { Link } from "@tanstack/react-router";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

export function Logo({ inverted, compact }: { inverted?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span
        className={cn(
          "grid size-12 place-items-center rounded-xl bg-brand text-lg font-black text-on-navy",
          compact && "size-10 text-sm",
        )}
      >
        ح
      </span>
      <span className="leading-tight">
        <span className={cn("block text-lg font-black", inverted ? "text-on-navy" : "text-ink")}>
          الحسن <span className="text-brand">للشحن</span>
        </span>
        {compact ? null : (
          <span className={cn("block text-xs font-bold tracking-widest uppercase", inverted ? "text-on-navy/50" : "text-muted")}>
            {COMPANY.nameEn}
          </span>
        )}
      </span>
    </Link>
  );
}
