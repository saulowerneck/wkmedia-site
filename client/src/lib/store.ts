/* WK Shop — tipos e funções puras da loja. O catálogo em si vem de CatalogContext. */
import seedData from "@shared/store.json";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  /** tamanho/volume exibido (ex.: "250 mL") */
  size?: string;
  /** preço em reais */
  price: number;
  /** preço "de" (riscado), opcional */
  compareAtPrice?: number;
  /** /loja/arquivo.jpg (versionadas) ou /loja-img/chave (enviadas pelo painel) */
  images: string[];
  description: string;
  details?: string[];
  stock: number;
  /** produto sob encomenda: não usa estoque */
  madeToOrder?: boolean;
  active?: boolean;
}

export interface StoreSettings {
  name: string;
  whatsapp: string;
  installments: number;
  madeToOrder: { label: string; note: string };
  pickup: { enabled: boolean; label: string; note: string };
  shipping: { enabled: boolean; label: string; flatRate: number; freeFrom: number; note: string };
}

export interface Catalog {
  settings: StoreSettings;
  products: Product[];
  version?: number;
  updatedAt?: string;
}

/** Catálogo embutido no build: usado como reserva se a API do catálogo falhar. */
export const SEED = seedData as unknown as Catalog;

export const MAX_MADE_TO_ORDER_QTY = 20;

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const maxQty = (p: Product) => (p.madeToOrder ? MAX_MADE_TO_ORDER_QTY : p.stock);
export const isSoldOut = (p: Product) => !p.madeToOrder && p.stock <= 0;

export type DeliveryMethod = "pickup" | "ship";

export function shippingCost(settings: StoreSettings, subtotal: number, method: DeliveryMethod): number {
  if (method === "pickup") return 0;
  const s = settings.shipping;
  if (s.freeFrom > 0 && subtotal >= s.freeFrom) return 0;
  return s.flatRate;
}

export interface OrderLine {
  product: Product;
  qty: number;
}

export function buildWhatsAppMessage(
  settings: StoreSettings,
  opts: {
    lines: OrderLine[];
    subtotal: number;
    shipping: number;
    method: DeliveryMethod;
    customer: { name: string; email: string; phone: string };
    address?: string;
  },
) {
  const items = opts.lines
    .map((l) => `• ${l.qty}x ${l.product.name}${l.product.size ? ` (${l.product.size})` : ""} — ${brl(l.product.price * l.qty)}`)
    .join("\n");
  const entrega = opts.method === "pickup" ? settings.pickup.label : `Envio${opts.address ? `: ${opts.address}` : ""}`;
  return (
    `Olá! Quero fazer um pedido na ${settings.name}:\n\n${items}\n\n` +
    `Subtotal: ${brl(opts.subtotal)}\nEntrega: ${entrega} (${opts.shipping === 0 ? "grátis" : brl(opts.shipping)})\n` +
    `Total: ${brl(opts.subtotal + opts.shipping)}\n\n` +
    `Nome: ${opts.customer.name}\nE-mail: ${opts.customer.email}\nWhatsApp: ${opts.customer.phone}`
  );
}
