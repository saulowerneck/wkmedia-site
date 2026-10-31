/* WK Shop — política de trocas e devoluções */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SETTINGS } from "@/lib/store";

export default function Trocas() {
  usePageMeta(`Trocas e devoluções | ${SETTINGS.name}`);
  const h2 = "text-2xl font-bold text-white mt-10 mb-3";
  const p = "text-white/60 leading-relaxed mb-4";
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-40 pb-24">
        <div className="container max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Trocas e <span className="text-[var(--color-electric)]">devoluções</span>
          </h1>
          <p className={p}>A {SETTINGS.name} é a loja online da WK Media — CNPJ 46.614.430/0001-02, Sorocaba/SP. Contato: contato@wkmedia.com.br · WhatsApp (15) 99652-8429.</p>

          <h2 className={h2} style={{ fontFamily: "var(--font-display)" }}>Direito de arrependimento</h2>
          <p className={p}>Para compras feitas pela internet, você pode desistir da compra em até 7 (sete) dias corridos a contar do recebimento do produto, sem precisar justificar, conforme o art. 49 do Código de Defesa do Consumidor. O produto deve ser devolvido na embalagem original, sem sinais de uso e com todos os acessórios. O valor pago, inclusive o frete, é devolvido pelo mesmo meio de pagamento.</p>

          <h2 className={h2} style={{ fontFamily: "var(--font-display)" }}>Produto com defeito</h2>
          <p className={p}>Se o produto chegar com defeito ou diferente do pedido, fale conosco em até 7 dias após o recebimento para troca ou reembolso. Os prazos de garantia legal (30 dias para produtos não duráveis e 90 dias para duráveis) seguem o CDC.</p>

          <h2 className={h2} style={{ fontFamily: "var(--font-display)" }}>Como solicitar</h2>
          <p className={p}>Envie uma mensagem pelo WhatsApp ou e-mail informando o número do pedido e o motivo. Retornamos com as instruções de devolução. Perfumes e cosméticos lacrados devem ser devolvidos com o lacre intacto, por questões de higiene e segurança.</p>

          <h2 className={h2} style={{ fontFamily: "var(--font-display)" }}>Entrega e retirada</h2>
          <p className={p}>{SETTINGS.shipping.note} {SETTINGS.pickup.note}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
