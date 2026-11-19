/* WK Shop — painel: monta um pedido (itens, entrega, pagamento, cliente) e fecha pelo WhatsApp */
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, MessageCircle, Minus, Plus, Search, Trash2 } from "lucide-react";
import { brl, shippingCost, type Product, type StoreSettings } from "@/lib/store";

const API = "/.netlify/functions";
const mono = { fontFamily: "var(--font-mono)" } as const;
const inputCls =
  "w-full bg-transparent border border-white/15 focus:border-[var(--color-electric)] outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25";
const btn =
  "px-4 py-2.5 text-xs tracking-[0.12em] uppercase border border-white/20 text-white/80 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-colors disabled:opacity-40";
const btnPrimary =
  "px-5 py-2.5 text-xs tracking-[0.12em] uppercase bg-[var(--color-electric)] text-white hover:bg-[var(--color-electric-hover)] transition-colors disabled:opacity-40";

const round2 = (n: number) => Math.round(n * 100) / 100;
const parseMoney = (t: string) => {
  const s = t.trim();
  if (!s) return NaN;
  return Number(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s);
};
const digits = (s: string) => s.replace(/\D/g, "");

interface Line {
  id: string;
  name: string;
  size?: string;
  qty: number;
  price: number;
}
type PayType = "pix" | "pix-parcelado" | "cartao" | "dinheiro" | "outro";
type DeliveryType = "pickup" | "ship" | "outro";

export interface SavedOrder {
  number: string;
  createdAt: string;
  customer: { name: string; phone: string };
  total: number;
  message: string;
}

const dayMonth = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : "--/--");
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Valores das parcelas: divide igual e põe a diferença de centavos na última. */
const splitAmounts = (total: number, n: number) => {
  const base = Math.floor((total / n) * 100) / 100;
  const list = Array.from({ length: n }, () => base);
  list[n - 1] = round2(total - base * (n - 1));
  return list;
};

const lineName = (l: Line) =>
  l.size && !l.name.toLowerCase().includes(l.size.toLowerCase()) ? `${l.name} (${l.size})` : l.name;

function waLink(phone: string, text: string) {
  let d = digits(phone);
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  return `https://wa.me/${d.length >= 12 ? d : ""}?text=${encodeURIComponent(text)}`;
}

