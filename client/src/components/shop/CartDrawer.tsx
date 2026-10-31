import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { brl, SETTINGS } from "@/lib/store";
import { ProductImage } from "./ProductCard";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  const free = SETTINGS.shipping.freeFrom;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/70"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col"
            aria-label="Carrinho"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Carrinho
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Fechar carrinho" className="text-white/60 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/40">
                <ShoppingBag size={40} className="mb-4" />
                <p>Seu carrinho está vazio.</p>
                <Link href="/loja" onClick={() => setOpen(false)} className="mt-6 text-[var(--color-electric)] text-sm underline">
                  Ver produtos
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-4 p-6">
                      <div className="w-20 h-20 bg-[#0A0A0A] shrink-0 overflow-hidden">
                        <ProductImage product={product} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm leading-snug">{product.name}</p>
                        <p className="text-white/50 text-sm mt-1">{brl(product.price)}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-white/15">
                            <button onClick={() => setQty(product.id, qty - 1)} aria-label="Diminuir" className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm text-white">{qty}</span>
                            <button
                              onClick={() => setQty(product.id, qty + 1)}
                              disabled={qty >= product.stock}
                              aria-label="Aumentar"
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => remove(product.id)} className="text-xs text-white/30 hover:text-red-400 underline">
                            remover
                          </button>
                        </div>
                      </div>
                      <p className="text-white text-sm font-medium">{brl(product.price * qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{brl(subtotal)}</span>
                  </div>
                  {SETTINGS.shipping.enabled && free > 0 && (
                    <p className="text-xs text-white/40">
                      {subtotal >= free
                        ? "Você ganhou frete grátis no envio."
                        : `Faltam ${brl(free - subtotal)} para frete grátis no envio.`}
                    </p>
                  )}
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn-electric w-full justify-center text-center">
                    Finalizar compra
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
