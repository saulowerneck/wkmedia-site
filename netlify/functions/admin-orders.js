// Pedidos montados no painel para fechar pelo WhatsApp (exige token do painel).
//   GET  -> { next, orders }   (últimos pedidos e o próximo número sugerido)
//   POST { order }             -> grava o pedido, devolve o número definitivo
import { catalogStore, json } from "../lib/catalog.js";
import { isAuthorized } from "../lib/auth.js";

const KEY = "orders";
const KEEP = 300;
const START_SEQ = 127; // último número já usado fora do sistema (Pedido 0127); o primeiro daqui é 0128
const pad = (n) => String(n).padStart(4, "0");
const str = (v, max) => String(v ?? "").slice(0, max);
const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v) * 100) / 100 : 0);

async function load() {
  try {
    const data = await catalogStore().get(KEY, { type: "json" });
    if (data && Array.isArray(data.orders)) return { seq: Number(data.seq) || START_SEQ, orders: data.orders };
  } catch (err) {
    console.error("Falha ao ler pedidos:", err);
  }
  return { seq: START_SEQ, orders: [] };
}

export default async (req) => {
  if (!isAuthorized(req)) return json(401, { error: "unauthorized", message: "Sessão expirada. Entre novamente." });

  if (req.method === "GET") {
    const { seq, orders } = await load();
    return json(200, { next: pad(seq + 1), orders }, { "Cache-Control": "no-store" });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "bad_request", message: "Dados inválidos." });
    }
    const o = body?.order || {};
    const items = (Array.isArray(o.items) ? o.items : []).slice(0, 60).map((i) => ({
      id: str(i.id, 40),
      name: str(i.name, 200),
      size: str(i.size, 40),
      qty: Math.max(1, Math.floor(Number(i.qty) || 1)),
      price: num(i.price),
    }));
    if (items.length === 0) return json(400, { error: "empty", message: "Adicione ao menos um produto." });

    const state = await load();
    const asked = parseInt(String(o.number || "").replace(/\D/g, ""), 10);
    const n = Number.isFinite(asked) && asked > 0 ? asked : state.seq + 1;
    const number = pad(n);

    const order = {
      number,
      createdAt: new Date().toISOString(),
      customer: { name: str(o.customer?.name, 120), phone: str(o.customer?.phone, 40) },
      items,
      delivery: { label: str(o.delivery?.label, 300), fee: num(o.delivery?.fee) },
      payment: { label: str(o.payment?.label, 300) },
      subtotal: num(o.subtotal),
      total: num(o.total),
      message: str(o.message, 4000).replace(/\*\*\*NUMBER\*\*\*/g, number),
    };
    const orders = [order, ...state.orders.filter((x) => x.number !== number)].slice(0, KEEP);
    await catalogStore().setJSON(KEY, { seq: Math.max(state.seq, n), orders });
    return json(200, { order, next: pad(Math.max(state.seq, n) + 1) }, { "Cache-Control": "no-store" });
  }

  return json(405, { error: "method_not_allowed" });
};
