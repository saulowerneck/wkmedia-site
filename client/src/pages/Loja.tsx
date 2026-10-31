/* WK Shop — catálogo */
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/shop/ProductCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PRODUCTS, SETTINGS } from "@/lib/store";

export default function Loja() {
  usePageMeta(`${SETTINGS.name} | Loja online WK Media`, "Perfumes, cosméticos, eletrônicos e artigos esportivos com pagamento online seguro. Retirada em Sorocaba ou envio para todo o Brasil.");
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))], []);
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (cat === "Todos" || p.category === cat) &&
        (!term || `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase().includes(term)),
    );
  }, [cat, q]);

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

          {PRODUCTS.length === 0 ? (
            <div className="border border-white/10 p-12 text-center">
              <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Em breve</p>
              <p className="text-white/40 mb-6">Estamos preparando o catálogo.</p>
              <a href={`https://wa.me/${SETTINGS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-electric">
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
                          ? "border-[var(--color-electric)] text-[var(--color-electric)]"
                          : "border-white/10 text-white/50 hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <label className="relative md:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar produto"
                    aria-label="Buscar produto"
                    className="w-full bg-transparent border border-white/10 focus:border-[var(--color-electric)] outline-none pl-10 pr-3 py-3 text-sm"
                  />
                </label>
              </div>

              {list.length === 0 ? (
                <p className="text-white/40 py-16 text-center">Nenhum produto encontrado.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/5">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
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
