import { createMiddleware } from "@tanstack/react-start";

export class StaffUnauthorizedError extends Error {
  readonly status = 401;
  constructor() {
    super("Unauthorized");
    this.name = "StaffUnauthorizedError";
  }
}

export const staffMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getStaffToken } = await import("./staff");
    return next({ sendContext: { staffToken: getStaffToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();
    const staff = await import("./staff.server");
    const userId =
      (await staff.verifyStaffToken(context.staffToken)) ??
      (await staff.verifyStaffToken(staff.readStaffCookie()));
    if (!userId) throw new StaffUnauthorizedError();
    return next({ context: { userId } });
  });

export const peekStaffMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getStaffToken } = await import("./staff");
    return next({ sendContext: { staffToken: getStaffToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const staff = await import("./staff.server");
    const userId =
      (await staff.verifyStaffToken(context.staffToken)) ??
      (await staff.verifyStaffToken(staff.readStaffCookie()));
    return next({ context: { userId: userId ?? null } });
  });
