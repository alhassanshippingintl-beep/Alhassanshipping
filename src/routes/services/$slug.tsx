import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/services";

export const Route = createFileRoute("/services/$slug")({
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) throw notFound();
  const idx = SERVICES.findIndex((s) => s.slug === service.slug);
  const prev = SERVICES[(idx + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-navy py-16 text-on-navy">
        <img src={service.image} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative mx-auto max-w-5xl px-5">
          <p className="mb-2 text-sm text-on-navy/70">
            <Link to="/" className="hover:text-on-navy">
              الرئيسية
            </Link>{" "}
            / خدماتنا
          </p>
          <h1 className="text-4xl font-black">{service.title}</h1>
          <p className="mt-3 max-w-2xl text-on-navy/80">{service.desc}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-2xl font-black">ماذا تشمل الخدمة</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {service.points.map((p) => (
              <li key={p} className="rounded-xl border border-line bg-surface px-4 py-3 font-bold">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <aside className="rounded-2xl bg-navy p-6 text-on-navy">
          <h3 className="text-lg font-black">تحتاج عرض سعر؟</h3>
          <p className="mt-2 text-sm text-on-navy/70">أرسل تفاصيل الشحنة وسنرد خلال ساعات العمل.</p>
          <Button asChild className="mt-4 w-full">
            <Link to="/contact">تواصل معنا</Link>
          </Button>
        </aside>
      </section>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 pb-14">
        <Button asChild variant="outline">
          <Link to="/services/$slug" params={{ slug: prev.slug }}>
            {prev.title}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/services/$slug" params={{ slug: next.slug }}>
            {next.title}
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
