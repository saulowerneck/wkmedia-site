/* WK Shop — painel de administração (/admin): produtos, preços, fotos e configurações */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Copy, Download, ImagePlus, LogOut, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { brl, type Catalog, type Product, type StoreSettings } from "@/lib/store";

const API = "/.netlify/functions";
const TOKEN_KEY = "wk-admin-token";

/* ------------------------------------------------------------------ helpers */

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const round2 = (n: number) => Math.round(n * 100) / 100;
const parseMoney = (t: string) => Number(t.replace(/\./g, "").replace(",", ".").trim() || NaN) || Number(t.replace(",", ".")) || NaN;
const uniqueSlug = (base: string, taken: Set<string>) => {
  let s = base || "produto";
  let i = 2;
  while (taken.has(s)) s = `${base}-${i++}`;
  return s;
};

function readToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/** Reduz a foto para no máx. 1200px e converte para JPEG (arquivos pequenos e rápidos no site). */
async function resizeToJpegBase64(file: File, maxSide = 1200): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

class AuthError extends Error {}

const inputCls =
  "w-full bg-transparent border border-white/15 focus:border-[var(--color-electric)] outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25";
const btn =
  "px-4 py-2.5 text-xs tracking-[0.12em] uppercase border border-white/20 text-white/80 hover:border-[var(--color-electric)] hover:text-[var(--color-electric)] transition-colors disabled:opacity-40";
const btnPrimary =
  "px-5 py-2.5 text-xs tracking-[0.12em] uppercase bg-[var(--color-electric)] text-white hover:bg-[var(--color-electric-hover)] transition-colors disabled:opacity-40";
const mono = { fontFamily: "var(--font-mono)" } as const;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/50 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-white/30 mt-1">{hint}</span>}
    </label>
  );
}

