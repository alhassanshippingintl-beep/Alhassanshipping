import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-footer";
import { PhoneNumber, WhatsAppIcon } from "@/components/contact-links";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { COMPANY, contactHref, waLink } from "@/lib/company";
import { SERVICES } from "@/lib/services";
import { submitInquiry } from "@/lib/shipments.fn";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    try {
      await submitInquiry({
        data: {
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          email: String(fd.get("email") ?? ""),
          service: String(fd.get("service") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      });
      toast.success("وصل طلبك. سنتواصل معك قريبًا.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر الإرسال");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <section className="bg-navy py-14 text-on-navy">
        <div className="mx-auto max-w-4xl px-5">
          <h1 className="text-4xl font-black">تواصل معنا</h1>
          <p className="mt-2 text-on-navy/70">عرض سعر أو استفسار عن شحنة — نرد في ساعات العمل</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-black">أرسل طلبك</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم">
              <Input name="name" required />
            </Field>
            <Field label="الهاتف">
              <Input name="phone" required dir="ltr" className="text-left" />
            </Field>
          </div>
          <Field label="البريد (اختياري)">
            <Input name="email" type="email" dir="ltr" className="text-left" />
          </Field>
          <Field label="الخدمة">
            <select name="service" className="h-11 w-full rounded-xl border-2 border-line bg-surface px-3.5 text-sm font-semibold" defaultValue="">
              <option value="">اختر خدمة</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="تفاصيل الشحنة">
            <Textarea name="message" required placeholder="الوزن التقريبي، المنشأ، الوجهة، ونوع البضاعة" />
          </Field>
          <Button type="submit" disabled={pending}>
            {pending ? "جارٍ الإرسال…" : "إرسال"}
          </Button>
        </form>
        <aside className="space-y-4">
          {COMPANY.phones.map((p) => {
            const wa = p.kind === "whatsapp";
            return (
              <a
                key={p.e164}
                href={contactHref(p)}
                target={wa ? "_blank" : undefined}
                rel={wa ? "noreferrer" : undefined}
                className="block rounded-2xl border border-line bg-surface p-6 hover:border-brand"
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted">
                  {wa ? <WhatsAppIcon className="size-4 text-ok" /> : <Phone className="size-4 text-brand" />}
                  {wa ? "واتساب" : "اتصال"}
                </div>
                <h3 className="text-lg font-black">{p.label}</h3>
                <PhoneNumber value={p.display} className="mt-1 block font-bold text-brand" />
              </a>
            );
          })}
          <a
            href={waLink(undefined, "مرحبا، أريد الاستفسار عن شحن")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-ok px-6 py-5 text-center font-black text-on-navy"
          >
            <WhatsAppIcon className="size-5" />
            واتساب السعودية
          </a>
          <div className="rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6 text-center">
            <div className="font-black text-brand">ساعات العمل</div>
            <p className="mt-1 text-sm">{COMPANY.hours}</p>
            <p className="mt-1 text-xs text-muted">{COMPANY.hoursNote}</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
