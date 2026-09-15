/* Brutalist Luxury — Marquee: continuous ticker with services on electric blue */
const ITEMS = [
  "Produção de Vídeo",
  "Fotografia Comercial",
  "Social Media",
  "Tráfego Pago",
  "Branding",
  "Criação de Sites",
  "Drone",
  "Consultoria",
];

export default function MarqueeBanner() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative py-5 bg-[var(--color-electric)] overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap gpu-layer">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="mx-6 shrink-0 text-sm font-bold tracking-[0.15em] uppercase text-black gpu-layer"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item}
            </span>
            <span className="text-black/30 text-lg">/</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .gpu-layer {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
}
