export type ContactChannel = {
  label: string;
  display: string;
  e164: string;
  kind: "call" | "whatsapp";
};

export const COMPANY = {
  nameAr: "الحسن للشحن الدولي",
  nameEn: "Al Hassan International Shipping",
  shortAr: "الحسن",
  taglineAr: "حلول نقل سريعة وفعالة من الباب إلى الباب",
  taglineEn: "Fast, reliable land · sea · air logistics",
  founded: 2002,
  email: "alhassan.shipping.intl@gmail.com",
  phones: [
    { label: "مصر", display: "+201008544690", e164: "+201008544690", kind: "call" },
    { label: "السعودية", display: "+966570552274", e164: "+966570552274", kind: "whatsapp" },
    { label: "الأردن", display: "+962777011201", e164: "+962777011201", kind: "whatsapp" },
  ] as const satisfies readonly ContactChannel[],
  hours: "السبت — الخميس، 9:00 صباحًا إلى 6:00 مساءً",
  hoursNote: "الجمعة إجازة · واتساب على أرقام السعودية والأردن",
  sampleTracking: ["AH-2026-10001", "AH-2026-10002", "AH-2026-10003"],
} as const;

export const PRIMARY_WHATSAPP = COMPANY.phones.find((p) => p.kind === "whatsapp")!;

export function waDigits(e164: string) {
  return e164.replace(/\D/g, "");
}

export function waLink(e164: string = PRIMARY_WHATSAPP.e164, text?: string) {
  const base = `https://wa.me/${waDigits(e164)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telLink(e164: string) {
  return `tel:${e164}`;
}

export function contactHref(channel: ContactChannel, text?: string) {
  return channel.kind === "whatsapp" ? waLink(channel.e164, text) : telLink(channel.e164);
}
