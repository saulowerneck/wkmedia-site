// Validação/limpeza do catálogo vindo do painel. Lança Error com mensagem em português.
const ID_RE = /^[a-z0-9][a-z0-9_-]{0,59}$/;
const str = (v, max, label, { required = false } = {}) => {
  const s = typeof v === "string" ? v.trim() : "";
  if (required && !s) throw new Error(`${label} é obrigatório.`);
  if (s.length > max) throw new Error(`${label} passa de ${max} caracteres.`);
  return s;
};
const num = (v, label, { min = 0, max = 1_000_000 } = {}) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${label} inválido.`);
  return Math.round(n * 100) / 100;
};
const int = (v, label, min, max) => {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${label} inválido.`);
  return n;
};

export function sanitizeSettings(s = {}) {
  const wa = String(s.whatsapp || "").replace(/\D/g, "");
  if (wa.length < 10 || wa.length > 15) throw new Error("WhatsApp inválido (use DDI+DDD+número).");
  const mto = s.madeToOrder || {};
  const pk = s.pickup || {};
  const sh = s.shipping || {};
  return {
    name: str(s.name, 60, "Nome da loja", { required: true }),
    whatsapp: wa,
    installments: int(s.installments ?? 1, "Parcelas", 1, 12),
    madeToOrder: { label: str(mto.label, 40, "Rótulo sob encomenda") || "Sob encomenda", note: str(mto.note, 400, "Texto sob encomenda") },
    pickup: { enabled: !!pk.enabled, label: str(pk.label, 60, "Rótulo da retirada"), note: str(pk.note, 400, "Texto da retirada") },
    shipping: {
      enabled: !!sh.enabled,
      label: str(sh.label, 60, "Rótulo do envio"),
      flatRate: num(sh.flatRate ?? 0, "Valor do frete", { max: 10000 }),
      freeFrom: num(sh.freeFrom ?? 0, "Frete grátis a partir de", { max: 1_000_000 }),
      note: str(sh.note, 400, "Texto do envio"),
    },
  };
}

export function sanitizeProduct(p, i) {
  const at = `Produto ${i + 1}`;
  const id = str(p?.id, 60, `${at}: id`, { required: true }).toLowerCase();
  const slug = str(p?.slug, 90, `${at}: slug`, { required: true }).toLowerCase();
  if (!ID_RE.test(id)) throw new Error(`${at}: id inválido (use letras minúsculas, números, - e _).`);
  if (!ID_RE.test(slug)) throw new Error(`${at}: endereço (slug) inválido.`);
  const images = Array.isArray(p.images) ? p.images : [];
  if (images.length > 10) throw new Error(`${at}: no máximo 10 fotos.`);
  for (const img of images) {
    if (typeof img !== "string" || !/^\/loja(-img)?\/[\w.\-]+$/.test(img)) throw new Error(`${at}: caminho de foto inválido.`);
  }
  const details = (Array.isArray(p.details) ? p.details : []).map((d) => str(d, 200, `${at}: detalhe`)).filter(Boolean);
  if (details.length > 12) throw new Error(`${at}: no máximo 12 detalhes.`);
  const out = {
    id,
    slug,
    name: str(p.name, 200, `${at}: nome`, { required: true }),
    brand: str(p.brand, 80, `${at}: marca`),
    category: str(p.category, 60, `${at}: categoria`, { required: true }),
    size: str(p.size, 30, `${at}: tamanho`),
    price: num(p.price, `${at}: preço`, { min: 0.01, max: 100000 }),
    images,
    description: str(p.description, 4000, `${at}: descrição`),
    details,
    madeToOrder: !!p.madeToOrder,
    stock: int(p.stock ?? 0, `${at}: estoque`, 0, 100000),
    active: p.active !== false,
  };
  if (p.compareAtPrice !== undefined && p.compareAtPrice !== null && p.compareAtPrice !== "" && Number(p.compareAtPrice) > 0) {
    out.compareAtPrice = num(p.compareAtPrice, `${at}: preço "de"`, { min: 0.01, max: 100000 });
  }
  return out;
}

export function sanitizeCatalog(input) {
  if (!input || typeof input !== "object") throw new Error("Catálogo inválido.");
  const settings = sanitizeSettings(input.settings);
  const list = Array.isArray(input.products) ? input.products : [];
  if (list.length > 500) throw new Error("No máximo 500 produtos.");
  const products = list.map(sanitizeProduct);
  const ids = new Set();
  const slugs = new Set();
  for (const p of products) {
    if (ids.has(p.id)) throw new Error(`Id repetido: ${p.id}.`);
    if (slugs.has(p.slug)) throw new Error(`Endereço (slug) repetido: ${p.slug}.`);
    ids.add(p.id);
    slugs.add(p.slug);
  }
  return { settings, products };
}
