import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toIso(v: unknown) {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string" && v) return v;
  return new Date().toISOString();
}

export function toNumber(v: unknown) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function maskPhone(phone: string) {
  const raw = phone.trim();
  if (raw.length < 8) return raw;
  return `${raw.slice(0, 4)}••••${raw.slice(-3)}`;
}

export function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function requireText(value: unknown, label: string, min = 2, max = 200) {
  const t = String(value ?? "").trim();
  if (t.length < min || t.length > max) throw new Error(`${label} غير صالح`);
  return t;
}
