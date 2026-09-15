/* Brutalist Luxury — Portfolio: gallery with niche filters */
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const FILTERS = ["Todos", "Restaurantes", "Indústrias", "Imobiliárias", "Eventos", "Clínicas", "Empresas"];

const PORTFOLIO_ITEMS = [
  { id: 1, title: "Campanha Institucional", category: "Indústrias", type: "Vídeo", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" },
  { id: 2, title: "Ensaio Gastronômico", category: "Restaurantes", type: "Fotografia", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop" },
  { id: 3, title: "Tour Virtual Aéreo", category: "Imobiliárias", type: "Drone", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop" },
  { id: 4, title: "Cobertura Premium", category: "Eventos", type: "Vídeo", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop" },
  { id: 5, title: "Branding Completo", category: "Clínicas", type: "Branding", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop" },
  { id: 6, title: "Social Media Strategy", category: "Empresas", type: "Marketing", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" },
  { id: 7, title: "Vídeo Comercial", category: "Restaurantes", type: "Vídeo", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop" },
  { id: 8, title: "Fotografia Industrial", category: "Indústrias", type: "Fotografia", img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&h=400&fit=crop" },
  { id: 9, title: "Landing Page Premium", category: "Empresas", type: "Site", img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop" },
  { id: 10, title: "Filmagem Aérea", category: "Imobiliárias", type: "Drone", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" },
  { id: 11, title: "Identidade Visual", category: "Clínicas", type: "Branding", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" },
  { id: 12, title: "Evento Corporativo", category: "Eventos", type: "Vídeo", img: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop" },
];

export default function PortfolioSection() {
  const [active, setActive] = useState("Todos");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filtered = active === "Todos" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="relative py-24 md:py-32 bg-[#0A0A0A]">
      <div className="deco-number top-8 left-8">03</div>

      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Portfólio</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Projetos que{" "}
            <span className="text-[var(--color-electric)]">geram resultado</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 border ${
                active === f
                  ? "bg-[var(--color-electric)] border-[var(--color-electric)] text-black"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden bg-[#111111] border border-white/5 hover:border-[var(--color-electric)]/20 transition-all duration-500"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[var(--color-electric)] text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                      {item.type}
                    </span>
                    <h4 className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h4>
                    <span className="text-white/40 text-xs mt-1">{item.category}</span>
                  </div>

                  <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[var(--color-electric)] text-black opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
