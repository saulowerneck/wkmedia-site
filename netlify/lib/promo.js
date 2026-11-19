// Promoção (ex.: Black Friday): enquanto estiver no período de shared/promo.json, o catálogo PÚBLICO sai com o
// preço "De" (preço atual + markupPct%, arredondado para terminar em ,90) e a marca promo. O catálogo salvo
// (painel/D1) não é alterado: acabou o período, a loja volta sozinha ao normal. Preço cobrado = sempre o atual.
import promo from "../../shared/promo.json";

const cents = (n) => Math.round(n * 100) / 100;
// menor valor terminado em ,90 que seja >= x
const upTo90 = (x) => cents(Math.ceil(x - 0.9 - 1e-9) + 0.9);

export function promoActive(now = Date.now()) {
  const from = Date.parse(promo.startsAt);
  const to = Date.parse(promo.endsAt);
  return Number.isFinite(from) && Number.isFinite(to) && now >= from && now <= to;
}

export function applyPromo(catalog, now = Date.now()) {
  if (!promoActive(now)) return catalog;
  const k = 1 + (Number(promo.markupPct) || 0) / 100;
  return {
    ...catalog,
    settings: { ...catalog.settings, promo: { name: promo.name, endsAt: promo.endsAt } },
    products: catalog.products.map((p) => {
      if (p.active === false || !(p.price > 0)) return p;
      const de = p.compareAtPrice > p.price ? p.compareAtPrice : upTo90(p.price * k);
      return de > p.price ? { ...p, compareAtPrice: de, promo: true } : p;
    }),
  };
}
