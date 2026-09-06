import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listInquiries } from "@/lib/shipments.fn";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries")({ component: InquiriesPage });

function InquiriesPage() {
  const list = useQuery({ queryKey: ["inquiries"], queryFn: () => listInquiries() });
  const rows = list.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-black">طلبات التواصل</h1>
      <div className="space-y-4">
        {list.isPending ? <div className="h-32 animate-pulse rounded-2xl bg-line" /> : null}
        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-black">{r.name}</h2>
              <span className="text-xs text-muted">{formatDateTime(r.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-muted" dir="ltr">
              {r.phone} {r.email}
            </p>
            {r.service ? <p className="mt-1 text-sm font-bold text-brand">{r.service}</p> : null}
            <p className="mt-3 text-sm">{r.message}</p>
          </article>
        ))}
        {!list.isPending && rows.length === 0 ? <p className="text-muted">لا توجد طلبات بعد</p> : null}
      </div>
    </div>
  );
}
