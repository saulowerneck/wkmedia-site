/* Brutalist Luxury — Footer: premium with links, social, contact */
import { Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

const QUICK_LINKS = [
  { label: "Início", href: "/#inicio" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Portfólio", href: "/#portfolio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

const SERVICES_LINKS = [
  "Produção de Vídeo",
  "Fotografia Comercial",
  "Social Media",
  "Gestão de Tráfego",
  "Branding",
  "Criação de Sites",
  "Drone",
  "Consultoria",
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/5">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo-circle.png" alt="WK Media" className="w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              WK<span className="text-[var(--color-electric)]">.</span>MEDIA
            </h3>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              Conteúdo que vende. Estratégia que cresce. Imagem que posiciona. Sua agência de marketing e produtora audiovisual em Sorocaba.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-all duration-300">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-all duration-300">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/30 text-sm hover:text-[var(--color-electric)] transition-colors duration-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              Serviços
            </h4>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((s) => (
                <li key={s}>
                  <a href="/#servicos" className="text-white/30 text-sm hover:text-[var(--color-electric)] transition-colors duration-300">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              Contato
            </h4>
            <div className="space-y-4">
              <a href="mailto:contato@wkmedia.com.br" className="flex items-center gap-3 text-white/30 text-sm hover:text-[var(--color-electric)] transition-colors">
                <Mail size={14} />
                contato@wkmedia.com.br
              </a>
              <a href="https://wa.me/5515996528429" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/30 text-sm hover:text-[var(--color-electric)] transition-colors">
                <Phone size={14} />
                (15) 99652-8429
              </a>
              <div className="flex items-center gap-3 text-white/30 text-sm">
                <MapPin size={14} />
                Sorocaba, SP — Brasil
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-white/20 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              &copy; {new Date().getFullYear()} WK Media. Todos os direitos reservados.
            </p>
            <a href="/privacidade" className="text-white/20 text-xs hover:text-[var(--color-electric)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              Política de Privacidade
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/30 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-all duration-300"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
