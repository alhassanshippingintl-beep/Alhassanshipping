import { createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { STAFF_COOKIE } from "./staff";

// Credentials are stored as one-way digests; plaintext password is never shipped.
const STAFF_USERNAME = Buffer.from("YWxoYXNzYW4=", "base64").toString("utf8");
const STAFF_SALT = "6177d66626cb7d56367bcdbcce1756f1";
const STAFF_USERNAME_HASH = "709cbc7cb984078f7323635ba1990606743ea64c52774c9deaeebab029539c58";
const STAFF_PASSWORD_HASH = "4874cd2c8adfb9167a01a331dcb2c4c9468be803640caf408d6bf5da4a76c6ac";
const SECRET = new TextEncoder().encode(
  "a62f4e25b7facc7969d112103e9f46d44f6180afed742f5aae661179a381225b",
);
const MAX_AGE = 60 * 60 * 24 * 7;

function credentialHash(value: string) {
  return createHash("sha256").update(`${STAFF_SALT}:${value}`).digest("hex");
}

function cookieSecure() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export function credentialsOk(username: string, password: string) {
  return (
    credentialHash(username.trim().toLowerCase()) === STAFF_USERNAME_HASH &&
    credentialHash(password) === STAFF_PASSWORD_HASH
  );
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
