import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-footer";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { TESTIMONIALS } from "@/lib/testimonials";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  return (
    <PageShell>
      <section className="bg-navy py-14 text-on-navy">
        <div className="mx-auto max-w-4xl px-5">
          <p className="text-sm font-bold text-brand-soft">منذ {COMPANY.founded} · {TESTIMONIALS.length} رأي · تقييم 5 نجوم</p>
          <h1 className="text-4xl font-black">آراء العملاء</h1>
          <p className="mt-2 text-on-navy/70">
            عملاء من أكثر من عشرين سنة: تجّار ومستوردين في مصر والسعودية والأردن والخليج والشام.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.slice()
            .reverse()
            .map((item) => (
              <ReviewCard key={`${item.name}-${item.year}`} item={item} />
            ))}
        </div>
        <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-on-navy">
          <h2 className="text-2xl font-black">جاهز تشحن معنا؟</h2>
          <p className="mt-2 text-on-navy/70">اطلب عرض سعر أو تواصل واتساب خلال ساعات العمل.</p>
          <Button asChild className="mt-6">
            <Link to="/contact">اطلب عرض سعر</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
