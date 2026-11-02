import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { brl, isSoldOut, type Product } from "@/lib/store";
import { useCart } from "@/contexts/CartContext";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const src = product.images?.[0];
  return src ? (
    <img src={src} alt={product.name} loading="lazy" className={`w-full h-full object-contain ${className}`} />
  ) : (
    <div className={`w-full h-full flex items-center justify-center text-white/10 ${className}`}>
      <ShoppingBag size={48} />
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = isSoldOut(product);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="group bg-black flex flex-col border-r border-b border-white/10 hover:bg-[#0A0A0A] transition-colors">
      <Link href={`/loja/${product.slug}`} className="relative block aspect-square bg-white overflow-hidden">
        <div className="w-full h-full group-hover:scale-[1.04] transition-transform duration-500">
          <ProductImage product={product} />
        </div>
        {discount > 0 && !soldOut && (
          <span className="absolute top-3 left-3 bg-[var(--color-electric)] text-white text-xs px-2 py-1" style={{ fontFamily: "var(--font-mono)" }}>
            -{discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1" style={{ fontFamily: "var(--font-mono)" }}>
            ESGOTADO
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <span className="text-[var(--color-electric)] text-[11px] tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "var(--font-mono)" }}>
            {product.brand}
          </span>
        )}
        <Link href={`/loja/${product.slug}`} className="text-white font-medium leading-snug hover:text-[var(--color-electric)] transition-colors">
          {product.name}
        </Link>
        {product.size && <span className="text-white/35 text-xs mt-1" style={{ fontFamily: "var(--font-mono)" }}>{product.size}</span>}
        <div className="mt-2 mb-4">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-white/30 text-sm line-through mr-2">{brl(product.compareAtPrice)}</span>
          )}
          <span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {brl(product.price)}
          </span>
        </div>
        <button
          disabled={soldOut}
          onClick={() => add(product.id)}
          className="mt-auto bg-white text-black border border-white hover:bg-[var(--color-electric)] hover:border-[var(--color-electric)] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-white disabled:hover:text-black transition-colors py-3 text-xs font-medium tracking-[0.15em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {soldOut ? "Indisponível" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
