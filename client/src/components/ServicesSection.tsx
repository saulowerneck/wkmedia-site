/* Brutalist Luxury — Services: 8 premium cards with hover reveal */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Video, Camera, Share2, TrendingUp, Palette, Globe, Navigation, Lightbulb, ArrowUpRight, Check } from "lucide-react";

const SERVICES = [
  {
    icon: Video,
    num: "01",
    title: "Produção de Vídeo",
    desc: "Vídeos institucionais, comerciais, reels e conteúdo que gera resultado. Do roteiro à entrega final.",
    items: ["Vídeos institucionais e comerciais", "Reels e conteúdo para redes sociais", "Roteiro, filmagem e edição completos"],
    benefit: "Aumente suas vendas com vídeos que convertem",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-video_9fefe19e.jpg",
  },
  {
    icon: Camera,
    num: "02",
    title: "Fotografia Comercial",
    desc: "Fotos profissionais para produtos, eventos, equipe e ambientes. Imagens que vendem.",
    items: ["Fotos de produtos e catálogo", "Cobertura de eventos corporativos", "Ensaios de equipe e ambientes"],
    benefit: "Transmita profissionalismo em cada imagem",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-photo_d1385a4f.jpg",
  },
  {
    icon: Share2,
    num: "03",
    title: "Social Media",
    desc: "Gestão completa de redes sociais com estratégia, conteúdo e engajamento real.",
    items: ["Planejamento de conteúdo mensal", "Criação de posts, stories e reels", "Gestão de comunidade e respostas"],
    benefit: "Construa uma audiência fiel e engajada",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-social-YrjgNKhQFVNtGuGKBLZwzU.webp",
  },
  {
    icon: TrendingUp,
    num: "04",
    title: "Gestão de Tráfego Pago",
    desc: "Campanhas no Google Ads e Meta Ads com foco em ROI. Cada real investido gera retorno.",
    items: ["Campanhas no Google Ads e Meta Ads", "Otimização contínua de ROI", "Relatórios de performance mensais"],
    benefit: "Multiplique seus leads com investimento inteligente",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-traffic-HNUKhkxZFpcwWsLbUYmj8Y.webp",
  },
  {
    icon: Palette,
    num: "05",
    title: "Branding",
    desc: "Identidade visual completa: logo, paleta, tipografia e manual da marca. Posicionamento que diferencia.",
    items: ["Criação de logotipo e identidade visual", "Paleta de cores e tipografia", "Manual de marca completo"],
    benefit: "Seja reconhecido e lembrado pelo seu público",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-branding_01e25acc.jpg",
  },
  {
    icon: Globe,
    num: "06",
    title: "Criação de Sites",
    desc: "Sites modernos, responsivos e otimizados para conversão. Seu cartão de visita digital.",
    items: ["Design responsivo e moderno", "Otimização para conversão (CRO)", "SEO técnico básico incluso"],
    benefit: "Converta visitantes em clientes 24h por dia",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-design_6d0ee378.jpg",
  },
  {
    icon: Navigation,
    num: "07",
    title: "Drone / Imagens Aéreas",
    desc: "Filmagens e fotografias aéreas com drones profissionais. Perspectivas únicas para seu projeto.",
    items: ["Filmagens aéreas em 4K", "Fotografias panorâmicas", "Piloto certificado ANAC"],
    benefit: "Impressione com ângulos que ninguém mais oferece",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-drone-CG4XuGKvn4xy2QQ2unnqVj.webp",
  },
  {
    icon: Lightbulb,
    num: "08",
    title: "Consultoria Estratégica",
    desc: "Diagnóstico completo e plano de ação personalizado para escalar sua presença digital.",
    items: ["Diagnóstico completo do negócio", "Plano de ação personalizado", "Acompanhamento de resultados"],
    benefit: "Tenha um mapa claro para crescer com estratégia",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028671384/JjGVu3QtiLnNLGquVDRYFU/service-consulting-GjZiMSuRz4YSMeZXHGn9xJ.webp",
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative bg-[#0A0A0A] border border-white/5 overflow-hidden hover:border-[var(--color-electric)]/30 transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <span
          className="absolute top-4 left-4 text-[var(--color-electric)] text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {service.num}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <service.icon size={20} className="text-[var(--color-electric)]" />
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {service.title}
          </h3>
        </div>
        <p className="text-sm text-white/40 leading-relaxed mb-4">{service.desc}</p>

        <ul className="space-y-2 mb-4">
          {service.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={14} className="text-[var(--color-electric)] shrink-0 mt-0.5" />
              <span className="text-xs text-white/50 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <p className="text-xs text-[var(--color-electric)]" style={{ fontFamily: "var(--font-mono)" }}>
            {service.benefit}
          </p>
        </div>
      </div>

      {/* Hover CTA arrow */}
      <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[var(--color-electric)] text-black opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <ArrowUpRight size={16} />
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicos" className="relative py-24 md:py-32 bg-black">
      <div className="deco-number top-8 right-8">02</div>

      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Nossos Serviços</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Soluções completas para sua{" "}
            <span className="text-[var(--color-electric)]">marca crescer</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl text-lg">
            Do planejamento à execução. Cada serviço é pensado para gerar resultado real para o seu negócio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.num} service={service} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a href="#contato" className="btn-electric">
            Solicitar Orçamento Personalizado
            <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
