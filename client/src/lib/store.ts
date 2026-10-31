/* WK Shop — dados e helpers da loja (fonte única: shared/store.json) */
import data from "@shared/store.json";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  /** preço em reais */
  price: number;
  /** preço "de" (riscado), opcional */
  compareAtPrice?: number;
  /** caminhos em /loja/... (client/public/loja) */
  images: string[];
  description: string;
  details?: string[];
  stock: number;
  active?: boolean;
}

export interface StoreSettings {
  name: string;
  whatsapp: string;
  installments: number;
  pickup: { enabled: boolean; label: string; note: string };
  shipping: { enabled: boolean; label: string; flatRate: number; freeFrom: number; note: string };
}

const raw = data as unknown as { settings: StoreSettings; products: Product[] };

export const SETTINGS = raw.settings;
export const PRODUCTS: Product[] = raw.products.filter((p) => p.active !== false);
/** Há produtos cadastrados: habilita carrinho e links de compra. */
export const STORE_ENABLED = PRODUCTS.length > 0;
/** Link da loja no menu/rodapé (visível mesmo sem produtos; a página mostra "Em breve"). */
export const SHOW_STORE_LINK = true;

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getProductBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export type DeliveryMethod = "pickup" | "ship";

export function shippingCost(subtotal: number, method: DeliveryMethod): number {
  if (method === "pickup") return 0;
  const s = SETTINGS.shipping;
  if (s.freeFrom > 0 && subtotal >= s.freeFrom) return 0;
  return s.flatRate;
}

export interface OrderLine {
  product: Product;
  qty: number;
}

export function buildWhatsAppMessage(opts: {
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  method: DeliveryMethod;
  customer: { name: string; email: string; phone: string };
  address?: string;
}) {
  const items = opts.lines.map((l) => `• ${l.qty}x ${l.product.name} — ${brl(l.product.price * l.qty)}`).join("\n");
  const entrega = opts.method === "pickup" ? SETTINGS.pickup.label : `Envio${opts.address ? `: ${opts.address}` : ""}`;
  return (
    `Olá! Quero fazer um pedido na ${SETTINGS.name}:\n\n${items}\n\n` +
    `Subtotal: ${brl(opts.subtotal)}\nEntrega: ${entrega} (${opts.shipping === 0 ? "grátis" : brl(opts.shipping)})\n` +
    `Total: ${brl(opts.subtotal + opts.shipping)}\n\n` +
    `Nome: ${opts.customer.name}\nE-mail: ${opts.customer.email}\nWhatsApp: ${opts.customer.phone}`
  );
}
