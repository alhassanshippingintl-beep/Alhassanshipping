import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Ship, Truck, Warehouse } from "lucide-react";
import { PageShell } from "@/components/site-footer";
import { ReviewCard } from "@/components/review-card";
import { TrackForm } from "@/components/track-form";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { SERVICES } from "@/lib/services";
import { TESTIMONIALS } from "@/lib/testimonials";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-navy text-on-navy">
        <img src="/hero.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold text-brand-soft">منذ {COMPANY.founded}</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              الحسن للشحن الدولي
              <span className="mt-2 block text-brand-soft">من الباب إلى الباب</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-on-navy/80">{COMPANY.taglineAr}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/track">تتبّع شحنة</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-on-navy/30 bg-transparent text-on-navy hover:bg-on-navy/10">
                <Link to="/contact">اطلب عرض سعر</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-on-navy/15 bg-on-navy/8 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-black">تتبّع شحنتك الآن</h2>
            <TrackForm />
            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <Stat label="شحنات" value="7532" />
              <Stat label="تم التسليم" value="7532" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-3xl px-5">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-lg sm:p-8">
          <h2 className="text-center text-2xl font-black">أدخل رقم التتبع</h2>
          <p className="mb-5 text-center text-sm text-muted">مثال: {COMPANY.sampleTracking.join(" · ")}</p>
          <TrackForm />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/services/$slug", slug: "land", icon: Truck, label: "شحن بري" },
          { to: "/services/$slug", slug: "sea", icon: Ship, label: "شحن بحري" },
          { to: "/services/$slug", slug: "air", icon: Plane, label: "شحن جوي" },
          { to: "/services/$slug", slug: "warehouse", icon: Warehouse, label: "تخزين" },
        ].map((q) => (
          <Link
            key={q.slug}
            to={q.to}
            params={{ slug: q.slug }}
            className="rounded-2xl border-2 border-line bg-surface p-6 text-center transition hover:-translate-y-1 hover:border-brand"
          >
            <q.icon className="mx-auto mb-3 size-8 text-brand" />
            <span className="font-bold">{q.label}</span>
          </Link>
        ))}
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-bold tracking-wide text-brand">خدماتنا</p>
          <h2 className="mb-10 text-center text-3xl font-black">حلول متكاملة للنقل</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={s.image} alt="" className="h-40 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-black">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-bold tracking-wide text-brand">آراء العملاء منذ {COMPANY.founded}</p>
          <h2 className="mb-10 text-center text-3xl font-black">يثقون في الحسن للشحن</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.slice(-6)
              .reverse()
              .map((item) => (
              <ReviewCard key={`${item.name}-${item.year}`} item={item} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/reviews">كل الآراء</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-on-navy/5 p-3">
      <div className="text-2xl font-black text-brand-soft">{value}</div>
      <div className="text-xs text-on-navy/70">{label}</div>
    </div>
  );
}
