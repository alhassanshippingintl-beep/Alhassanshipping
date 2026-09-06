import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site-footer";
import { TrackForm } from "@/components/track-form";
import { TrackResult } from "@/components/track-result";
import { COMPANY } from "@/lib/company";
import { trackShipment } from "@/lib/shipments.fn";

type TrackSearch = { n?: string };

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    n: typeof search.n === "string" ? search.n : undefined,
  }),
  component: TrackPage,
});

function TrackPage() {
  const { n } = Route.useSearch();
  const trackingNumber = (n ?? "").trim().toUpperCase();
  const result = useQuery({
    queryKey: ["track", trackingNumber],
    queryFn: () => trackShipment({ data: { trackingNumber } }),
    enabled: trackingNumber.length > 0,
  });

  return (
    <PageShell>
      <section className="bg-navy py-14 text-on-navy">
        <div className="mx-auto max-w-3xl px-5">
          <h1 className="text-4xl font-black">تتبّع شحنة</h1>
          <p className="mt-2 text-on-navy/70">أدخل رقم التتبع للاستعلام عن الشحنة</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 rounded-2xl border border-line bg-surface p-6">
          <TrackForm initial={trackingNumber} />
          <p className="mt-3 text-xs text-muted">أمثلة: {COMPANY.sampleTracking.join(" · ")}</p>
        </div>
        {trackingNumber && result.isPending ? (
          <div className="h-40 animate-pulse rounded-2xl bg-line" />
        ) : null}
        {trackingNumber && result.data?.shipment ? (
          <TrackResult shipment={result.data.shipment} events={result.data.events} />
        ) : null}
        {trackingNumber && result.isError ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center font-bold text-brand">
            تعذّر الاتصال بالنظام. حاول مرة أخرى أو تواصل مع الشركة.
          </p>
        ) : null}
        {trackingNumber && !result.isError && result.data && !result.data.shipment ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center font-bold text-brand">
            لا توجد شحنة بهذا الرقم. تأكد من الرقم أو تواصل مع الشركة.
          </p>
        ) : null}
      </section>
    </PageShell>
  );
}
