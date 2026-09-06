export const STAFF_COOKIE = "ah_staff";
export const STAFF_TOKEN_KEY = "ah-staff-token";

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STAFF_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStaffToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.sessionStorage.setItem(STAFF_TOKEN_KEY, token);
    else window.sessionStorage.removeItem(STAFF_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
