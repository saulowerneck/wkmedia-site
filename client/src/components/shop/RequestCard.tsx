/* WK Shop — card "peça seu produto" (encomenda pelo WhatsApp) */
import { MessageCircle, ArrowUpRight } from "lucide-react";

interface Props {
  whatsapp: string;
  term?: string;
  /** ocupa a linha toda (ex.: quando a busca não encontra nada) */
  wide?: boolean;
}

export default function RequestCard({ whatsapp, term, wide }: Props) {
  const t = term?.trim();
  const text = t
    ? `Olá! Não encontrei "${t}" na WK Shop. Vocês conseguem trazer pra mim?`
    : "Olá! Não encontrei na WK Shop o produto que procuro. Vocês conseguem trazer pra mim?";
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col justify-between bg-white text-black border-r border-b border-white/10 border-l-4 border-l-[var(--color-electric)] p-6 md:p-8 min-h-[18rem] transition-colors hover:bg-[#f4f4f4] ${
        wide ? "col-span-2 md:col-span-3 lg:col-span-4 min-h-0 md:flex-row md:items-center gap-6" : ""
      }`}
    >
      <div>
        <MessageCircle size={28} className="text-[var(--color-electric)] mb-5" />
        <p className="text-xl md:text-2xl font-bold leading-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Não encontrou o que procurava?
        </p>
        <p className="text-black/60 text-sm max-w-md">
          {t ? `Não temos "${t}" no catálogo, mas podemos trazer pra você.` : "Chame no WhatsApp e peça seu produto: perfumes, eletrônicos e muito mais, sob encomenda."}
        </p>
      </div>
      <span
        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold mt-6 md:mt-0 shrink-0"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Pedir no WhatsApp
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}
