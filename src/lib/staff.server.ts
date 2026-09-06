import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { STAFF_COOKIE } from "./staff";

const STAFF_USERNAME = "alhassan";
const STAFF_PASSWORD = "444222";
const SECRET = new TextEncoder().encode(
  process.env.STAFF_JWT_SECRET ?? "ah-staff-jwt-v2-7c91e4b0d6a28f35",
);
const MAX_AGE = 60 * 60 * 24 * 7;

function cookieSecure() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export function credentialsOk(username: string, password: string) {
  return username.trim().toLowerCase() === STAFF_USERNAME && password === STAFF_PASSWORD;
}

export async function issueStaffToken() {
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
