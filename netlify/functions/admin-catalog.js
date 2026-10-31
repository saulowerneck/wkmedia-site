// GET -> catálogo atual | PUT { catalog, baseVersion } -> salva (exige token do painel)
import { catalogStore, loadCatalog, json } from "../lib/catalog.js";
import { isAuthorized } from "../lib/auth.js";
import { sanitizeCatalog } from "../lib/validate.js";

export default async (req) => {
  if (!isAuthorized(req)) return json(401, { error: "unauthorized", message: "Sessão expirada. Entre novamente." });

  if (req.method === "GET") return json(200, await loadCatalog(), { "Cache-Control": "no-store" });

  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "bad_request", message: "Dados inválidos." });
    }
    let clean;
    try {
      clean = sanitizeCatalog(body.catalog);
    } catch (err) {
      return json(400, { error: "invalid", message: err.message });
    }
    const current = await loadCatalog();
    if (Number(body.baseVersion ?? 0) !== Number(current.version ?? 0)) {
      return json(409, { error: "conflict", message: "O catálogo foi alterado em outra aba ou dispositivo. Recarregue o painel antes de salvar." });
    }
    const saved = { ...clean, version: Number(current.version ?? 0) + 1, updatedAt: new Date().toISOString() };
    await catalogStore().setJSON("catalog", saved);
    return json(200, saved, { "Cache-Control": "no-store" });
  }

  return json(405, { error: "method_not_allowed" });
};
