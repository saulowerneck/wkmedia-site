// WK Shop no Cloudflare Workers: serve o site (assets) e as funções com os mesmos caminhos do Netlify,
// então o front-end e o webhook do Mercado Pago não mudam.
import catalog from "../netlify/functions/catalog.js";
import adminCatalog from "../netlify/functions/admin-catalog.js";
import adminLogin from "../netlify/functions/admin-login.js";
import adminUpload from "../netlify/functions/admin-upload.js";
import createCheckout from "../netlify/functions/create-checkout.js";
import pixStatus from "../netlify/functions/pix-status.js";
import { handler as mpWebhookV1 } from "../netlify/functions/mp-webhook.js";
import { handler as notifyWhatsappV1 } from "../netlify/functions/notify-whatsapp.js";
import shopImage from "../netlify/functions/shop-image.js";
import { loadCatalog } from "../netlify/lib/catalog.js";
import { applyPromo, promoActive } from "../netlify/lib/promo.js";
import promoCfg from "../shared/promo.json";

// mp-webhook e notify-whatsapp usam o formato antigo do Netlify (event -> {statusCode, body}); adaptamos para Request/Response.
const fromV1 = (handler) => async (req) => {
  const url = new URL(req.url);
  const result = await handler({
    httpMethod: req.method,
    headers: Object.fromEntries(req.headers),
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: req.method === "GET" || req.method === "HEAD" ? null : await req.text(),
  });
  return new Response(result.body ?? "", { status: result.statusCode || 200, headers: result.headers });
};
const mpWebhook = fromV1(mpWebhookV1);
const notifyWhatsapp = fromV1(notifyWhatsappV1);

// Prévia de link (WhatsApp, Instagram etc.): as páginas /loja e /loja/<produto> usam o index.html do site da agência,
// então trocamos título, descrição e imagem pelas da loja (e do produto, quando for o caso).
// Chave da capa Black Friday no KV (/loja-img/<chave>); preencher depois do upload.
const BF_COVER = "mwnnx1cu-6b36d18a.jpg";
const promoEnd = new Date(promoCfg.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
const brl = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function shopMeta(url) {
  const origin = url.origin;
  const meta = {
    title: "WK Shop | Perfumes, skincare coreano, vinhos e licores importados",
    description: "Produtos importados originais sob encomenda: perfumes, skincare coreano, vinhos, licores e mais. Parcele em até 6x e envio para todo o Brasil.",
    image: `${origin}/loja-img/mwmtov6e-45e398c0.jpg`, // capa: vinhos, celulares, coreanos, creme VS, perfumes, licores
    url: `${origin}/loja`,
    w: "1200",
    h: "630",
  };
  const bf = promoActive();
  if (bf) {
    meta.title = `Black Friday WK Shop | 20% OFF em tudo até ${promoEnd}`;
    meta.description = `Black Friday na WK Shop: 20% OFF em perfumes, skincare coreano, vinhos, licores, celulares e mais. Só até ${promoEnd}. Pix ou cartão em até 6x.`;
    if (BF_COVER) meta.image = `${origin}/loja-img/${BF_COVER}`; // capa Black Friday 1200x630 (vazio = usa a capa normal)
  }
  const slug = url.pathname.match(/^\/loja\/([^/]+)\/?$/)?.[1];
  if (slug) {
    try {
      const { products = [] } = applyPromo(await loadCatalog());
      const p = products.find((x) => x.slug === slug && x.active !== false);
      if (p) {
        const img = p.images?.[0];
        const off = p.promo && p.compareAtPrice > p.price;
        meta.title = off ? `${p.name} | Black Friday WK Shop` : `${p.name} | WK Shop`;
        meta.description = off
          ? `BLACK FRIDAY: ${p.name} de ${brl(p.compareAtPrice)} por ${brl(p.price)} (${Math.round((1 - p.price / p.compareAtPrice) * 100)}% OFF), só até ${promoEnd}. Produto original importado. Pix ou cartão em até 6x.`
          : `${p.name} por ${brl(p.price)}. Produto original${p.brand ? ` ${p.brand}` : ""} importado, sob encomenda. Parcele em até 6x na WK Shop.`;
        if (img) meta.image = img.startsWith("http") ? img : `${origin}${img}`;
        if (off && img && !img.startsWith("http")) meta.image = `${origin}/loja-og/${slug}.jpg`; // foto com a tag Black Friday por cima
        meta.url = `${origin}/loja/${slug}`;
        meta.w = meta.h = "900";
      }
    } catch {}
  }
  return meta;
}

async function withShopMeta(res, url) {
  if (!(res.headers.get("content-type") || "").includes("text/html")) return res;
  const m = await shopMeta(url);
  const rw = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(m.title) })
    .on('meta[name="description"]', { element: (el) => el.setAttribute("content", m.description) })
    .on('meta[property="og:title"], meta[name="twitter:title"]', { element: (el) => el.setAttribute("content", m.title) })
    .on('meta[property="og:description"], meta[name="twitter:description"]', { element: (el) => el.setAttribute("content", m.description) })
    .on('meta[property="og:image"], meta[name="twitter:image"]', { element: (el) => el.setAttribute("content", m.image) })
    .on('meta[property="og:image:width"]', { element: (el) => el.setAttribute("content", m.w) })
    .on('meta[property="og:image:height"]', { element: (el) => el.setAttribute("content", m.h) })
    .on('meta[property="og:url"]', { element: (el) => el.setAttribute("content", m.url) })
    .on('meta[property="og:site_name"]', { element: (el) => el.setAttribute("content", "WK Shop") })
    .on('link[rel="canonical"]', { element: (el) => el.setAttribute("href", m.url) });
  const out = new Response(rw.transform(res).body, res);
  out.headers.set("Cache-Control", "public, max-age=300");
  return out;
}

