import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-footer";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <PageShell>
      <section className="bg-navy py-14 text-on-navy">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-black">من نحن</h1>
          <p className="mt-2 text-on-navy/70">{COMPANY.nameEn}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 lg:items-center">
        <img src="/hero.jpg" alt="" className="h-80 w-full rounded-2xl object-cover" />
        <div>
          <h2 className="text-3xl font-black">خبرة في النقل الدولي منذ {COMPANY.founded}</h2>
          <p className="mt-4 text-muted">
            الحسن للشحن الدولي تقدّم حلول نقل بري وبحري وجوي مع تخزين ومناولة وتخليص جمركي.
            العميل يقدر يستعلم عن شحنته برقم التتبع من أي مكان.
          </p>
          <p className="mt-3 text-muted">
            نخدم تجار ومستوردين في مصر والسعودية والأردن والمنطقة، مع تتبّع واضح لكل مرحلة من التسجيل حتى التسليم.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
