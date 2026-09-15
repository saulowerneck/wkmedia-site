// Recebe o webhook de "nova submissão" do Netlify Forms e repassa a mensagem
// para o WhatsApp do dono do site via CallMeBot (https://www.callmebot.com).
//
// Variáveis de ambiente necessárias (configurar no painel do Netlify):
//   CALLMEBOT_PHONE   -> número de WhatsApp que vai RECEBER o aviso, com DDI (ex: +5515996528429)
//   CALLMEBOT_APIKEY  -> apikey recebida do bot do CallMeBot depois do opt-in

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const data = (body.payload && (body.payload.data || body.payload.human_fields)) || {};

    const name = data.name || "Não informado";
    const email = data.email || "Não informado";
    const phone = data.phone || "Não informado";
    const service = data.service || "Não informado";
    const message = data.message || "—";

    const text =
      `Novo contato pelo site WK Media\n\n` +
      `Nome: ${name}\n` +
      `E-mail: ${email}\n` +
      `WhatsApp: ${phone}\n` +
      `Serviço: ${service}\n` +
      `Mensagem: ${message}`;

    const apiPhone = process.env.CALLMEBOT_PHONE;
    const apiKey = process.env.CALLMEBOT_APIKEY;

    if (!apiPhone || !apiKey) {
      console.error("CALLMEBOT_PHONE ou CALLMEBOT_APIKEY não configurados nas variáveis de ambiente do Netlify.");
      return { statusCode: 200, body: "ok (whatsapp not configured)" };
    }

    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(apiPhone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    const resultText = await res.text();
    console.log("CallMeBot response:", res.status, resultText);

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("Erro ao notificar WhatsApp:", err);
    // Sempre responde 200 pro Netlify não ficar re-tentando o webhook indefinidamente
    return { statusCode: 200, body: "error handled" };
  }
};
