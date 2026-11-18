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

    return env.ASSETS.fetch(req);
  },
};
