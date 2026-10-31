// WK Shop — recebe a notificação do Mercado Pago e avisa no WhatsApp do dono
// quando um pagamento é APROVADO. Confirma o pagamento consultando a API com o
// token (não confia no corpo da notificação).
//
// Variáveis de ambiente: MP_ACCESS_TOKEN, CALLMEBOT_PHONE, CALLMEBOT_APIKEY

const ok = (msg = "ok") => ({ statusCode: 200, body: msg });
const brl = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      /* corpo vazio/ não JSON */
    }

    const type = body.type || qs.type || qs.topic;
    const id = body?.data?.id || qs["data.id"] || qs.id;
    if (type !== "payment" || !id) return ok("ignored");

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) return ok("not configured");

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Falha ao consultar pagamento", id, res.status);
      return { statusCode: 500, body: "retry" }; // o Mercado Pago tenta de novo
    }
    const pay = await res.json();
    if (pay.status !== "approved") return ok(`status ${pay.status}`);

    const m = pay.metadata || {};
    const entrega =
      m.delivery_method === "pickup" ? "Retirada em Sorocaba" : `Envio: ${m.delivery_address || "endereço não informado"}`;
    const text =
      `Novo pedido PAGO na WK Shop\n\n` +
      `Pedido: ${m.order_id || pay.external_reference || id}\n` +
      `Itens: ${m.items_summary || (pay.additional_info?.items || []).map((i) => `${i.quantity}x ${i.title}`).join("; ")}\n` +
      `Total: ${brl(pay.transaction_amount)} (${pay.payment_method_id || "—"})\n\n` +
      `Cliente: ${m.customer_name || pay.payer?.first_name || "—"}\n` +
      `E-mail: ${m.customer_email || pay.payer?.email || "—"}\n` +
      `WhatsApp: ${m.customer_phone || "—"}\n` +
      `Entrega: ${entrega}`;

    const phone = process.env.CALLMEBOT_PHONE;
    const key = process.env.CALLMEBOT_APIKEY;
    if (!phone || !key) {
      console.error("CALLMEBOT_PHONE/CALLMEBOT_APIKEY ausentes; pedido pago:", text);
      return ok("whatsapp not configured");
    }
    const r = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`,
    );
    console.log("CallMeBot:", r.status);
    return ok();
  } catch (err) {
    console.error("Erro no webhook:", err);
    return { statusCode: 500, body: "retry" };
  }
};
