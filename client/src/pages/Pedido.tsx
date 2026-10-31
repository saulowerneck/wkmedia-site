/* WK Shop — retorno do pagamento (sucesso / pendente / falha) */
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SETTINGS } from "@/lib/store";

const CONTENT = {
  sucesso: { icon: CheckCircle2, color: "text-[#25D366]", title: "Pagamento aprovado!", text: "Recebemos seu pedido. Em instantes entraremos em contato pelo WhatsApp para combinar a entrega ou retirada." },
  pendente: { icon: Clock, color: "text-amber-400", title: "Pagamento em análise", text: "Assim que o pagamento for confirmado (Pix e boleto podem levar um tempo), seu pedido será separado. Avisaremos pelo WhatsApp." },
  falha: { icon: XCircle, color: "text-red-400", title: "Pagamento não concluído", text: "O pagamento não foi aprovado. Seu carrinho foi mantido: você pode tentar novamente ou pedir pelo WhatsApp." },
} as const;

export default function Pedido() {
  const { status } = useParams<{ status: string }>();
  const key = (status && status in CONTENT ? status : "pendente") as keyof typeof CONTENT;
  const c = CONTENT[key];
  const Icon = c.icon;
  const { clear } = useCart();
  usePageMeta(`${c.title} | ${SETTINGS.name}`);

  useEffect(() => {
    if (key === "sucesso" || key === "pendente") clear();
    try {
      if (key === "sucesso") (window as any).gtag?.("event", "purchase", { currency: "BRL" });
    } catch {
      /* analytics é opcional */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-48 pb-24">
        <div className="container max-w-xl text-center">
          <Icon size={64} className={`mx-auto mb-6 ${c.color}`} />
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>{c.title}</h1>
          <p className="text-white/50 leading-relaxed mb-10">{c.text}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {key === "falha" ? <Link href="/checkout" className="btn-electric justify-center">Tentar novamente</Link> : <Link href="/loja" className="btn-electric justify-center">Continuar comprando</Link>}
            <a href={`https://wa.me/${SETTINGS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="border border-white/15 hover:border-[#25D366] hover:text-[#25D366] text-white/70 px-6 py-4 text-xs tracking-[0.15em] uppercase transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
