import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { STAFF_COOKIE } from "./staff";

const STAFF_USERNAME = process.env.STAFF_USERNAME?.trim() ?? "";
const STAFF_PASSWORD = process.env.STAFF_PASSWORD ?? "";
const STAFF_JWT_SECRET = process.env.STAFF_JWT_SECRET ?? "";
const SECRET = new TextEncoder().encode(STAFF_JWT_SECRET);
const MAX_AGE = 60 * 60 * 24 * 7;

function cookieSecure() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export function credentialsOk(username: string, password: string) {
  return username.trim().toLowerCase() === STAFF_USERNAME && password === STAFF_PASSWORD;
}

export async function issueStaffToken() {
  if (!STAFF_USERNAME || !STAFF_PASSWORD || !STAFF_JWT_SECRET) {
    throw new Error("Staff authentication is not configured");
  }
  return new SignJWT({ role: "staff" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(STAFF_USERNAME)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifyStaffToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.sub === STAFF_USERNAME ? STAFF_USERNAME : null;
  } catch {
    return null;
  }
}

export function setStaffCookie(token: string) {
  setCookie(STAFF_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    secure: cookieSecure(),
  });
}

export function clearStaffCookie() {
  setCookie(STAFF_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: cookieSecure(),
  });
}

export function readStaffCookie() {
  return getCookie(STAFF_COOKIE);
}
