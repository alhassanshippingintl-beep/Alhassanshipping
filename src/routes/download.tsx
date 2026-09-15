import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Download, Smartphone, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/download")({ component: DownloadPage });

function DownloadPage() {
  return (
    <PageShell>
      <main className="min-h-[70vh] bg-paper px-5 py-16">
        <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-navy text-on-navy shadow-xl">
          <div className="relative p-8 text-center sm:p-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-brand" />
            <div className="mx-auto mb-6 grid size-24 place-items-center rounded-3xl bg-surface p-3 shadow-lg">
              <img src="/favicon.svg" alt="شعار الحسن للشحن الدولي" className="size-full" />
            </div>
            <p className="text-sm font-bold text-brand-soft">الحسن للشحن الدولي</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">تطبيق الحسن للشحن</h1>
            <p className="mx-auto mt-4 max-w-xl text-on-navy/75">
              تتبّع شحناتك وتابع حالتها من هاتفك، مع اتصال مباشر بنفس نظام الموقع وقاعدة بياناته.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/alhassan-shipping-arm64.apk" download>
                  <Download className="ml-2 size-5" />
                  تحميل التطبيق
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-on-navy/30 bg-transparent text-on-navy hover:bg-on-navy/10 sm:w-auto">
                <Link to="/">العودة للموقع</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-3 text-right sm:grid-cols-3">
              <Feature icon={<Smartphone />} title="نسخة Android" detail="ARM64 للهواتف الحديثة" />
              <Feature icon={<ShieldCheck />} title="ربط آمن" detail="نفس API الموقع" />
              <Feature icon={<Download />} title="حجم خفيف" detail="حوالي 19 ميجابايت" />
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Feature({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-on-navy/10 bg-on-navy/5 p-4">
      <div className="mb-2 text-brand-soft">{icon}</div>
      <div className="font-black">{title}</div>
      <div className="mt-1 text-xs text-on-navy/65">{detail}</div>
    </div>
  );
}
