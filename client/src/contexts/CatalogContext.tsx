/* WK Shop — catálogo vivo (editável pelo painel /admin). Reserva: seed do build. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED, type Catalog, type Product, type StoreSettings } from "@/lib/store";

interface CatalogCtx {
  settings: StoreSettings;
  products: Product[];
  /** true depois que o catálogo foi carregado (ou a reserva assumiu) */
  ready: boolean;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const Ctx = createContext<CatalogCtx | null>(null);
const active = (c: Catalog) => c.products.filter((p) => p.active !== false);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    fetch("/.netlify/functions/catalog", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Catalog) => {
        if (data && Array.isArray(data.products) && data.settings) setCatalog(data);
      })
      .catch(() => {
        /* mantém o seed do build */
      })
      .finally(() => {
        clearTimeout(timer);
        setReady(true);
      });
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  const value = useMemo<CatalogCtx>(() => {
    const products = active(catalog);
    return {
      settings: catalog.settings,
      products,
      ready,
      getProduct: (id) => products.find((p) => p.id === id),
      getProductBySlug: (slug) => products.find((p) => p.slug === slug),
    };
  }, [catalog, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog deve ser usado dentro de CatalogProvider");
  return ctx;
}
