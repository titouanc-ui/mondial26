import crypto from "node:crypto";
import type { SessionSnapshot } from "./engine";

const SECRET =
  process.env.QUIZ_SESSION_SECRET ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "dev-secret-do-not-use-in-prod-please-set-QUIZ_SESSION_SECRET";

const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes max par session

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

function hmac(payload: string): string {
  return b64url(crypto.createHmac("sha256", SECRET).update(payload).digest());
}

export function encodeSessionToken(snapshot: SessionSnapshot): string {
  const payload = b64url(Buffer.from(JSON.stringify(snapshot)));
  const sig = hmac(payload);
  return `${payload}.${sig}`;
}

export function decodeSessionToken(token: string): SessionSnapshot {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) throw new Error("Token malformé");

  const expected = hmac(payload);
  // Comparaison en temps constant
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    throw new Error("Signature invalide");
  }

  const snapshot = JSON.parse(fromB64url(payload).toString("utf-8")) as SessionSnapshot;

  if (Date.now() - snapshot.createdAt > SESSION_TTL_MS) {
    throw new Error("Session expirée");
  }

  return snapshot;
}
