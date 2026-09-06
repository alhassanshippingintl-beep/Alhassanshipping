import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ContactList } from "@/components/contact-links";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/track", label: "تتبّع شحنة" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-brand bg-surface shadow-sm">
      <div className="border-b border-on-navy/10 bg-navy text-xs text-on-navy/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-2">
          <ContactList className="flex flex-wrap gap-x-5 gap-y-1" itemClassName="text-on-navy/80 hover:text-on-navy" />
          <span className="hidden sm:inline">{COMPANY.hours}</span>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || (item.to === "/track" && pathname.startsWith("/track"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-bold transition-colors",
                  active ? "bg-brand/8 text-brand" : "text-navy/80 hover:bg-brand/6 hover:text-brand",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/services/$slug"
            params={{ slug: "land" }}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-bold transition-colors",
              pathname.startsWith("/services") ? "bg-brand/8 text-brand" : "text-navy/80 hover:bg-brand/6 hover:text-brand",
            )}
          >
            خدماتنا
          </Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" variant="ghost">
            <Link to="/login">دخول الموظفين</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/contact">اطلب شحنًا</Link>
          </Button>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-line lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-1 border-t border-line bg-surface px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-bold text-navy hover:bg-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/services/$slug"
            params={{ slug: "land" }}
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-bold text-navy hover:bg-paper"
          >
            خدماتنا
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-brand px-4 py-3 text-center text-sm font-bold text-on-navy"
          >
            اطلب شحنًا
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-muted"
          >
            <LayoutDashboard className="size-4" />
            دخول الموظفين
          </Link>
        </div>
      ) : null}
    </header>
  );
}
