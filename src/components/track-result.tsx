import { STATUS_META, SERVICE_META, type PublicShipment, type ShipmentEvent } from "@/lib/shipments";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: PublicShipment["status"] }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", meta.className)}>
      {meta.label}
    </span>
  );
}

export function TrackResult({ shipment, events }: { shipment: PublicShipment; events: ShipmentEvent[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-navy px-6 py-6 text-on-navy">
        <div>
          <div className="text-xs text-on-navy/60">رقم التتبع</div>
          <div className="font-mono text-2xl font-black" dir="ltr">
            {shipment.id}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <div className="text-xs font-bold text-muted">من</div>
          <div className="font-bold">{shipment.origin}</div>
          <div className="text-sm text-muted">
            {shipment.senderName} · {shipment.senderPhone}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted">إلى</div>
          <div className="font-bold">{shipment.destination}</div>
          <div className="text-sm text-muted">
            {shipment.receiverName} · {shipment.receiverPhone}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted">الخدمة</div>
          <div className="font-bold">{SERVICE_META[shipment.serviceType].label}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted">الطرود / الوزن</div>
          <div className="font-bold">
            {shipment.pieces} طرد
            {shipment.weightKg != null ? ` · ${shipment.weightKg} كغ` : ""}
          </div>
        </div>
      </div>
      <div className="border-t border-line p-6">
        <h3 className="mb-4 font-black">مسار الشحنة</h3>
        <ol className="space-y-4">
          {events.map((ev, i) => (
            <li key={ev.id} className="flex gap-3">
              <span
                className={cn(
                  "mt-1 size-3 shrink-0 rounded-full",
                  i === events.length - 1 ? "bg-brand" : "bg-line",
                )}
              />
              <div>
                <div className="font-bold">{STATUS_META[ev.status].label}</div>
                <div className="text-sm text-muted">
                  {ev.location}
                  {ev.note ? ` · ${ev.note}` : ""}
                </div>
                <div className="text-xs text-muted">{formatDateTime(ev.createdAt)}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
