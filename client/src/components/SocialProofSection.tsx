/* Brutalist Luxury — Social Proof: testimonials, client logos, stats */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos Mendes",
    role: "CEO, Restaurante Sabor & Arte",
    text: "A WK Media transformou completamente nossa presença digital. Os vídeos e fotos que produziram triplicaram nosso engajamento no Instagram.",
    stars: 5,
  },
  {
    name: "Ana Paula Ribeiro",
    role: "Diretora, Clínica Vitallis",
    text: "Profissionalismo impecável. Desde o branding até a gestão de tráfego, cada detalhe foi pensado para gerar resultado. Recomendo de olhos fechados.",
    stars: 5,
  },
  {
    name: "Roberto Almeida",
    role: "Sócio, RA Incorporações",
    text: "As filmagens com drone e os vídeos institucionais elevaram o padrão dos nossos lançamentos imobiliários. Parceria que veio para ficar.",
    stars: 5,
  },
];

const STATS = [
  { value: "+120", label: "Projetos Entregues" },
  { value: "+30", label: "Marcas Atendidas" },
  { value: "+1M", label: "Visualizações Geradas" },
  { value: "98%", label: "Clientes Satisfeitos" },
];

const CLIENT_LOGOS = [
  "Sabor & Arte", "Clínica Vitallis", "RA Incorporações",
  "Tech Solutions", "Grupo Horizonte", "Studio Fit",
];

export default function SocialProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 bg-black">
      <div className="deco-number top-8 right-8">04</div>

      <div className="container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Prova Social</span>
            <div className="w-12 h-px bg-[var(--color-electric)]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Quem confia na{" "}
            <span className="text-[var(--color-electric)]">WK Media</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-16"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-[#0A0A0A] p-8 text-center">
              <p className="text-4xl md:text-5xl font-bold text-[var(--color-electric)]" style={{ fontFamily: "var(--font-display)" }}>
                {stat.value}
              </p>
              <p className="text-xs text-white/40 mt-2 tracking-wider uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="bg-[#0A0A0A] p-8 relative"
            >
              <Quote size={32} className="text-[var(--color-electric)]/20 mb-4" />
              <p className="text-white/60 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} className="fill-[var(--color-electric)] text-[var(--color-electric)]" />
                ))}
              </div>
              <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                {t.name}
              </p>
              <p className="text-white/30 text-xs mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                {t.role}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Client logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-center text-xs text-white/20 tracking-[0.3em] uppercase mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            Empresas que confiam em nosso trabalho
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {CLIENT_LOGOS.map((logo) => (
              <div
                key={logo}
                className="px-6 py-3 border border-white/5 text-white/20 text-sm font-semibold tracking-wider uppercase hover:border-[var(--color-electric)]/20 hover:text-white/40 transition-all duration-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
