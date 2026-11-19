// WK Shop — consulta o status de um pagamento Pix (a tela de Pix usa para confirmar sozinha).
// Devolve só o status; nenhum dado do cliente.
import { json } from "../lib/catalog.js";

export default async (req) => {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json(503, { error: "not_configured" });
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^\d{5,20}$/.test(id)) return json(400, { error: "bad_request" });
  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return json(502, { error: "mp_error" });
    const pay = await res.json();
    return json(200, { status: pay.status });
  } catch {
    return json(502, { error: "mp_unreachable" });
  }
};
