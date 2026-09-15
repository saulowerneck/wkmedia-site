/* Brutalist Luxury — Política de Privacidade (LGPD) */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--color-electric)] transition-colors mb-8">
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Legal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Política de <span className="text-[var(--color-electric)]">Privacidade</span>
          </h1>
          <p className="text-white/40 text-sm mb-16" style={{ fontFamily: "var(--font-mono)" }}>
            Última atualização: setembro de 2026
          </p>

          <div className="space-y-12 text-white/60 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                1. Quem somos
              </h2>
              <p>
                A WK Media é uma agência de marketing e produtora audiovisual sediada em Sorocaba, SP. Esta política explica quais
                dados coletamos através deste site, para que usamos e quais são os seus direitos, em conformidade com a Lei Geral de
                Proteção de Dados (LGPD — Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                2. Quais dados coletamos
              </h2>
              <p className="mb-3">
                Coletamos apenas os dados que você nos fornece voluntariamente ao preencher o formulário de contato/orçamento neste
                site:
              </p>
              <ul className="space-y-2 list-none">
                {["Nome", "E-mail", "Telefone / WhatsApp", "Serviço de interesse", "Mensagem / descrição do projeto"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[var(--color-electric)] mt-1.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Não coletamos dados sensíveis (como origem racial, saúde, orientação sexual ou convicções religiosas) e não
                utilizamos cookies de rastreamento ou pixels de terceiros neste site no momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                3. Para que usamos seus dados
              </h2>
              <p>
                Usamos os dados enviados pelo formulário exclusivamente para responder à sua solicitação de orçamento ou contato,
                entender suas necessidades e, se houver interesse mútuo, prestar os serviços contratados. Não usamos seus dados
                para nenhuma outra finalidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                4. Com quem compartilhamos
              </h2>
              <p>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Os dados
                enviados pelo formulário ficam armazenados na plataforma de hospedagem do site (Netlify) e são acessados apenas
                pela equipe da WK Media para fins de atendimento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                5. Por quanto tempo guardamos seus dados
              </h2>
              <p>
                Mantemos os dados de contato pelo tempo necessário para conduzir a negociação ou prestação de serviço, e podemos
                mantê-los por um período adicional para fins de relacionamento comercial ou obrigações legais, exceto se você
                solicitar a exclusão antes disso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                6. Seus direitos
              </h2>
              <p className="mb-3">Conforme a LGPD, você tem o direito de solicitar, a qualquer momento:</p>
              <ul className="space-y-2 list-none">
                {[
                  "Confirmação de que tratamos seus dados",
                  "Acesso aos dados que temos sobre você",
                  "Correção de dados incompletos ou desatualizados",
                  "Exclusão dos seus dados pessoais",
                  "Revogação do consentimento",
                  "Informação sobre com quem compartilhamos seus dados",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[var(--color-electric)] mt-1.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                7. Como exercer seus direitos
              </h2>
              <p>
                Para exercer qualquer um desses direitos, ou tirar dúvidas sobre como tratamos seus dados, entre em contato pelo
                e-mail{" "}
                <a href="mailto:contato@wkmedia.com.br" className="text-[var(--color-electric)] hover:underline">
                  contato@wkmedia.com.br
                </a>{" "}
                ou pelo WhatsApp{" "}
                <a href="https://wa.me/5515996528429" target="_blank" rel="noopener noreferrer" className="text-[var(--color-electric)] hover:underline">
                  (15) 99652-8429
                </a>
                . Responderemos sua solicitação dentro de um prazo razoável.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                8. Alterações a esta política
              </h2>
              <p>
                Podemos atualizar esta política periodicamente para refletir mudanças em nossas práticas ou por exigência legal. A
                data da última atualização está sempre indicada no topo desta página.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
