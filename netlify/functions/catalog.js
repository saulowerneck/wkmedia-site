// GET público: catálogo atual da WK Shop (Blobs, com fallback para o seed).
import { loadCatalog, json } from "../lib/catalog.js";

export default async () => {
  const catalog = await loadCatalog();
  return json(200, catalog, { "Cache-Control": "public, max-age=20" });
};
