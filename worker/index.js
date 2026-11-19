// WK Shop no Cloudflare Workers: serve o site (assets) e as funções com os mesmos caminhos do Netlify,
// então o front-end e o webhook do Mercado Pago não mudam.
import catalog from "../netlify/functions/catalog.js";
import adminCatalog from "../netlify/functions/admin-catalog.js";
import adminLogin from "../netlify/functions/admin-login.js";
import adminUpload from "../netlify/functions/admin-upload.js";
import createCheckout from "../netlify/functions/create-checkout.js";
import { handler as mpWebhookV1 } from "../netlify/functions/mp-webhook.js";
import { handler as notifyWhatsappV1 } from "../netlify/functions/notify-whatsapp.js";
import shopImage from "../netlify/functions/shop-image.js";
import { loadCatalog } from "../netlify/lib/catalog.js";

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
const brl = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function shopMeta(url) {
  const origin = url.origin;
  const meta = {
    title: "WK Shop | Perfumes, skincare coreano, vinhos e licores importados",
    description: "Produtos importados originais sob encomenda: perfumes, skincare coreano, vinhos, licores e mais. Parcele em até 6x e envio para todo o Brasil.",
    image: `${origin}/og-loja.jpg`,
    url: `${origin}/loja`,
    w: "1200",
    h: "630",
  };
  const slug = url.pathname.match(/^\/loja\/([^/]+)\/?$/)?.[1];
  if (slug) {
    try {
      const { products = [] } = await loadCatalog();
      const p = products.find((x) => x.slug === slug && x.active !== false);
      if (p) {
        const img = p.images?.[0];
        meta.title = `${p.name} | WK Shop`;
        meta.description = `${p.name} por ${brl(p.price)}. Produto original${p.brand ? ` ${p.brand}` : ""} importado, sob encomenda. Parcele em até 6x na WK Shop.`;
        if (img) meta.image = img.startsWith("http") ? img : `${origin}${img}`;
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

const routes = {
  catalog,
  "admin-catalog": adminCatalog,
  "admin-login": adminLogin,
  "admin-upload": adminUpload,
  "create-checkout": createCheckout,
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
