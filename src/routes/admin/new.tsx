import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { waLink } from "@/lib/company";
import { createShipment } from "@/lib/shipments.fn";

export const Route = createFileRoute("/admin/new")({ component: NewShipment });

function NewShipment() {
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      const shipment = await createShipment({
        data: {
          senderName: String(fd.get("senderName") ?? ""),
          senderPhone: String(fd.get("senderPhone") ?? ""),
          senderCity: String(fd.get("senderCity") ?? ""),
          senderCountry: String(fd.get("senderCountry") ?? ""),
          receiverName: String(fd.get("receiverName") ?? ""),
          receiverPhone: String(fd.get("receiverPhone") ?? ""),
          receiverCity: String(fd.get("receiverCity") ?? ""),
          receiverCountry: String(fd.get("receiverCountry") ?? ""),
          origin: String(fd.get("origin") ?? ""),
          destination: String(fd.get("destination") ?? ""),
          serviceType: String(fd.get("serviceType") ?? "land"),
          packageDesc: String(fd.get("packageDesc") ?? ""),
          weightKg: String(fd.get("weightKg") ?? ""),
          pieces: String(fd.get("pieces") ?? "1"),
          notes: String(fd.get("notes") ?? ""),
        },
      });
      setCreated(shipment.id);
      toast.success("تم تسجيل الشحنة");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر التسجيل");
    } finally {
      setPending(false);
    }
  }

  if (created) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const share = `رقم تتبع شحنتك لدى الحسن للشحن الدولي: ${created}\n${origin}/track?n=${created}`;
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center">
        <h1 className="text-2xl font-black">تم التسجيل</h1>
        <p className="mt-2 font-mono text-3xl font-black text-brand" dir="ltr">
          {created}
        </p>
        <p className="mb-6 text-sm text-muted">أرسل الرقم للعميل عشان يتتبّع الشحنة.</p>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(created);
              toast.success("تم نسخ الرقم");
            }}
          >
            نسخ الرقم
          </Button>
          <Button asChild variant="navy">
            <a href={waLink(undefined, share)} target="_blank" rel="noreferrer">
              إرسال عبر واتساب
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/$id" params={{ id: created }}>
              فتح الشحنة
            </Link>
          </Button>
          <Button type="button" variant="ghost" onClick={() => setCreated(null)}>
            تسجيل شحنة أخرى
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-black">شحنة جديدة</h1>
      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-line bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المرسل">
            <Input name="senderName" required />
          </Field>
          <Field label="هاتف المرسل">
            <Input name="senderPhone" required dir="ltr" className="text-left" />
          </Field>
          <Field label="مدينة المرسل">
            <Input name="senderCity" />
          </Field>
          <Field label="دولة المرسل">
            <Input name="senderCountry" />
          </Field>
          <Field label="اسم المستلم">
            <Input name="receiverName" required />
          </Field>
          <Field label="هاتف المستلم">
            <Input name="receiverPhone" required dir="ltr" className="text-left" />
          </Field>
          <Field label="مدينة المستلم">
            <Input name="receiverCity" />
          </Field>
          <Field label="دولة المستلم">
            <Input name="receiverCountry" />
          </Field>
          <Field label="مدينة الانطلاق">
            <Input name="origin" required />
          </Field>
          <Field label="مدينة الوصول">
            <Input name="destination" required />
          </Field>
          <Field label="نوع الخدمة">
            <select name="serviceType" className="h-11 w-full rounded-xl border-2 border-line bg-surface px-3.5 text-sm font-semibold" defaultValue="land">
              <option value="land">شحن بري</option>
              <option value="sea">شحن بحري</option>
              <option value="air">شحن جوي</option>
            </select>
          </Field>
          <Field label="عدد الطرود">
            <Input name="pieces" type="number" min={1} defaultValue={1} />
          </Field>
          <Field label="الوزن بالكغ">
            <Input name="weightKg" type="number" step="0.1" min={0} />
          </Field>
          <Field label="وصف البضاعة">
            <Input name="packageDesc" />
          </Field>
        </div>
        <Field label="ملاحظات داخلية">
          <Textarea name="notes" />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ…" : "تسجيل الشحنة"}
        </Button>
      </form>
    </div>
  );
}
