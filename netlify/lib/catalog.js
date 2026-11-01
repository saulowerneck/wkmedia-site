// Catálogo vivo da WK Shop: fica no Netlify Blobs e, enquanto o painel nunca
// salvou nada, cai no seed versionado em shared/store.json.
import { getStore } from "@netlify/blobs";
import seed from "../../shared/store.json";
// Produtos prontos que entram sozinhos no catálogo vivo (uma vez; se forem removidos pelo painel, não voltam).
import auto from "../../shared/auto-products.json";

export const catalogStore = () => getStore({ name: "wk-shop", consistency: "strong" });
export const imageStore = () => getStore({ name: "wk-shop-images", consistency: "strong" });

export const autoIds = () => (auto.products || []).map((p) => p.id);

function withAutoProducts(cat) {
  const seen = new Set(cat.seedSeen || []);
  const ids = new Set(cat.products.map((p) => p.id));
  const slugs = new Set(cat.products.map((p) => p.slug));
  const extras = (auto.products || []).filter((p) => !seen.has(p.id) && !ids.has(p.id) && !slugs.has(p.slug));
  return extras.length ? { ...cat, products: [...cat.products, ...extras] } : cat;
}

export async function loadCatalog() {
  try {
    const data = await catalogStore().get("catalog", { type: "json" });
    if (data && Array.isArray(data.products) && data.settings) return withAutoProducts(data);
  } catch (err) {
    console.error("Falha ao ler catálogo do Blobs; usando seed:", err);
  }
  return withAutoProducts({ ...seed, version: 0 });
}

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
