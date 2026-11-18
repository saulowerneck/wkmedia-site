// Catálogo vivo da WK Shop: fica no Netlify Blobs e, enquanto o painel nunca
// salvou nada, cai no seed versionado em shared/store.json.
import { getStore } from "@netlify/blobs";
import seed from "../../shared/store.json";
// Cópia embutida no deploy: serve de reserva se o GitHub estiver fora do ar.
import bundledAuto from "../../shared/auto-products.json";
import { sanitizeProduct } from "./validate.js";
import { cfCatalogStore, cfImageStore } from "./cf-stores.js";

// No Cloudflare o Worker coloca os bindings (D1 "DB" e KV "IMAGES") em globalThis.__WK_ENV.
const cfEnv = () => globalThis.__WK_ENV;
export const catalogStore = () =>
  cfEnv()?.DB ? cfCatalogStore(cfEnv().DB) : getStore({ name: "wk-shop", consistency: "strong" });
export const imageStore = () =>
  cfEnv()?.IMAGES ? cfImageStore(cfEnv().IMAGES) : getStore({ name: "wk-shop-images", consistency: "strong" });

// Produtos prontos (shared/auto-products.json) lidos direto do GitHub: produto novo entra só com commit, sem deploy.
const AUTO_URL =
  process.env.AUTO_PRODUCTS_URL ||
  "https://raw.githubusercontent.com/saulowerneck/wkmedia-site/main/shared/auto-products.json";
const AUTO_TTL_MS = 30_000;
let autoCache = { at: 0, list: null };

async function loadAutoProducts() {
  const bundled = bundledAuto.products || [];
  if (autoCache.list && Date.now() - autoCache.at < AUTO_TTL_MS) return autoCache.list;
  let list = bundled;
  try {
    const res = await fetch(AUTO_URL, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const remote = (Array.isArray(data?.products) ? data.products : []).map((p, i) => {
        try {
          return sanitizeProduct(p, i);
        } catch {
          return null;
        }
      }).filter(Boolean);
      // Trava de segurança: arquivo truncado/quebrado no GitHub não pode esvaziar a loja.
      if (remote.length >= Math.floor(bundled.length * 0.5)) list = remote;
    }
  } catch (err) {
    console.error("Falha ao ler produtos do GitHub; usando a cópia do deploy:", err?.message || err);
  }
  autoCache = { at: Date.now(), list };
  return list;
}

export const autoIds = async () => (await loadAutoProducts()).map((p) => p.id);

async function withAutoProducts(cat) {
  const auto = await loadAutoProducts();
  const seen = new Set(cat.seedSeen || []);
  const ids = new Set(cat.products.map((p) => p.id));
  const slugs = new Set(cat.products.map((p) => p.slug));
  const extras = auto.filter((p) => !seen.has(p.id) && !ids.has(p.id) && !slugs.has(p.slug));
  return extras.length ? { ...cat, products: [...cat.products, ...extras] } : cat;
}

export async function loadCatalog() {
  try {
    const data = await catalogStore().get("catalog", { type: "json" });
    if (data && Array.isArray(data.products) && data.settings) return await withAutoProducts(data);
  } catch (err) {
    console.error("Falha ao ler catálogo do Blobs; usando seed:", err);
  }
  return await withAutoProducts({ ...seed, version: 0 });
}

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
