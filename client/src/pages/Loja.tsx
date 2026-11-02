/* WK Shop — catálogo */
import { useMemo, useState } from "react";
import { Search, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/shop/ProductCard";
import RequestCard from "@/components/shop/RequestCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCatalog } from "@/contexts/CatalogContext";

export default function Loja() {
  const { settings, products: PRODUCTS, ready } = useCatalog();
  usePageMeta(`${settings.name} | Loja online WK Media`, "Perfumes, cosméticos, eletrônicos e artigos esportivos com pagamento online seguro. Retirada em Sorocaba ou envio para todo o Brasil.");
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))], [PRODUCTS]);
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (cat === "Todos" || p.category === cat) &&
        (!term || `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase().includes(term)),
    );
  }, [cat, q, PRODUCTS]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-40 pb-24">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Loja online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            WK<span className="text-[var(--color-electric)]"> Shop</span>
          </h1>
          <p className="text-white/40 text-lg mb-10 max-w-2xl">
            Produtos selecionados com pagamento seguro. Retire em Sorocaba ou receba em casa.
          </p>

          <div className="bg-white text-black grid md:grid-cols-3 mb-10 md:divide-x divide-black/10 border-l-4 border-[var(--color-electric)]">
            {[
              { Icon: ShieldCheck, t: "Pagamento seguro", d: "Pix, cartão ou boleto pelo Mercado Pago" },
              { Icon: Truck, t: "Retirada ou envio", d: "Retire em Sorocaba ou receba em todo o Brasil" },
              { Icon: MessageCircle, t: "Atendimento direto", d: "Tire dúvidas pelo WhatsApp antes de comprar" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex items-center gap-4 px-6 py-5">
                <Icon size={22} className="text-[var(--color-electric)] shrink-0" />
                <div>
                  <p className="font-semibold text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>{t}</p>
                  <p className="text-black/55 text-xs mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>

          {!ready ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-black aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : PRODUCTS.length === 0 ? (
            <div className="border border-white/10 p-12 text-center">
              <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Em breve</p>
              <p className="text-white/40 mb-6">Estamos preparando o catálogo.</p>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-electric">
                Falar no WhatsApp
              </a>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <div className="flex flex-wrap gap-2 flex-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-colors ${
                        cat === c
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-white/60 hover:text-white hover:border-white/40"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <label className="relative md:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar produto"
                    aria-label="Buscar produto"
                    className="w-full bg-white text-black placeholder:text-black/40 border border-white focus:border-[var(--color-electric)] outline-none pl-10 pr-3 py-3 text-sm"
                  />
                </label>
              </div>

              {list.length > 0 && (
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá! Não encontrei na WK Shop o produto que procuro. Vocês conseguem trazer pra mim?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 mb-6 px-4 py-3 border border-white/15 text-sm text-white/70 hover:text-white hover:border-[var(--color-electric)] transition-colors"
                >
                  <MessageCircle size={18} className="text-[var(--color-electric)] shrink-0" />
                  <span>
                    <strong className="text-white font-semibold">Não encontrou o que procurava?</strong> Chame no WhatsApp e peça seu produto.
                  </span>
                </a>
              )}

              {list.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/10">
                  <RequestCard whatsapp={settings.whatsapp} term={q} wide />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/10">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                  <RequestCard whatsapp={settings.whatsapp} term={q} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
