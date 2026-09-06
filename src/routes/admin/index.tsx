import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/track-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICE_META, STATUSES, STATUS_META } from "@/lib/shipments";
import { listShipments } from "@/lib/shipments.fn";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const list = useQuery({
    queryKey: ["shipments", q, status],
    queryFn: () => listShipments({ data: { q, status } }),
  });

  const rows = list.data ?? [];
  const hint = useMemo(() => (list.isPending ? "جارٍ التحميل…" : `${rows.length} شحنة`), [list.isPending, rows.length]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">دفتر الشحنات</h1>
          <p className="text-sm text-muted">{hint}</p>
        </div>
        <Button asChild>
          <Link to="/admin/new">تسجيل شحنة</Link>
        </Button>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="رقم، اسم، هاتف، مدينة…" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-xl border-2 border-line bg-surface px-3 text-sm font-semibold"
        >
          <option value="">كل الحالات</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-paper text-right">
            <tr>
              {["الرقم", "المسار", "المستلم", "الخدمة", "الحالة", "التاريخ"].map((h) => (
                <th key={h} className="px-4 py-3 font-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-4 py-3 font-mono font-bold">
                  <Link to="/admin/$id" params={{ id: s.id }} className="text-brand">
                    {s.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {s.origin} ← {s.destination}
                </td>
                <td className="px-4 py-3">
                  {s.receiverName} {s.receiverPhone}
                </td>
                <td className="px-4 py-3">{SERVICE_META[s.serviceType].label}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !list.isPending ? (
          <p className="p-8 text-center text-muted">لا توجد شحنات مطابقة</p>
        ) : null}
      </div>
    </div>
  );
}
