// POST { password } -> { token } (12h). Lento de propósito em caso de erro.
import { json } from "../lib/catalog.js";
import { passwordMatches, signToken } from "../lib/auth.js";

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (!process.env.ADMIN_PASSWORD) return json(503, { error: "not_configured", message: "ADMIN_PASSWORD ainda não foi configurada no Netlify." });
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* corpo inválido */
  }
  if (!passwordMatches(body.password ?? "")) {
    await new Promise((r) => setTimeout(r, 800));
    return json(401, { error: "invalid_password", message: "Senha incorreta." });
  }
  return json(200, { token: signToken() });
};
