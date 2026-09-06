import { createServerFn } from "@tanstack/react-start";
import { peekStaffMiddleware } from "@/lib/staff-middleware";

export const staffLogin = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => ({
    username: String(data.username ?? "").trim(),
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }) => {
    const { assertRateLimit, clientIp } = await import("@/lib/rate-limit.server");
    assertRateLimit(`login:${clientIp()}`, 5, 15 * 60 * 1000);
    const staff = await import("@/lib/staff.server");
    if (!staff.credentialsOk(data.username, data.password)) {
      throw new Error("اسم المستخدم أو الرقم السري غير صحيح");
    }
    const token = await staff.issueStaffToken();
    staff.setStaffCookie(token);
    return { ok: true as const, token };
  });

export const staffLogout = createServerFn({ method: "POST" }).handler(async () => {
  const staff = await import("@/lib/staff.server");
  staff.clearStaffCookie();
  return { ok: true as const };
});

export const getStaffSession = createServerFn({ method: "GET" })
  .middleware([peekStaffMiddleware])
  .handler(async ({ context }) => {
    return { ok: Boolean(context.userId), user: context.userId };
  });
