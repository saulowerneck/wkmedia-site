/* WK Shop — faixa da promoção (Black Friday). Só aparece enquanto o servidor mandar settings.promo. */
import { useCatalog } from "@/contexts/CatalogContext";
import { promoEndLabel } from "@/lib/store";

export default function PromoBanner() {
  const { settings } = useCatalog();
  const promo = settings.promo;
  if (!promo) return null;
  return (
    <div
      role="status"
      className="bg-[#E10600] text-white flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-3 mb-8 text-xs tracking-[0.14em] uppercase"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <strong className="font-medium">{promo.name} WK Shop</strong>
      <span>20% OFF em tudo</span>
      <span>Só até {promoEndLabel(promo.endsAt)}</span>
      <span>Pix ou cartão em até {settings.installments}x</span>
    </div>
  );
}