export default function NewOrder({
  token,
  products,
  settings,
  onAuthFail,
}: {
  token: string;
  products: Product[];
  settings: StoreSettings;
  onAuthFail: () => void;
}) {
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delType, setDelType] = useState<DeliveryType>("pickup");
  const [delNote, setDelNote] = useState("");
  const [address, setAddress] = useState("");
  const [feeTxt, setFeeTxt] = useState("");
  const [payType, setPayType] = useState<PayType>("pix");
  const [parcels, setParcels] = useState(2);
  const [dates, setDates] = useState<string[]>(() => [addDays(15), addDays(30), addDays(45), addDays(60), addDays(75), addDays(90)]);
  const [payNote, setPayNote] = useState("");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<SavedOrder[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin-orders`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) return onAuthFail();
      if (!res.ok) return;
      const d = await res.json();
      setHistory(d.orders || []);
      setNumber((cur) => cur || d.next || "");
    } catch {
      /* sem histórico: o resto funciona */
    }
  }, [token, onAuthFail]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products
      .filter((p) => p.active !== false && `${p.name} ${p.brand || ""} ${p.size || ""} ${p.id}`.toLowerCase().includes(t))
      .slice(0, 8);
  }, [q, products]);

  function add(p: Product) {
    setLines((cur) => {
      const i = cur.findIndex((l) => l.id === p.id);
      if (i >= 0) return cur.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
      return [...cur, { id: p.id, name: p.name, size: p.size, qty: 1, price: p.price }];
    });
    setQ("");
  }
  const patchLine = (id: string, patch: Partial<Line>) => setLines((cur) => cur.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const subtotal = round2(lines.reduce((n, l) => n + l.price * l.qty, 0));
  const autoFee = delType === "ship" ? shippingCost(settings, subtotal, "ship") : 0;
  const feeParsed = parseMoney(feeTxt);
  const fee = delType === "ship" ? (Number.isFinite(feeParsed) ? round2(feeParsed) : autoFee) : 0;
  const total = round2(subtotal + fee);

  const deliveryLabel =
    delType === "pickup"
      ? `Retirada em Sorocaba (grátis)${delNote.trim() ? ` ${delNote.trim()}` : ""}`
      : delType === "ship"
        ? `Envio${address.trim() ? `: ${address.trim()}` : ""}${fee > 0 ? ` (frete ${brl(fee)})` : " (frete grátis)"}`
        : delNote.trim() || "A combinar";

  const amounts = splitAmounts(total, Math.max(2, parcels));
  const paymentLines: string[] = (() => {
    const extra = payNote.trim() ? [payNote.trim()] : [];
    switch (payType) {
      case "pix":
        return ["PIX à vista", ...extra];
      case "pix-parcelado": {
        const out = [`PIX ${parcels}x`];
        amounts.forEach((a, i) => {
          out.push(`${dayMonth(dates[i])} - ${i + 1}/${parcels}`, brl(a), "");
        });
        out.pop();
        return [...out, ...extra];
      }
      case "cartao":
        return ["Cartão de crédito (envio o link de pagamento)", ...extra];
      case "dinheiro":
        return ["Dinheiro na entrega/retirada", ...extra];
      default:
        return extra.length ? extra : ["A combinar"];
    }
  })();

  const message = useMemo(() => {
    if (lines.length === 0) return "";
    const itemLines = lines.map((l) => `· ${l.qty}x ${lineName(l)} — ${brl(round2(l.price * l.qty))}`);
    return [
      `*Pedido ${number || "----"}*`,
      "",
      "*WK SHOP*",
      "",
      ...itemLines,
      "",
      `_Subtotal: ${brl(subtotal)}_`,
      "",
      `Entrega: ${deliveryLabel}`,
      `*Total: ${brl(total)}*`,
      "",
      "*Forma de pagamento*",
      ...paymentLines,
      ...(obs.trim() ? ["", `Obs.: ${obs.trim()}`] : []),
      "",
      "*Cliente*",
      `Nome: ${name.trim() || "—"}`,
      `WhatsApp: ${phone.trim() || "—"}`,
    ].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, number, subtotal, total, deliveryLabel, paymentLines.join("|"), obs, name, phone]);

  function validate(): string | null {
    if (lines.length === 0) return "Adicione ao menos um produto.";
    if (!name.trim()) return "Informe o nome do cliente.";
    if (!number.trim()) return "Informe o número do pedido.";
    if (payType === "pix-parcelado" && dates.slice(0, parcels).some((d) => !d)) return "Preencha as datas das parcelas.";
    return null;
  }

  async function save(): Promise<SavedOrder | null> {
    const err = validate();
    if (err) {
      toast.error(err);
      return null;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          order: {
            number,
            customer: { name: name.trim(), phone: phone.trim() },
            items: lines.map((l) => ({ id: l.id, name: lineName(l), size: l.size, qty: l.qty, price: l.price })),
            delivery: { label: deliveryLabel, fee },
            payment: { label: paymentLines.join(" / ") },
            subtotal,
            total,
            message,
          },
        }),
      });
      if (res.status === 401) {
        onAuthFail();
        return null;
      }
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(d.message || "Não foi possível salvar o pedido.");
        return null;
      }
      setNumber(d.next || "");
      loadHistory();
      return d.order as SavedOrder;
    } catch {
      toast.error("Falha de conexão. Tente novamente.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Mensagem copiada.");
    } catch {
      toast.error("Não consegui copiar. Selecione o texto e copie manualmente.");
    }
  }

  async function saveAndCopy() {
    const o = await save();
    if (o) {
      await copyText(o.message);
      reset();
    }
  }
  async function saveAndSend() {
    const o = await save();
    if (o) {
      window.open(waLink(o.customer.phone, o.message), "_blank", "noopener");
      reset();
    }
  }

  function reset() {
    setLines([]);
    setName("");
    setPhone("");
    setDelNote("");
    setAddress("");
    setFeeTxt("");
    setPayNote("");
    setObs("");
  }

  const label = "block text-xs text-white/50 mb-1.5";

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-10">
      <div className="space-y-8">
        <section>
          <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-4" style={mono}>1 · Produtos</h2>
          <label className="relative block mb-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input aria-label="Buscar produto" placeholder="Buscar produto por nome, marca ou tamanho..." className={`${inputCls} pl-9`} value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          {results.length > 0 && (
            <ul className="border border-white/15 divide-y divide-white/10 mb-4">
              {results.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => add(p)} className="w-full text-left px-3 py-2.5 hover:bg-white/5 flex justify-between gap-3 text-sm">
                    <span>{p.name}{p.size && !p.name.toLowerCase().includes(p.size.toLowerCase()) ? <span className="text-white/40"> · {p.size}</span> : null}</span>
                    <span className="text-white/60 shrink-0">{brl(p.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {lines.length === 0 ? (
            <p className="text-white/35 text-sm">Busque e clique no produto para adicionar ao pedido.</p>
          ) : (
            <ul className="divide-y divide-white/10 border border-white/10">
              {lines.map((l) => (
                <li key={l.id} className="p-3 flex flex-wrap items-center gap-3">
                  <span className="flex-1 min-w-[200px] text-sm">{lineName(l)}</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <button type="button" aria-label="Diminuir" onClick={() => (l.qty > 1 ? patchLine(l.id, { qty: l.qty - 1 }) : setLines((c) => c.filter((x) => x.id !== l.id)))} className="w-8 h-8 border border-white/15 hover:text-white flex items-center justify-center"><Minus size={14} /></button>
                    <span className="w-6 text-center text-white">{l.qty}</span>
                    <button type="button" aria-label="Aumentar" onClick={() => patchLine(l.id, { qty: l.qty + 1 })} className="w-8 h-8 border border-white/15 hover:text-white flex items-center justify-center"><Plus size={14} /></button>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-white/40">
                    unitário
                    <PriceField value={l.price} onChange={(n) => patchLine(l.id, { price: n })} />
                  </label>
                  <span className="w-24 text-right text-sm">{brl(round2(l.price * l.qty))}</span>
                  <button type="button" aria-label="Remover" onClick={() => setLines((c) => c.filter((x) => x.id !== l.id))} className="text-white/40 hover:text-red-400"><Trash2 size={16} /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-4" style={mono}>2 · Cliente</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label} htmlFor="po-num">Nº do pedido</label>
              <input id="po-num" className={inputCls} value={number} onChange={(e) => setNumber(e.target.value)} inputMode="numeric" />
            </div>
            <div>
              <label className={label} htmlFor="po-name">Nome</label>
              <input id="po-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Larissa Martins (Wyda)" />
            </div>
            <div>
              <label className={label} htmlFor="po-phone">WhatsApp</label>
              <input id="po-phone" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="(15) 99999-9999" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-4" style={mono}>3 · Entrega</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="po-del">Tipo</label>
              <select id="po-del" className={`${inputCls} bg-black`} value={delType} onChange={(e) => setDelType(e.target.value as DeliveryType)}>
                <option value="pickup">Retirada em Sorocaba (grátis)</option>
                <option value="ship">Envio (frete)</option>
                <option value="outro">Outro (texto livre)</option>
              </select>
            </div>
            {delType === "ship" ? (
              <div>
                <label className={label} htmlFor="po-fee">Frete (R$) — sugerido {brl(autoFee)}</label>
                <input id="po-fee" className={inputCls} value={feeTxt} onChange={(e) => setFeeTxt(e.target.value)} inputMode="decimal" placeholder={String(autoFee).replace(".", ",")} />
              </div>
            ) : (
              <div>
                <label className={label} htmlFor="po-note">{delType === "pickup" ? "Local / observação (opcional)" : "Texto da entrega"}</label>
                <input id="po-note" className={inputCls} value={delNote} onChange={(e) => setDelNote(e.target.value)} placeholder={delType === "pickup" ? "Wyda" : "A combinar"} />
              </div>
            )}
            {delType === "ship" && (
              <div className="sm:col-span-2">
                <label className={label} htmlFor="po-addr">Endereço</label>
                <input id="po-addr" className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro, cidade/UF, CEP" />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-electric)] mb-4" style={mono}>4 · Pagamento</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="po-pay">Forma</label>
              <select id="po-pay" className={`${inputCls} bg-black`} value={payType} onChange={(e) => setPayType(e.target.value as PayType)}>
                <option value="pix">PIX à vista</option>
                <option value="pix-parcelado">PIX parcelado (com datas)</option>
                <option value="cartao">Cartão de crédito (link)</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="outro">Outro (texto livre)</option>
              </select>
            </div>
            {payType === "pix-parcelado" && (
              <div>
                <label className={label} htmlFor="po-parc">Parcelas</label>
                <select id="po-parc" className={`${inputCls} bg-black`} value={parcels} onChange={(e) => setParcels(Number(e.target.value))}>
                  {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
            )}
          </div>
          {payType === "pix-parcelado" && (
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {amounts.map((a, i) => (
                <li key={i} className="flex items-center gap-3 border border-white/10 p-3">
                  <span className="text-xs text-white/40 w-10" style={mono}>{i + 1}/{parcels}</span>
                  <input type="date" aria-label={`Data da parcela ${i + 1}`} className={`${inputCls} bg-black`} value={dates[i]} onChange={(e) => setDates((cur) => cur.map((d, k) => (k === i ? e.target.value : d)))} />
                  <span className="text-sm whitespace-nowrap">{brl(a)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="po-pnote">Texto extra do pagamento (opcional)</label>
              <input id="po-pnote" className={inputCls} value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="Chave Pix: ..." />
            </div>
            <div>
              <label className={label} htmlFor="po-obs">Observação do pedido (opcional)</label>
              <input id="po-obs" className={inputCls} value={obs} onChange={(e) => setObs(e.target.value)} />
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 self-start space-y-4">
        <div className="border border-white/10 bg-[#050505] p-5">
          <p className="text-xs text-white/40 mb-3" style={mono}>PRÉVIA DA MENSAGEM</p>
          {message ? (
            <pre className="whitespace-pre-wrap break-words text-sm text-white/85 leading-relaxed" style={{ fontFamily: "inherit" }}>{message}</pre>
          ) : (
            <p className="text-white/30 text-sm">Adicione produtos para ver a mensagem.</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <button className={`${btnPrimary} flex items-center justify-center gap-2`} disabled={saving || !message} onClick={saveAndSend}>
            <MessageCircle size={15} /> {saving ? "Salvando..." : "Salvar e abrir no WhatsApp"}
          </button>
          <button className={`${btn} flex items-center justify-center gap-2`} disabled={saving || !message} onClick={saveAndCopy}>
            <Copy size={15} /> Salvar e copiar mensagem
          </button>
          <p className="text-[11px] text-white/30">O pedido é salvo com o número acima e o próximo número é sugerido sozinho. Sem WhatsApp do cliente, o WhatsApp abre para você escolher o contato.</p>
        </div>
      </aside>

      {history.length > 0 && (
        <section className="lg:col-span-2 border-t border-white/10 pt-8">
          <h2 className="text-sm tracking-[0.2em] uppercase text-white/50 mb-4" style={mono}>Pedidos criados</h2>
          <ul className="divide-y divide-white/10 border border-white/10">
            {history.slice(0, 20).map((o) => (
              <li key={o.number} className="p-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="w-16 text-white/60" style={mono}>#{o.number}</span>
                <span className="flex-1 min-w-[160px]">{o.customer.name}</span>
                <span className="text-white/40 text-xs">{new Date(o.createdAt).toLocaleDateString("pt-BR")}</span>
                <span className="w-28 text-right">{brl(o.total)}</span>
                <button className={btn} onClick={() => copyText(o.message)}>Copiar</button>
                <a className={btn} href={waLink(o.customer.phone, o.message)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function PriceField({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [txt, setTxt] = useState(String(value).replace(".", ","));
  return (
    <input
      inputMode="decimal"
      aria-label="Preço unitário"
      className={`${inputCls} w-28`}
      value={txt}
      onChange={(e) => {
        setTxt(e.target.value);
        const n = parseMoney(e.target.value);
        if (Number.isFinite(n) && n >= 0) onChange(round2(n));
      }}
    />
  );
}
