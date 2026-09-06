import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMPANY } from "@/lib/company";

export function TrackForm({ initial = "", compact }: { initial?: string; compact?: boolean }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initial);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = value.trim().toUpperCase();
    if (!n) return;
    void navigate({ to: "/track", search: { n } });
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "flex flex-col gap-3 sm:flex-row"}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="مثال: AH-2026-10001"
          className="pr-10 text-left font-mono"
          dir="ltr"
          aria-label="رقم التتبع"
        />
      </div>
      <Button type="submit">تتبّع</Button>
      {compact ? null : (
        <p className="w-full text-center text-xs text-muted sm:hidden">
          جرّب {COMPANY.sampleTracking[0]}
        </p>
      )}
    </form>
  );
}
