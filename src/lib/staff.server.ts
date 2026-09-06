import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { STAFF_COOKIE } from "./staff";

const STAFF_USERNAME = "alhassan";
const STAFF_PASSWORD = "444222";
const SECRET = new TextEncoder().encode("alhassan-staff-session-v1");
const MAX_AGE = 60 * 60 * 24 * 30;

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
    secure: true,
  });
}

export function clearStaffCookie() {
  setCookie(STAFF_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: true,
  });
}

export function readStaffCookie() {
  return getCookie(STAFF_COOKIE);
}
