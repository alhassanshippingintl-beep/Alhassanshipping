import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StatusBadge, TrackResult } from "@/components/track-result";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { COMPANY, waLink } from "@/lib/company";
import { SERVICE_META, STATUSES, STATUS_META } from "@/lib/shipments";
import { addShipmentEvent, getShipment } from "@/lib/shipments.fn";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/$id")({ component: ShipmentDetail });

function ShipmentDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);
  const detail = useQuery({
    queryKey: ["shipment", id],
    queryFn: () => getShipment({ data: { id } }),
  });
  const shipment = detail.data?.shipment;

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!shipment) return;
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await addShipmentEvent({
        data: {
          id: shipment.id,
          status: String(fd.get("status") ?? shipment.status),
          location: String(fd.get("location") ?? ""),
          note: String(fd.get("note") ?? ""),
        },
      });
      toast.success("تم تحديث الحالة");
      await qc.invalidateQueries({ queryKey: ["shipment", id] });
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر التحديث");
    } finally {
      setPending(false);
    }
  }

  if (detail.isPending) return <div className="h-40 animate-pulse rounded-2xl bg-line" />;
  if (!shipment) {
    return (
      <p className="font-bold text-brand">
        الشحنة غير موجودة.{" "}
        <Link to="/admin" className="underline">
          العودة
        </Link>
      </p>
    );
  }

  const share = `رقم تتبع شحنتك لدى الحسن للشحن الدولي: ${shipment.id}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/admin" className="text-xs font-bold text-muted hover:text-brand">
              ← الدفتر
            </Link>
            <h1 className="font-mono text-2xl font-black" dir="ltr">
              {shipment.id}
            </h1>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
        <TrackResult shipment={shipment} events={detail.data?.events ?? []} />
        <div className="print-waybill p-6">
          <h1 className="text-xl font-black">{COMPANY.nameAr}</h1>
          <p>{COMPANY.nameEn}</p>
          <h2 className="mt-4 font-mono text-2xl" dir="ltr">
            {shipment.id}
          </h2>
          <p>
            من {shipment.origin} إلى {shipment.destination}
          </p>
          <p>
            مرسل: {shipment.senderName} — {shipment.senderPhone}
          </p>
          <p>
            مستلم: {shipment.receiverName} — {shipment.receiverPhone}
          </p>
          <p>
            {SERVICE_META[shipment.serviceType].label} · {shipment.pieces} طرد
            {shipment.weightKg != null ? ` · ${shipment.weightKg} كغ` : ""}
          </p>
          <p>الحالة: {STATUS_META[shipment.status].label}</p>
          <p>تاريخ التسجيل: {formatDateTime(shipment.createdAt)}</p>
        </div>
      </div>
      <aside className="space-y-4">
        <form onSubmit={onUpdate} className="space-y-3 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-black">تحديث الحالة</h2>
          <p className="text-xs text-muted">أي تحديث يظهر للعميل مباشرة عند إدخال الرقم</p>
          <Field label="الحالة الجديدة">
            <select name="status" defaultValue={shipment.status} className="h-11 w-full rounded-xl border-2 border-line bg-surface px-3.5 text-sm font-semibold">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="الموقع">
            <Input name="location" />
          </Field>
          <Field label="ملاحظة">
            <Textarea name="note" className="min-h-20" />
          </Field>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "جارٍ الحفظ…" : "حفظ التحديث"}
          </Button>
        </form>
        <div className="space-y-2 rounded-2xl border border-line bg-surface p-5">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              await navigator.clipboard.writeText(shipment.id);
              toast.success("تم النسخ");
            }}
          >
            نسخ رقم التتبع
          </Button>
          <Button asChild variant="navy" className="w-full">
            <a href={waLink(undefined, share)} target="_blank" rel="noreferrer">
              إرسال للعميل واتساب
            </a>
          </Button>
          <Button type="button" variant="ghost" className="w-full no-print" onClick={() => window.print()}>
            طباعة البوليصة
          </Button>
        </div>
      </aside>
    </div>
  );
}
