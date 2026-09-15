/* Brutalist Luxury — Floating WhatsApp button */
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-black px-4 py-2 text-sm font-semibold shadow-lg whitespace-nowrap"
          >
            Fale conosco!
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href="https://wa.me/5515996528429?text=Olá!%20Vim%20pelo%20site%20da%20WK%20Media%20e%20gostaria%20de%20saber%20mais."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "generate_lead", {
              event_category: "engagement",
              event_label: "Botão flutuante WhatsApp",
            });
          }
        }}
        className="w-14 h-14 flex items-center justify-center bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
