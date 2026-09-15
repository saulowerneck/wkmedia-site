/* Brutalist Luxury — Contact: form + WhatsApp + scheduling CTA */
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MessageCircle, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const encodeFormData = (data: Record<string, string>) =>
    Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join("&");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData({ "form-name": "contato", ...formData }),
      });
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: "Formulário de contato",
        });
      }
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      toast.error("Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="relative py-24 md:py-32 bg-black">
      <div className="deco-number top-8 right-8">06</div>

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
            <span className="section-num">Contato</span>
            <div className="w-12 h-px bg-[var(--color-electric)]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Vamos criar algo{" "}
            <span className="text-[var(--color-electric)]">incrível juntos?</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-lg">
            Preencha o formulário ou entre em contato diretamente. Respondemos em até 24 horas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-white/5">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-[#0A0A0A] p-8 md:p-12"
          >
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Solicitar Orçamento
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-[var(--color-electric)] focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-[var(--color-electric)] focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-[var(--color-electric)] focus:outline-none transition-colors"
                />
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-white text-sm focus:border-[var(--color-electric)] focus:outline-none transition-colors appearance-none"
                >
                  <option value="" className="bg-black">Serviço de interesse</option>
                  <option value="video" className="bg-black">Produção de Vídeo</option>
                  <option value="foto" className="bg-black">Fotografia Comercial</option>
                  <option value="social" className="bg-black">Social Media</option>
                  <option value="trafego" className="bg-black">Gestão de Tráfego</option>
                  <option value="branding" className="bg-black">Branding</option>
                  <option value="site" className="bg-black">Criação de Site</option>
                  <option value="drone" className="bg-black">Drone / Imagens Aéreas</option>
                  <option value="consultoria" className="bg-black">Consultoria Estratégica</option>
                </select>
              </div>
              <textarea
                placeholder="Conte-nos sobre seu projeto..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:border-[var(--color-electric)] focus:outline-none transition-colors resize-none"
              />
              <button type="submit" disabled={isSubmitting} className="btn-electric w-full justify-center disabled:opacity-50">
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                <Send size={16} />
              </button>
            </form>
          </motion.div>

          {/* Right: Contact info + quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-[#0A0A0A] p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
                Fale Conosco
              </h3>

              <div className="space-y-6">
                <a
                  href="https://wa.me/5515996528429"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-[#25D366]/30 group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-all duration-300">
                    <MessageCircle size={20} className="text-[#25D366] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">WhatsApp</p>
                    <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>(15) 99652-8429</p>
                  </div>
                </a>

                <a href="tel:+5515996528429" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-[var(--color-electric)] transition-all duration-300">
                    <Phone size={20} className="text-white/40 group-hover:text-[var(--color-electric)] transition-colors" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Telefone</p>
                    <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>(15) 99652-8429</p>
                  </div>
                </a>

                <a href="mailto:contato@wkmedia.com.br" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-[var(--color-electric)] transition-all duration-300">
                    <Mail size={20} className="text-white/40 group-hover:text-[var(--color-electric)] transition-colors" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">E-mail</p>
                    <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>contato@wkmedia.com.br</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10">
                    <MapPin size={20} className="text-white/40" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Localização</p>
                    <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>Sorocaba, SP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule meeting CTA */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <a
                href="https://wa.me/5515996528429?text=Olá!%20Gostaria%20de%20agendar%20uma%20reunião%20com%20a%20WK%20Media."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 border border-[var(--color-electric)]/30 text-white hover:bg-[var(--color-electric)] hover:text-black transition-all duration-300 justify-center"
              >
                <Calendar size={18} />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Agendar Reunião
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
