/* Brutalist Luxury — Hero: full-viewport, impactful headline, 3 CTAs */
import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/hero-premium-Qte9mfkXFSZsiTnyB3UsH6.webp";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--color-electric)]/20 to-transparent ml-[10%] hidden lg:block" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-electric)]/30 to-transparent" />

      {/* Content */}
      <div className="container relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Agência de Marketing & Produtora</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Conteúdo que{" "}
            <span className="text-[var(--color-electric)] text-glow">vende.</span>
            <br />
            Estratégia que{" "}
            <span className="text-[var(--color-electric)] text-glow">cresce.</span>
            <br />
            Imagem que{" "}
            <span className="text-[var(--color-electric)] text-glow">posiciona.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Vídeos, marketing e presença digital para empresas que querem ser lembradas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#contato" className="btn-electric">
              Solicitar Orçamento
              <ArrowRight size={18} />
            </a>
            <a href="#portfolio" className="btn-outline-white">
              <Play size={16} />
              Ver Portfólio
            </a>
            <a
              href="https://wa.me/5515996528429"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white !border-[#25D366]/30 hover:!border-[#25D366] hover:!text-[#25D366]"
              style={{ boxShadow: "none" }}
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 md:gap-16"
          >
            {[
              { value: "+120", label: "Projetos Entregues" },
              { value: "+30", label: "Marcas Atendidas" },
              { value: "+1M", label: "Visualizações Geradas" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-white/40 mt-1 tracking-wider uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-electric)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