/** Campo de preço que aceita vírgula e não "briga" com a digitação. */
function PriceInput({ value, onChange, className = "" }: { value: number; onChange: (n: number) => void; className?: string }) {
  const [txt, setTxt] = useState(String(value).replace(".", ","));
  useEffect(() => {
    if (round2(parseMoney(txt) || 0) !== round2(value)) setTxt(String(value).replace(".", ","));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      inputMode="decimal"
      value={txt}
      aria-label="Preço"
      className={`${inputCls} ${className}`}
      onChange={(e) => {
        setTxt(e.target.value);
        const n = parseMoney(e.target.value);
        if (Number.isFinite(n) && n >= 0) onChange(round2(n));
      }}
    />
  );
}

/* -------------------------------------------------------------------- login */

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        try {
          sessionStorage.setItem(TOKEN_KEY, data.token);
        } catch {
          /* sessão só em memória */
        }
        onLogin(data.token);
      } else {
        setMsg(data.message || "Não foi possível entrar.");
      }
    } catch {
      setMsg("Falha de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-white/10 bg-[#050505] p-8 space-y-5">
        <div>
          <p className="text-[var(--color-electric)] text-xs tracking-[0.2em] uppercase" style={mono}>WK Shop</p>
          <h1 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>Painel da loja</h1>
        </div>
        <Field label="Senha">
          <input type="password" autoFocus autoComplete="current-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {msg && <p role="alert" className="text-sm text-red-400">{msg}</p>}
        <button className={`${btnPrimary} w-full`} disabled={busy || !password}>{busy ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------ product editor */

function ProductEditor({
  initial,
  categories,
  isNew,
  takenSlugs,
  token,
  onSave,
  onDelete,
  onClose,
  onAuthError,
}: {
  initial: Product;
  categories: string[];
  isNew: boolean;
  takenSlugs: Set<string>;
  token: string;
  onSave: (p: Product) => void;
  onDelete: () => void;
  onClose: () => void;
  onAuthError: () => void;
}) {
  const [p, setP] = useState<Product>(initial);
  const [detailsTxt, setDetailsTxt] = useState((initial.details || []).join("\n"));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((cur) => ({ ...cur, [k]: v }));

  function setName(name: string) {
    setP((cur) => {
      const next = { ...cur, name };
      if (!slugTouched) next.slug = uniqueSlug(slugify(`${name} ${cur.size || ""}`), takenSlugs);
      return next;
    });
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const dataBase64 = await resizeToJpegBase64(file);
        const res = await fetch(`${API}/admin-upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ dataBase64 }),
        });
        if (res.status === 401) return onAuthError();
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Falha no envio da foto.");
        urls.push(data.url);
      }
      setP((cur) => ({ ...cur, images: [...cur.images, ...urls].slice(0, 10) }));
      toast.success(urls.length > 1 ? `${urls.length} fotos enviadas.` : "Foto enviada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no envio da foto.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const move = (i: number, d: -1 | 1) =>
    setP((cur) => {
      const imgs = [...cur.images];
      const j = i + d;
      if (j < 0 || j >= imgs.length) return cur;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...cur, images: imgs };
    });

  function save() {
    const out: Product = {
      ...p,
      name: p.name.trim(),
      category: p.category.trim(),
      slug: slugify(p.slug),
      details: detailsTxt.split("\n").map((d) => d.trim()).filter(Boolean),
    };
    if (!out.name) return toast.error("Informe o nome do produto.");
    if (!out.category) return toast.error("Informe a categoria.");
    if (!(out.price > 0)) return toast.error("Informe um preço maior que zero.");
    if (!out.slug) return toast.error("Informe o endereço (slug) do produto.");
    if (takenSlugs.has(out.slug)) return toast.error("Já existe outro produto com esse endereço (slug).");
    if (!out.compareAtPrice || out.compareAtPrice <= 0) delete out.compareAtPrice;
    onSave(out);
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 overflow-y-auto" role="dialog" aria-label={isNew ? "Novo produto" : "Editar produto"}>
      <div className="min-h-full flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl bg-[#050505] border border-white/10">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{isNew ? "Novo produto" : "Editar produto"}</h2>
            <button onClick={onClose} aria-label="Fechar" className="text-white/60 hover:text-white"><X size={22} /></button>
          </div>

          <div className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Field label="Nome"><input className={inputCls} value={p.name} onChange={(e) => setName(e.target.value)} /></Field></div>
            <Field label="Marca"><input className={inputCls} value={p.brand || ""} onChange={(e) => set("brand", e.target.value)} /></Field>
            <Field label="Categoria">
              <input className={inputCls} list="cat-list" value={p.category} onChange={(e) => set("category", e.target.value)} />
              <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field label="Tamanho / volume" hint='Ex.: "250 mL", "M", "42"'>
              <input className={inputCls} value={p.size || ""} onChange={(e) => set("size", e.target.value)} />
            </Field>
            <Field label="Preço (R$)"><PriceInput value={p.price} onChange={(n) => set("price", n)} /></Field>
            <Field label='Preço "de" (riscado, opcional)'>
              <PriceInput value={p.compareAtPrice || 0} onChange={(n) => set("compareAtPrice", n || undefined)} />
            </Field>
            <Field label="Estoque" hint="Ignorado nos produtos sob encomenda.">
              <input type="number" min={0} className={inputCls} value={p.stock} onChange={(e) => set("stock", Math.max(0, Math.floor(Number(e.target.value) || 0)))} />
            </Field>
            <div className="sm:col-span-2 flex flex-wrap gap-6 py-1">
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={!!p.madeToOrder} onChange={(e) => set("madeToOrder", e.target.checked)} /> Sob encomenda
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={p.active !== false} onChange={(e) => set("active", e.target.checked)} /> Visível na loja
              </label>
            </div>
            <div className="sm:col-span-2"><Field label="Descrição"><textarea rows={3} className={inputCls} value={p.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
            <div className="sm:col-span-2"><Field label="Detalhes (um por linha)"><textarea rows={3} className={inputCls} value={detailsTxt} onChange={(e) => setDetailsTxt(e.target.value)} /></Field></div>
            <div className="sm:col-span-2">
              <Field label="Endereço (slug)" hint={`wkmedia.com.br/loja/${p.slug || "..."}`}>
                <input className={inputCls} value={p.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <span className="block text-xs text-white/50 mb-2">Fotos (a primeira é a principal)</span>
              <div className="flex flex-wrap gap-3">
                {p.images.map((src, i) => (
                  <div key={src + i} className="w-28 border border-white/10 bg-[#0A0A0A]">
                    <div className="aspect-square overflow-hidden"><img src={src} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex items-center justify-between p-1">
                      <button aria-label="Mover para a esquerda" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-white/50 hover:text-white disabled:opacity-20"><ArrowLeft size={14} /></button>
                      <button aria-label="Remover foto" onClick={() => setP((c) => ({ ...c, images: c.images.filter((_, k) => k !== i) }))} className="p-1 text-white/50 hover:text-red-400"><Trash2 size={14} /></button>
                      <button aria-label="Mover para a direita" onClick={() => move(i, 1)} disabled={i === p.images.length - 1} className="p-1 text-white/50 hover:text-white disabled:opacity-20"><ArrowRight size={14} /></button>
                    </div>
                  </div>
                ))}
                {p.images.length < 10 && (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-28 aspect-square border border-dashed border-white/20 text-white/50 hover:text-[var(--color-electric)] hover:border-[var(--color-electric)] flex flex-col items-center justify-center gap-1 text-xs disabled:opacity-50">
                    <ImagePlus size={20} /> {uploading ? "Enviando..." : "Adicionar"}
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-white/10">
            {!isNew ? (
              <button className={`${btn} !border-red-400/40 !text-red-400 hover:!bg-red-400/10`} onClick={() => confirm("Excluir este produto da loja?") && onDelete()}>
                <Trash2 size={14} className="inline mr-1.5 -mt-0.5" /> Excluir
              </button>
            ) : <span />}
            <div className="flex gap-3">
              <button className={btn} onClick={onClose}>Cancelar</button>
              <button className={btnPrimary} onClick={save} disabled={uploading}>Aplicar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- settings */

function SettingsForm({ settings, onChange }: { settings: StoreSettings; onChange: (s: StoreSettings) => void }) {
  const up = (patch: Partial<StoreSettings>) => onChange({ ...settings, ...patch });
  return (
    <div className="max-w-3xl space-y-10">
      <section className="grid sm:grid-cols-2 gap-4">
        <h3 className="sm:col-span-2 text-sm tracking-[0.2em] uppercase text-[var(--color-electric)]" style={mono}>Geral</h3>
        <Field label="Nome da loja"><input className={inputCls} value={settings.name} onChange={(e) => up({ name: e.target.value })} /></Field>
        <Field label="WhatsApp da loja" hint="DDI + DDD + número, só dígitos. Ex.: 5515996528429">
          <input className={inputCls} inputMode="numeric" value={settings.whatsapp} onChange={(e) => up({ whatsapp: e.target.value.replace(/\D/g, "") })} />
        </Field>
        <Field label="Parcelas máximas no cartão"><input type="number" min={1} max={12} className={inputCls} value={settings.installments} onChange={(e) => up({ installments: Math.min(12, Math.max(1, Math.floor(Number(e.target.value) || 1))) })} /></Field>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <h3 className="sm:col-span-2 text-sm tracking-[0.2em] uppercase text-[var(--color-electric)]" style={mono}>Sob encomenda</h3>
        <Field label="Rótulo"><input className={inputCls} value={settings.madeToOrder.label} onChange={(e) => up({ madeToOrder: { ...settings.madeToOrder, label: e.target.value } })} /></Field>
        <div className="sm:col-span-2"><Field label="Aviso ao cliente (prazo etc.)"><textarea rows={2} className={inputCls} value={settings.madeToOrder.note} onChange={(e) => up({ madeToOrder: { ...settings.madeToOrder, note: e.target.value } })} /></Field></div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <h3 className="sm:col-span-2 text-sm tracking-[0.2em] uppercase text-[var(--color-electric)]" style={mono}>Retirada</h3>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={settings.pickup.enabled} onChange={(e) => up({ pickup: { ...settings.pickup, enabled: e.target.checked } })} /> Oferecer retirada</label>
        <Field label="Rótulo"><input className={inputCls} value={settings.pickup.label} onChange={(e) => up({ pickup: { ...settings.pickup, label: e.target.value } })} /></Field>
        <div className="sm:col-span-2"><Field label="Texto para o cliente"><textarea rows={2} className={inputCls} value={settings.pickup.note} onChange={(e) => up({ pickup: { ...settings.pickup, note: e.target.value } })} /></Field></div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <h3 className="sm:col-span-2 text-sm tracking-[0.2em] uppercase text-[var(--color-electric)]" style={mono}>Envio</h3>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={settings.shipping.enabled} onChange={(e) => up({ shipping: { ...settings.shipping, enabled: e.target.checked } })} /> Oferecer envio</label>
        <Field label="Rótulo"><input className={inputCls} value={settings.shipping.label} onChange={(e) => up({ shipping: { ...settings.shipping, label: e.target.value } })} /></Field>
        <span />
        <Field label="Valor do frete (R$)"><PriceInput value={settings.shipping.flatRate} onChange={(n) => up({ shipping: { ...settings.shipping, flatRate: n } })} /></Field>
        <Field label="Frete grátis a partir de (R$)" hint="0 = nunca grátis"><PriceInput value={settings.shipping.freeFrom} onChange={(n) => up({ shipping: { ...settings.shipping, freeFrom: n } })} /></Field>
        <div className="sm:col-span-2"><Field label="Texto para o cliente"><textarea rows={2} className={inputCls} value={settings.shipping.note} onChange={(e) => up({ shipping: { ...settings.shipping, note: e.target.value } })} /></Field></div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------- panel */

type Tab = "produtos" | "config";

function Panel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [baseVersion, setBaseVersion] = useState(0);
  const [original, setOriginal] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("produtos");

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [status, setStatus] = useState<"todos" | "ativos" | "ocultos">("todos");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{ product: Product; isNew: boolean } | null>(null);
  const [fixedPrice, setFixedPrice] = useState("");
  const [percent, setPercent] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const authFail = useCallback(() => {
    toast.error("Sessão expirada. Entre novamente.");
    onLogout();
  }, [onLogout]);

  const apply = useCallback((c: Catalog) => {
    setSettings(c.settings);
    setProducts(c.products);
    setBaseVersion(Number(c.version ?? 0));
    setOriginal(JSON.stringify({ settings: c.settings, products: c.products }));
    setSelected(new Set());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin-catalog`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) throw new AuthError();
      if (!res.ok) throw new Error("Não foi possível carregar o catálogo.");
      apply(await res.json());
    } catch (err) {
      if (err instanceof AuthError) authFail();
      else toast.error(err instanceof Error ? err.message : "Falha ao carregar.");
    } finally {
      setLoading(false);
    }
  }, [token, apply, authFail]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = settings !== null && JSON.stringify({ settings, products }) !== original;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "Todas" || p.category === cat) &&
        (status === "todos" || (status === "ativos" ? p.active !== false : p.active === false)) &&
        (!term || `${p.name} ${p.brand ?? ""} ${p.size ?? ""} ${p.category}`.toLowerCase().includes(term)),
    );
  }, [products, q, cat, status]);

  const patch = (id: string, change: Partial<Product>) => setProducts((cur) => cur.map((p) => (p.id === id ? { ...p, ...change } : p)));

  function toggleSel(id: string) {
    setSelected((cur) => {
      const n = new Set(cur);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((p) => p.id)));

  function bulkSetPrice() {
    const n = parseMoney(fixedPrice);
    if (!(n > 0)) return toast.error("Informe um preço válido.");
    setProducts((cur) => cur.map((p) => (selected.has(p.id) ? { ...p, price: round2(n) } : p)));
    toast.success(`Preço de ${selected.size} produto(s) alterado. Lembre de salvar.`);
    setFixedPrice("");
  }
  function bulkPercent() {
    const n = Number(percent.replace(",", "."));
    if (!Number.isFinite(n) || n === 0 || n <= -90) return toast.error("Informe um percentual válido (ex.: 10 ou -5).");
    setProducts((cur) => cur.map((p) => (selected.has(p.id) ? { ...p, price: Math.max(0.01, round2(p.price * (1 + n / 100))) } : p)));
    toast.success(`Preços reajustados em ${n}%. Lembre de salvar.`);
    setPercent("");
  }
  const bulkActive = (active: boolean) => setProducts((cur) => cur.map((p) => (selected.has(p.id) ? { ...p, active } : p)));

  function newProduct() {
    const taken = new Set(products.map((p) => p.slug));
    const id = `p-${Date.now().toString(36)}`;
    setEditing({
      isNew: true,
      product: {
        id, slug: uniqueSlug("novo-produto", taken), name: "", brand: "", category: cat !== "Todas" ? cat : "", size: "", price: 0,
        images: [], description: "", details: [], stock: 0, madeToOrder: false, active: true,
      },
    });
  }
  function duplicate(p: Product) {
    const taken = new Set(products.map((x) => x.slug));
    setEditing({
      isNew: true,
      product: { ...p, id: `p-${Date.now().toString(36)}`, slug: uniqueSlug(`${p.slug}-copia`, taken), name: `${p.name} (cópia)` },
    });
  }

  function commitEdit(p: Product) {
    setProducts((cur) => (editing?.isNew ? [p, ...cur] : cur.map((x) => (x.id === p.id ? p : x))));
    setEditing(null);
    toast.success("Produto atualizado. Lembre de salvar as alterações.");
  }

  async function save() {
    if (!settings) return;
    const bad = products.find((p) => !(p.price > 0));
    if (bad) return toast.error(`"${bad.name}" está sem preço.`);
    setSaving(true);
    try {
      const res = await fetch(`${API}/admin-catalog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ catalog: { settings, products }, baseVersion }),
      });
      if (res.status === 401) throw new AuthError();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Não foi possível salvar.");
      apply(data);
      toast.success("Alterações salvas! A loja já está atualizada.");
    } catch (err) {
      if (err instanceof AuthError) authFail();
      else toast.error(err instanceof Error ? err.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify({ settings, products }, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `wk-shop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function importBackup(file?: File) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data?.settings || !Array.isArray(data?.products)) throw new Error();
      if (!confirm("Substituir o catálogo atual pelo arquivo de backup? (Você ainda precisa clicar em Salvar.)")) return;
      setSettings(data.settings);
      setProducts(data.products);
      setSelected(new Set());
      toast.success("Backup carregado. Revise e clique em Salvar.");
    } catch {
      toast.error("Arquivo de backup inválido.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  if (loading || !settings) {
    return <div className="min-h-screen bg-black text-white/50 flex items-center justify-center">Carregando painel...</div>;
  }

  const slugsExcept = (id: string) => new Set(products.filter((p) => p.id !== id).map((p) => p.slug));

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>WK<span className="text-[var(--color-electric)]"> Shop</span> <span className="text-white/40 text-sm font-normal hidden sm:inline">painel</span></span>
            <nav className="flex gap-1 whitespace-nowrap">
              {(["produtos", "config"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs tracking-[0.12em] uppercase ${tab === t ? "text-[var(--color-electric)] border-b border-[var(--color-electric)]" : "text-white/50 hover:text-white"}`} style={mono}>
                  {t === "produtos" ? `Produtos (${products.length})` : "Configurações"}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/loja" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white hidden sm:inline">Ver loja ↗</a>
            <button onClick={() => (!dirty || confirm("Há alterações não salvas. Sair mesmo assim?")) && onLogout()} className="text-white/50 hover:text-white flex items-center gap-1.5"><LogOut size={15} /> Sair</button>
          </div>
        </div>
      </header>

      <div className={`sticky top-16 z-30 border-b ${dirty ? "border-[var(--color-electric)] bg-[#050A18]" : "border-white/10 bg-black"}`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <p className="text-sm text-white/60">{dirty ? "Você tem alterações não salvas." : "Tudo salvo."}</p>
          <div className="flex gap-3">
            {dirty && <button className={btn} disabled={saving} onClick={() => confirm("Descartar alterações não salvas?") && load()}>Descartar</button>}
            <button className={btnPrimary} disabled={!dirty || saving} onClick={save}>{saving ? "Salvando..." : "Salvar alterações"}</button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {tab === "config" ? (
          <SettingsForm settings={settings} onChange={setSettings} />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-4">
              <label className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input aria-label="Buscar" placeholder="Buscar por nome, marca, tamanho..." className={`${inputCls} pl-9`} value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
              <select aria-label="Categoria" className={`${inputCls} lg:w-48 bg-black`} value={cat} onChange={(e) => setCat(e.target.value)}>
                <option>Todas</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select aria-label="Situação" className={`${inputCls} lg:w-40 bg-black`} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="todos">Todos</option>
                <option value="ativos">Visíveis</option>
                <option value="ocultos">Ocultos</option>
              </select>
              <button className={btnPrimary} onClick={newProduct}><Plus size={14} className="inline -mt-0.5 mr-1" /> Novo produto</button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-white/50">
              <button className={btn} onClick={downloadBackup}><Download size={13} className="inline -mt-0.5 mr-1" /> Backup</button>
              <button className={btn} onClick={() => importRef.current?.click()}><Upload size={13} className="inline -mt-0.5 mr-1" /> Importar backup</button>
              <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => importBackup(e.target.files?.[0])} />
              <button className={btn} onClick={() => !dirty || confirm("Descartar alterações não salvas e recarregar?") ? load() : undefined}>Recarregar</button>
            </div>

            {selected.size > 0 && (
              <div className="mb-4 border border-[var(--color-electric)]/40 bg-[var(--color-electric-subtle)] p-4 flex flex-wrap items-end gap-4" aria-label="Ações em massa">
                <p className="text-sm"><strong>{selected.size}</strong> selecionado(s)</p>
                <div className="flex items-end gap-2">
                  <Field label="Definir preço (R$)"><input aria-label="Preço fixo" className={`${inputCls} w-28`} value={fixedPrice} onChange={(e) => setFixedPrice(e.target.value)} placeholder="89,00" /></Field>
                  <button className={btn} onClick={bulkSetPrice}>Aplicar</button>
                </div>
                <div className="flex items-end gap-2">
                  <Field label="Reajustar (%)"><input aria-label="Percentual" className={`${inputCls} w-24`} value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="10 ou -5" /></Field>
                  <button className={btn} onClick={bulkPercent}>Aplicar</button>
                </div>
                <button className={btn} onClick={() => bulkActive(true)}>Mostrar na loja</button>
                <button className={btn} onClick={() => bulkActive(false)}>Ocultar da loja</button>
                <button className="text-xs text-white/50 underline ml-auto" onClick={() => setSelected(new Set())}>Limpar seleção</button>
              </div>
            )}

            <div className="border border-white/10 divide-y divide-white/5">
              <div className="hidden md:grid grid-cols-[32px_56px_1fr_150px_120px_90px_90px] gap-3 items-center px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-white/40" style={mono}>
                <input type="checkbox" aria-label="Selecionar todos" checked={allFilteredSelected} onChange={toggleAll} />
                <span /> <span>Produto</span> <span>Categoria</span> <span>Preço (R$)</span> <span>Visível</span> <span />
              </div>
              {filtered.length === 0 && <p className="p-8 text-center text-white/40">Nenhum produto encontrado.</p>}
              {filtered.map((p) => (
                <div key={p.id} className={`grid grid-cols-[32px_56px_1fr] md:grid-cols-[32px_56px_1fr_150px_120px_90px_90px] gap-3 items-center px-3 py-2.5 ${p.active === false ? "opacity-50" : ""}`}>
                  <input type="checkbox" aria-label={`Selecionar ${p.name}`} checked={selected.has(p.id)} onChange={() => toggleSel(p.id)} />
                  <div className="w-14 h-14 bg-[#0A0A0A] overflow-hidden">{p.images[0] && <img src={p.images[0]} alt="" loading="lazy" className="w-full h-full object-cover" />}</div>
                  <div className="min-w-0">
                    <p className="text-sm truncate">{p.name}</p>
                    <p className="text-xs text-white/40 truncate">{[p.brand, p.size].filter(Boolean).join(" · ")}{p.madeToOrder ? " · sob encomenda" : ""}</p>
                  </div>
                  <span className="hidden md:block text-xs text-white/50 truncate">{p.category}</span>
                  <div className="col-span-2 md:col-span-1 md:col-start-auto col-start-3"><PriceInput value={p.price} onChange={(n) => patch(p.id, { price: n })} /></div>
                  <label className="hidden md:flex items-center gap-2 text-xs text-white/60">
                    <input type="checkbox" aria-label={`Visível: ${p.name}`} checked={p.active !== false} onChange={(e) => patch(p.id, { active: e.target.checked })} /> {p.active === false ? "Oculto" : "Sim"}
                  </label>
                  <div className="hidden md:flex gap-1 justify-end">
                    <button aria-label={`Editar ${p.name}`} className="p-2 text-white/50 hover:text-[var(--color-electric)]" onClick={() => setEditing({ product: p, isNew: false })}><Pencil size={15} /></button>
                    <button aria-label={`Duplicar ${p.name}`} className="p-2 text-white/50 hover:text-[var(--color-electric)]" onClick={() => duplicate(p)}><Copy size={15} /></button>
                  </div>
                  <div className="md:hidden col-span-3 flex gap-2">
                    <button className={btn} onClick={() => setEditing({ product: p, isNew: false })}>Editar</button>
                    <button className={btn} onClick={() => patch(p.id, { active: p.active === false })}>{p.active === false ? "Mostrar" : "Ocultar"}</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-3">{filtered.length} de {products.length} produtos · mudanças só valem para os clientes depois de clicar em <strong>Salvar alterações</strong>.</p>
          </>
        )}
      </main>

      {editing && (
        <ProductEditor
          key={editing.product.id}
          initial={editing.product}
          isNew={editing.isNew}
          categories={categories}
          takenSlugs={slugsExcept(editing.product.id)}
          token={token}
          onSave={commitEdit}
          onDelete={() => {
            setProducts((cur) => cur.filter((p) => p.id !== editing.product.id));
            setEditing(null);
            toast.success("Produto removido. Lembre de salvar as alterações.");
          }}
          onClose={() => setEditing(null)}
          onAuthError={authFail}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- page */

export default function Admin() {
  usePageMeta("Painel | WK Shop");
  const [token, setToken] = useState(readToken);

  // Página privada: fora dos buscadores
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = "noindex, nofollow";
    return () => {
      if (created) meta?.remove();
      else if (meta) meta.content = prev;
    };
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignora */
    }
    setToken("");
  }, []);

  return token ? <Panel token={token} onLogout={logout} /> : <Login onLogin={setToken} />;
}
