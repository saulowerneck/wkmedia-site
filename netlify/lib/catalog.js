// Catálogo vivo da WK Shop: fica no Netlify Blobs e, enquanto o painel nunca
// salvou nada, cai no seed versionado em shared/store.json.
import { getStore } from "@netlify/blobs";
import seed from "../../shared/store.json";

export const catalogStore = () => getStore({ name: "wk-shop", consistency: "strong" });
export const imageStore = () => getStore({ name: "wk-shop-images", consistency: "strong" });

export async function loadCatalog() {
  try {
    const data = await catalogStore().get("catalog", { type: "json" });
    if (data && Array.isArray(data.products) && data.settings) return data;
  } catch (err) {
    console.error("Falha ao ler catálogo do Blobs; usando seed:", err);
  }
  return { ...seed, version: 0 };
}

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
