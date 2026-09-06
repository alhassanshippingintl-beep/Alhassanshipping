import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { setStaffToken } from "@/lib/staff";
import { staffLogin } from "@/lib/staff.fn";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    try {
      const res = await staffLogin({
        data: {
          username: String(fd.get("username") ?? ""),
          password: String(fd.get("password") ?? ""),
        },
      });
      setStaffToken(res.token);
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الدخول");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-black">دخول الموظفين</h1>
        <p className="mt-1 mb-6 text-center text-sm text-muted">لتسجيل الشحنات وتحديث حالتها. العملاء يتتبّعون بدون حساب.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="اسم المستخدم">
            <Input name="username" required autoComplete="username" dir="ltr" className="text-left" />
          </Field>
          <Field label="الرقم السري">
            <Input name="password" type="password" required autoComplete="current-password" dir="ltr" className="text-left" />
          </Field>
          {error ? <p className="text-sm font-bold text-brand">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "جارٍ…" : "دخول"}
          </Button>
        </form>
        <a
          href="/alhassan-backend.txt"
          download="alhassan-backend.txt"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-navy bg-navy text-sm font-bold text-on-navy hover:bg-navy-2"
        >
          <Download className="size-4" />
          تحميل ملف الباك اند
        </a>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-bold text-brand">
            العودة للموقع
          </Link>
        </p>
      </div>
    </main>
  );
}
