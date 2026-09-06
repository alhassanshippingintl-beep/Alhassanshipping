import { getRequest } from "@tanstack/react-start/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp() {
  try {
    const req = getRequest();
    const h = req?.headers;
    const forwarded = h?.get("x-forwarded-for") ?? "";
    const ip = forwarded.split(",")[0]?.trim() || h?.get("x-real-ip") || "unknown";
    return ip;
  } catch {
    return "unknown";
  }
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  cur.count += 1;
  if (cur.count > limit) {
    throw new Error("محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.");
  }
}
