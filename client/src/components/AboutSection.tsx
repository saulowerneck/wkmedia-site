/* Brutalist Luxury — About: storytelling + differentials */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Zap, Eye, Users } from "lucide-react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/hero-bg_73c2fdd4.jpg";

const DIFFERENTIALS = [
  { icon: Target, title: "Foco em Resultado", desc: "Não fazemos posts bonitos. Fazemos estratégias que geram leads, vendas e crescimento real." },
  { icon: Zap, title: "Execução Rápida", desc: "Da ideia à entrega em tempo recorde. Agilidade sem perder qualidade." },
  { icon: Eye, title: "Visão de Negócio", desc: "Entendemos seu mercado antes de criar. Cada peça é pensada para o seu público." },
  { icon: Users, title: "Equipe Multidisciplinar", desc: "Videomakers, designers, estrategistas e gestores de tráfego. Tudo em um só lugar." },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="relative py-24 md:py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="deco-number top-8 left-8">05</div>

      <div className="container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden border border-white/5">
              <img src={ABOUT_IMG} alt="WK Media equipe" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[var(--color-electric)] p-6 md:p-8">
              <p className="text-4xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>5+</p>
              <p className="text-xs text-black/60 tracking-wider uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                Anos de<br />Experiência
              </p>
            </div>
            <div className="absolute top-0 left-0 w-px h-full bg-[var(--color-electric)]/20 -ml-4 hidden lg:block" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-[var(--color-electric)]" />
              <span className="section-num">Sobre a WK Media</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Mais que posts:{" "}
              <span className="text-[var(--color-electric)]">crescimento real.</span>
            </h2>

            <p className="text-white/50 text-lg leading-relaxed mb-4">
              A WK Media nasceu da união entre marketing, estratégia, audiovisual e visão de negócios. Somos uma agência completa que entende que cada empresa é única — e merece uma comunicação à altura.
            </p>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              De Sorocaba para o Brasil, ajudamos empresas a construir presença digital forte, gerar autoridade no mercado e converter audiência em clientes reais. Não entregamos apenas conteúdo — entregamos resultado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {DIFFERENTIALS.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-[var(--color-electric)]/30 shrink-0 group-hover:bg-[var(--color-electric)] group-hover:border-[var(--color-electric)] transition-all duration-300">
                      <d.icon size={18} className="text-[var(--color-electric)] group-hover:text-black transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>{d.title}</h4>
                      <p className="text-white/30 text-xs leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
