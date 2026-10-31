/* Brutalist Luxury — Navbar: sharp, minimal, electric blue CTA */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SETTINGS, SHOW_STORE_LINK, STORE_ENABLED } from "@/lib/store";

const NAV_ITEMS = [
  { label: "Início", href: "/#inicio" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Portfólio", href: "/#portfolio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Blog", href: "/blog" },
  ...(SHOW_STORE_LINK ? [{ label: SETTINGS.name, href: "/loja" }] : []),
  { label: "Contato", href: "/#contato" },
];

function CartButton() {
  const { count, setOpen } = useCart();
  if (!STORE_ENABLED) return null;
  return (
    <button onClick={() => setOpen(true)} aria-label={`Abrir carrinho (${count} itens)`} className="relative w-10 h-10 flex items-center justify-center text-white/70 hover:text-white">
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[var(--color-electric)] text-white text-[10px] flex items-center justify-center" style={{ fontFamily: "var(--font-mono)" }}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-20">
          <a href="/#inicio" className="relative z-10 flex items-center gap-3">
            <img src="/logo-circle.png" alt="WK Media" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              WK
            </span>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-electric)]" style={{ fontFamily: "var(--font-display)" }}>
              MEDIA
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-300 tracking-wide uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <CartButton />
            <a
              href="https://wa.me/5515996528429"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-[#25D366] transition-colors duration-300"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <a href="/#contato" className="btn-electric !py-3 !px-6 !text-xs">
              Orçamento
            </a>
          </div>

          <div className="lg:hidden relative z-50 flex items-center gap-1">
            <CartButton />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-3xl font-bold text-white hover:text-[var(--color-electric)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="/#contato"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="btn-electric mt-4"
              >
                Solicitar Orçamento
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