// Foto do produto com a tag Black Friday por cima (prévia de link). Fora do período, ou se o Cloudflare Images
// falhar, devolve a foto normal: a prévia nunca quebra.
async function bfPhoto(req, url, env, ctx) {
  const slug = decodeURIComponent(url.pathname.match(/^\/loja-og\/([^/]+)\.jpg$/)?.[1] || "");
  const { products = [] } = await loadCatalog();
  const p = products.find((x) => x.slug === slug && x.active !== false);
  const src = p?.images?.[0];
  if (!src || src.startsWith("http")) return new Response("not found", { status: 404 });
  const plain = () =>
    src.startsWith("/loja-img/")
      ? shopImage(new Request(new URL(`/.netlify/functions/shop-image?key=${encodeURIComponent(src.split("/").pop())}`, url.origin)))
      : env.ASSETS.fetch(new Request(new URL(src, url.origin)));
  if (!env.IMG || !promoActive()) return plain();

  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/loja-og/${slug}.jpg?v=1`);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  try {
    const [photo, overlay] = await Promise.all([plain(), env.ASSETS.fetch(new Request(new URL("/bf-overlay.png", url.origin)))]);
    if (!photo.ok || !photo.body || !overlay.ok || !overlay.body) return photo.ok ? photo : plain();
    const out = await env.IMG.input(photo.body)
      .transform({ width: 900, height: 900, fit: "contain", background: "#ffffff" })
      .draw(env.IMG.input(overlay.body), { top: 0, left: 0 })
      .output({ format: "image/jpeg", quality: 85 });
    const res = new Response(out.image(), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600" } });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    console.error("Imagem Black Friday falhou, usando a foto normal:", err?.message || err);
    return plain();
  }
}

const routes = {
  catalog,
  "admin-catalog": adminCatalog,
  "admin-login": adminLogin,
  "admin-upload": adminUpload,
  "create-checkout": createCheckout,
  "pix-status": pixStatus,
  "mp-webhook": mpWebhook,
  "notify-whatsapp": notifyWhatsapp,
  "shop-image": shopImage,
};

export default {
  async fetch(req, env, ctx) {
    globalThis.__WK_ENV = env;
    // process.env (nodejs_compat) já recebe vars e secrets do Worker.
    const url = new URL(req.url);

    const fn = url.pathname.match(/^\/\.netlify\/functions\/([\w-]+)\/?$/);
    if (fn && routes[fn[1]]) return routes[fn[1]](req, { waitUntil: (p) => ctx.waitUntil(p) });

    // Formulário de contato (antes Netlify Forms): POST em "/" com form-name=contato -> aviso no WhatsApp.
    if (req.method === "POST" && url.pathname === "/") {
      const form = new URLSearchParams(await req.text());
      if (form.get("form-name") !== "contato") return new Response("bad request", { status: 400 });
      if (form.get("bot-field")) return new Response("ok");
      const data = Object.fromEntries(form);
      ctx.waitUntil(notifyWhatsappV1({ body: JSON.stringify({ payload: { data } }) }));
      return new Response("ok");
    }

    if ((req.method === "GET" || req.method === "HEAD") && /^\/loja-og\/[^/]+\.jpg$/.test(url.pathname)) return bfPhoto(req, url, env, ctx);

    const img = url.pathname.match(/^\/loja-img\/([^/]+)$/);
    if (img) {
      const target = new URL(req.url);
      target.pathname = "/.netlify/functions/shop-image";
      target.search = `?key=${encodeURIComponent(img[1])}`;
      return shopImage(new Request(target, req));
    }

    if ((req.method === "GET" || req.method === "HEAD") && /^\/loja(\/[^/.]+)?\/?$/.test(url.pathname)) {
      return withShopMeta(await env.ASSETS.fetch(req), url);
    }

    return env.ASSETS.fetch(req);
  },
};
