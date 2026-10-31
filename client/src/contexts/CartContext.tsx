/* WK Shop — carrinho (persistido no navegador) */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { maxQty, type OrderLine } from "@/lib/store";
import { useCatalog } from "@/contexts/CatalogContext";

type Line = { id: string; qty: number };
const KEY = "wk-shop-cart-v1";

interface CartCtx {
  lines: OrderLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number, openDrawer?: boolean) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

function load(): Line[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((l) => l && typeof l.id === "string" && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useCatalog();
  const [raw, setRaw] = useState<Line[]>(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {
      /* storage indisponível: o carrinho vive só na memória */
    }
  }, [raw]);

  const clampQty = useCallback(
    (id: string, qty: number) => {
      const p = getProduct(id);
      if (!p) return 0;
      return Math.max(0, Math.min(Math.floor(qty), maxQty(p)));
    },
    [getProduct],
  );

  const add = useCallback((id: string, qty = 1, openDrawer = true) => {
    setRaw((cur) => {
      const found = cur.find((l) => l.id === id);
      const next = clampQty(id, (found?.qty ?? 0) + qty);
      if (next === 0) return cur;
      return found ? cur.map((l) => (l.id === id ? { ...l, qty: next } : l)) : [...cur, { id, qty: next }];
    });
    if (openDrawer) setOpen(true);
  }, [clampQty]);

  const setQty = useCallback((id: string, qty: number) => {
    setRaw((cur) => {
      const next = clampQty(id, qty);
      return next === 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty: next } : l));
    });
  }, [clampQty]);

  const remove = useCallback((id: string) => setRaw((cur) => cur.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartCtx>(() => {
    const lines: OrderLine[] = raw.flatMap((l) => {
      const product = getProduct(l.id);
      const qty = clampQty(l.id, l.qty);
      return product && qty > 0 ? [{ product, qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, open, add, setQty, remove, clear, clampQty, getProduct]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
