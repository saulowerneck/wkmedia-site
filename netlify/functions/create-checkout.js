// WK Shop — cria a preferência de pagamento no Mercado Pago (Checkout Pro).
// Preços, frete e estoque vêm SEMPRE do catálogo no servidor (painel/Blobs ou seed),
// nunca do navegador.
//
// Variáveis de ambiente (Netlify):
//   MP_ACCESS_TOKEN  -> Access Token de produção do Mercado Pago (APP_USR-...)
//   SITE_URL         -> opcional, padrão https://wkmedia.com.br
import { loadCatalog, json } from "../lib/catalog.js";

const digits = (s) => String(s || "").replace(/\D/g, "");
const money = (n) => Math.round(n * 100) / 100;
const MAX_MADE_TO_ORDER_QTY = 20;

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json(503, { error: "not_configured" });

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "bad_request", message: "Pedido inválido." });
  }

  const { settings, products } = await loadCatalog();
  const items = Array.isArray(input.items) ? input.items : [];
  const customer = input.customer || {};
  const delivery = input.delivery || {};

  // 1) valida itens e estoque com os dados do servidor
  const lines = [];
  for (const it of items) {
    const product = products.find((p) => p.id === it.id && p.active !== false);
    const qty = Math.floor(Number(it.qty));
    if (!product || !(qty > 0)) return json(400, { error: "invalid_item", message: "Há um item inválido no carrinho." });
    const limit = product.madeToOrder ? MAX_MADE_TO_ORDER_QTY : product.stock;
    if (qty > limit) return json(409, { error: "no_stock", message: `Quantidade indisponível para "${product.name}".` });
    lines.push({ product, qty });
  }
  if (lines.length === 0) return json(400, { error: "empty_cart", message: "Carrinho vazio." });

  // 2) valida cliente
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim();
  const phone = digits(customer.phone);
  if (name.length < 3 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 10)
    return json(400, { error: "invalid_customer", message: "Confira nome, e-mail e WhatsApp." });

  // 3) entrega e frete (calculado no servidor)
  const subtotal = money(lines.reduce((n, l) => n + l.product.price * l.qty, 0));
  const method = delivery.method === "pickup" ? "pickup" : "ship";
  if (method === "pickup" && !settings.pickup.enabled) return json(400, { error: "invalid_delivery", message: "Retirada indisponível." });
  if (method === "ship" && !settings.shipping.enabled) return json(400, { error: "invalid_delivery", message: "Envio indisponível." });

  let shipping = 0;
  let addressText = "";
  if (method === "ship") {
    const a = delivery.address || {};
    if (digits(a.cep).length !== 8 || !a.street || !a.number || !a.city || String(a.state || "").length !== 2)
      return json(400, { error: "invalid_address", message: "Complete o endereço de entrega." });
    const free = settings.shipping.freeFrom;
    shipping = free > 0 && subtotal >= free ? 0 : settings.shipping.flatRate;
    addressText = `${a.street}, ${a.number}${a.complement ? ` ${a.complement}` : ""} - ${a.district || ""}, ${a.city}/${String(a.state).toUpperCase()}, CEP ${digits(a.cep)}`;
  }

  // 4) monta a preferência
  const orderId = `WK-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const site = (process.env.SITE_URL || "https://wkmedia.com.br").replace(/\/$/, "");
  const title = (p) => (p.size ? `${p.name} (${p.size})` : p.name).slice(0, 250);

  const mpItems = lines.map((l) => ({
    id: l.product.id,
    title: title(l.product),
    quantity: l.qty,
    unit_price: money(l.product.price),
    currency_id: "BRL",
    picture_url: l.product.images?.[0] ? `${site}${l.product.images[0]}` : undefined,
  }));
  if (shipping > 0) {
    mpItems.push({ id: "frete", title: "Frete", quantity: 1, unit_price: money(shipping), currency_id: "BRL" });
  }

  const preference = {
    items: mpItems,
    payer: {
      name,
      email,
      phone: { area_code: phone.slice(0, 2), number: phone.slice(2) },
    },
    back_urls: {
      success: `${site}/pedido/sucesso`,
      pending: `${site}/pedido/pendente`,
      failure: `${site}/pedido/falha`,
    },
    auto_return: "approved",
    notification_url: `${site}/.netlify/functions/mp-webhook`,
    external_reference: orderId,
    statement_descriptor: "WKSHOP",
    payment_methods: { installments: settings.installments || 1 },
    metadata: {
      order_id: orderId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      delivery_method: method,
      delivery_address: addressText,
      items_summary: lines.map((l) => `${l.qty}x ${title(l.product)}${l.product.madeToOrder ? " [sob encomenda]" : ""}`).join("; "),
      shipping,
      subtotal,
    },
  };

  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(preference),
    });
    const data = await res.json();
    if (!res.ok || !data.init_point) {
      console.error("Mercado Pago erro:", res.status, JSON.stringify(data));
      return json(502, { error: "mp_error", message: "Não foi possível iniciar o pagamento agora." });
    }
    return json(200, { init_point: data.init_point, orderId });
  } catch (err) {
    console.error("Erro ao criar preferência:", err);
    return json(502, { error: "mp_unreachable", message: "Falha ao falar com o Mercado Pago." });
  }
};
