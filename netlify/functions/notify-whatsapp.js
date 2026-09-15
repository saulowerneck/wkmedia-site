// Recebe o webhook de "nova submissão" do Netlify Forms e repassa a mensagem
// para o WhatsApp do dono do site via CallMeBot (https://www.callmebot.com).
//
// Variáveis de ambiente necessárias (configurar no painel do Netlify):
//   CALLMEBOT_PHONE   -> número de WhatsApp que vai RECEBER o aviso, com DDI (ex: +5515996528429)
//   CALLMEBOT_APIKEY  -> apikey recebida do bot do CallMeBot depois do opt-in

export const handler = async (event) => {
  try {
    const raw = event.body || "{}";
    console.log("RAW BODY:", raw);

    const body = JSON.parse(raw);

    // O formato exato do payload de outgoing webhook do Netlify pode variar;
    // tentamos vários caminhos possíveis até achar os campos do formulário.
    const candidates = [
      body?.payload?.data,
      body?.payload?.human_fields,
      body?.data,
      body?.human_fields,
      body,
    ];
    const data = candidates.find((c) => c && typeof c === "object" && Object.keys(c).length > 0) || {};

    console.log("DATA ESCOLHIDA:", JSON.stringify(data));

    const pick = (obj, keys) => {
      for (const k of keys) {
        if (obj[k]) return obj[k];
      }
      return null;
    };

    const name = pick(data, ["name", "Name", "nome"]) || "Não informado";
    const email = pick(data, ["email", "Email", "e-mail"]) || "Não informado";
    const phone = pick(data, ["phone", "Phone", "whatsapp", "WhatsApp", "telefone"]) || "Não informado";
    const service = pick(data, ["service", "Service", "serviço", "servico"]) || "Não informado";
    const message = pick(data, ["message", "Message", "mensagem"]) || "—";

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
    return { statusCode: 200, body: "error handled" };
  }
};
