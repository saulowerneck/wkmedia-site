/* WK Shop — página de produto */
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, Minus, Plus, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ProductImage } from "@/components/shop/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { brl, isSoldOut, maxQty } from "@/lib/store";
import { useCatalog } from "@/contexts/CatalogContext";
import NotFound from "./NotFound";

export default function Produto() {
  const { slug } = useParams<{ slug: string }>();
  const { settings, getProductBySlug, ready } = useCatalog();
  const product = getProductBySlug(slug || "");
  const { add } = useCart();
  const [, navigate] = useLocation();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  usePageMeta(
    product ? `${product.name} | ${settings.name}` : settings.name,
    product ? product.description.slice(0, 155) : undefined,
  );

  useEffect(() => {
    setQty(1);
    setImg(0);
    window.scrollTo(0, 0);
  }, [slug]);

  // JSON-LD Product (SEO)
  useEffect(() => {
    if (!product) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      image: product.images.map((i) => `https://wkmedia.com.br${i}`),
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: product.price.toFixed(2),
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `https://wkmedia.com.br/loja/${product.slug}`,
      },
    });
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, [product]);

  if (!ready && !product) return <div className="min-h-screen bg-black" aria-busy="true" />;
  if (!product) return <NotFound />;
  const soldOut = isSoldOut(product);
  const limit = maxQty(product);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-36 pb-24">
        <div className="container">
          <Link href="/loja" className="inline-flex items-center gap-2 text-white/40 hover:text-[var(--color-electric)] text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Voltar para a loja
          </Link>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <div className="aspect-square bg-white overflow-hidden">
                <ProductImage product={{ ...product, images: product.images.length ? [product.images[img]] : [] }} />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setImg(i)}
                      aria-label={`Foto ${i + 1}`}
                      className={`w-20 h-20 overflow-hidden bg-white border-2 ${i === img ? "border-[var(--color-electric)]" : "border-white/10"}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {product.brand && (
                <span className="text-[var(--color-electric)] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  {product.brand} · {product.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {product.name}
              </h1>
              {product.size && (
                <p className="text-white/40 text-sm mb-3" style={{ fontFamily: "var(--font-mono)" }}>{product.size}</p>
              )}
              <div className="mb-1">
                {hasDiscount && <span className="text-white/30 line-through mr-3">{brl(product.compareAtPrice!)}</span>}
                <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{brl(product.price)}</span>
              </div>
              {settings.installments > 1 && (
                <p className="text-white/40 text-sm mb-6">
                  ou até {settings.installments}x de {brl(product.price / settings.installments)} no cartão
                </p>
              )}

              <p className="text-white/60 leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>
              {product.madeToOrder && (
                <p className="border border-[var(--color-electric)]/40 bg-[var(--color-electric-subtle)] p-4 text-sm text-white/70 mb-6">
                  <strong className="text-white">{settings.madeToOrder.label}.</strong> {settings.madeToOrder.note}
                </p>
              )}

              {product.details && product.details.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3 text-white/50 text-sm">
                      <span className="text-[var(--color-electric)] shrink-0">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {soldOut ? (
                <p className="border border-white/10 p-4 text-white/60">
                  Produto esgotado.{" "}
                  <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Olá! Quero saber quando o produto "${product.name}" volta ao estoque.`)}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-electric)] underline">
                    Avise-me pelo WhatsApp
                  </a>
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-white/15">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir" className="w-11 h-12 flex items-center justify-center text-white/60 hover:text-white">
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center">{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(limit, q + 1))} aria-label="Aumentar" className="w-11 h-12 flex items-center justify-center text-white/60 hover:text-white">
                        <Plus size={16} />
                      </button>
                    </div>
                    {!product.madeToOrder && product.stock <= 5 && <span className="text-xs text-amber-400">Restam {product.stock}</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => add(product.id, qty)} className="btn-electric flex-1 justify-center">
                      Adicionar ao carrinho
                    </button>
                    <button
                      onClick={() => {
                        add(product.id, qty, false);
                        navigate("/checkout");
                      }}
                      className="flex-1 border border-white/20 hover:border-white text-white py-4 text-xs tracking-[0.15em] uppercase transition-colors"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Comprar agora
                    </button>
                  </div>
                </>
              )}

              <div className="mt-10 grid gap-4 text-sm text-white/40">
                <p className="flex gap-3"><ShieldCheck size={18} className="text-[var(--color-electric)] shrink-0" /> Pagamento seguro por Pix, cartão ou boleto (Mercado Pago).</p>
                <p className="flex gap-3"><Truck size={18} className="text-[var(--color-electric)] shrink-0" /> {settings.pickup.enabled ? "Retirada em Sorocaba ou " : ""}envio para todo o Brasil.</p>
                <p className="flex gap-3"><MessageCircle size={18} className="text-[var(--color-electric)] shrink-0" /> Dúvidas? Atendimento direto pelo WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
