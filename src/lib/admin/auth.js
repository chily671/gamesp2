import { timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "data-trap-admin";
const ADMIN_COOKIE_SECONDS = 8 * 60 * 60;
const JWT_ISSUER = "data-trap";
const JWT_AUDIENCE = "data-trap-admin";
let configuredPasswordHash;

export function isAdminAuthConfigured() {
  return (
    typeof process.env.ADMIN_USERNAME === "string" &&
    process.env.ADMIN_USERNAME.length > 0 &&
    process.env.ADMIN_USERNAME.length <= 64 &&
    typeof process.env.ADMIN_PASSWORD === "string" &&
    Buffer.byteLength(process.env.ADMIN_PASSWORD) >= 8 &&
    Buffer.byteLength(process.env.ADMIN_PASSWORD) <= 72 &&
    typeof process.env.ADMIN_JWT_SECRET === "string" &&
    Buffer.byteLength(process.env.ADMIN_JWT_SECRET) >= 32
  );
}

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret || Buffer.byteLength(secret) < 32) {
    const error = new Error(
      "ADMIN_JWT_SECRET must contain at least 32 bytes.",
    );
    error.code = "ADMIN_AUTH_NOT_CONFIGURED";
    throw error;
  }

  return secret;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminCookieDuration() {
  return ADMIN_COOKIE_SECONDS;
}

export function safeSecretMatch(provided, expected) {
  if (typeof provided !== "string" || typeof expected !== "string") {
    return false;
  }

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export function verifyAdminPassword(password) {
  if (typeof password !== "string" || password.length > 128) {
    return Promise.resolve(false);
  }

  if (!configuredPasswordHash) {
    configuredPasswordHash = bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  }
  return configuredPasswordHash.then((passwordHash) =>
    bcrypt.compare(password, passwordHash),
  );
}

export function createAdminCookieValue() {
  return jwt.sign(
    { sub: "admin", role: "admin" },
    getSecret(),
    {
      algorithm: "HS256",
      audience: JWT_AUDIENCE,
      expiresIn: ADMIN_COOKIE_SECONDS,
      issuer: JWT_ISSUER,
    },
  );
}

export function isAdminCookieValid(value) {
  if (typeof value !== "string" || !value) return false;

  try {
    const payload = jwt.verify(value, getSecret(), {
      algorithms: ["HS256"],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER,
    });
    return (
      typeof payload === "object" &&
      payload.sub === "admin" &&
      payload.role === "admin"
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return false;
    throw error;
  }
}
