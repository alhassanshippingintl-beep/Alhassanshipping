import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ContactLink, WhatsAppIcon } from "@/components/contact-links";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { COMPANY, waLink } from "@/lib/company";
import { SERVICES } from "@/lib/services";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-on-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverted />
          <p className="mt-4 text-sm leading-7 text-on-navy/65">{COMPANY.taglineAr}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black">خدماتنا</h3>
          <ul className="space-y-2 text-sm text-on-navy/70">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-on-navy">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black">تواصل</h3>
          <ul className="space-y-3 text-sm text-on-navy/70">
            {COMPANY.phones.map((p) => (
              <li key={p.e164}>
                <ContactLink channel={p} className="text-on-navy/80 hover:text-on-navy" />
              </li>
            ))}
            <li>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-on-navy">
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black">روابط</h3>
          <ul className="space-y-2 text-sm text-on-navy/70">
            <li>
              <a
                href={waLink(undefined, "مرحبا، أريد الاستفسار عن شحن")}
                className="inline-flex items-center gap-2 hover:text-on-navy"
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="size-4 text-ok" />
                واتساب السعودية
              </a>
            </li>
            <li>{COMPANY.hours}</li>
            <li>
              <Link to="/reviews" className="hover:text-on-navy">
                آراء العملاء
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-on-navy">
                تتبّع شحنة
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-on-navy/40 hover:text-on-navy/70">
                دخول الموظفين
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-on-navy/10 py-5 text-center text-xs text-on-navy/40">
        © {new Date().getFullYear()} {COMPANY.nameAr} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
