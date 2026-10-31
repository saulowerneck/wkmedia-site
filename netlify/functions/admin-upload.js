// POST { dataBase64 } (JPEG/PNG/WebP até 3MB) -> { url: "/loja-img/<chave>" } (exige token)
import crypto from "node:crypto";
import { imageStore, json } from "../lib/catalog.js";
import { isAuthorized } from "../lib/auth.js";

const MAX_BYTES = 3 * 1024 * 1024;

function detectType(buf) {
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ["image/jpeg", "jpg"];
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ["image/png", "png"];
  if (buf.length > 12 && buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return ["image/webp", "webp"];
  return null;
}

export default async (req) => {
  if (!isAuthorized(req)) return json(401, { error: "unauthorized", message: "Sessão expirada. Entre novamente." });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "bad_request", message: "Dados inválidos." });
  }
  const b64 = String(body.dataBase64 || "").replace(/^data:[^,]+,/, "");
  const buf = Buffer.from(b64, "base64");
  if (!buf.length) return json(400, { error: "empty", message: "Imagem vazia." });
  if (buf.length > MAX_BYTES) return json(413, { error: "too_large", message: "Imagem maior que 3 MB." });
  const type = detectType(buf);
  if (!type) return json(400, { error: "bad_type", message: "Use imagem JPG, PNG ou WebP." });

  const key = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.${type[1]}`;
  await imageStore().set(key, buf, { metadata: { contentType: type[0] } });
  return json(200, { url: `/loja-img/${key}` });
};
