// Autenticação simples do painel: senha única (ADMIN_PASSWORD) -> token assinado com validade.
import crypto from "node:crypto";

const secret = () => `wkshop:${process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || ""}`;
const hmac = (value) => crypto.createHmac("sha256", secret()).update(value).digest("hex");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();

export function passwordMatches(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return crypto.timingSafeEqual(sha(input), sha(expected));
}

export function signToken(ttlMs = 12 * 60 * 60 * 1000) {
  const exp = String(Date.now() + ttlMs);
  return `${exp}.${hmac(exp)}`;
}

export function verifyToken(token) {
  if (!process.env.ADMIN_PASSWORD || typeof token !== "string") return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  const good = hmac(exp);
  if (sig.length !== good.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

export function isAuthorized(req) {
  const h = req.headers.get("authorization") || "";
  return verifyToken(h.replace(/^Bearer\s+/i, ""));
}
