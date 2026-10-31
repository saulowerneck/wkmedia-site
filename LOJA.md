# WK Shop — como operar a loja

A loja fica em `/loja` e só aparece no menu/rodapé quando há produtos em `shared/store.json`.

## Adicionar produtos
Edite o array `products` em `shared/store.json` (um objeto por produto):

```json
{
  "id": "perf-001",
  "slug": "perfume-x-100ml",
  "name": "Perfume X 100ml",
  "brand": "Marca X",
  "category": "Perfumes",
  "price": 199.9,
  "compareAtPrice": 249.9,
  "images": ["/loja/perf-001.jpg"],
  "description": "Texto do produto.",
  "details": ["100ml", "Eau de parfum"],
  "stock": 8,
  "active": true
}
```
- `id`: único, sem espaços. `slug`: vira a URL `/loja/<slug>`.
- `category`: as categorias do filtro saem daqui. `price` em reais; `compareAtPrice` (preço "de") é opcional.
- `images`: arquivos em `client/public/loja/`. `stock: 0` = esgotado; `active: false` esconde o produto.
- Frete, retirada e parcelas: bloco `settings` do mesmo arquivo.
- Cada alteração enviada ao GitHub gera um novo deploy no Netlify.

## Pagamento (Mercado Pago — Checkout Pro)
Variáveis no Netlify (Site configuration → Environment variables):
- `MP_ACCESS_TOKEN` — Access Token de **produção** do Mercado Pago (APP_USR-...)
- `CALLMEBOT_PHONE` / `CALLMEBOT_APIKEY` — já existem (aviso de pedido pago no WhatsApp)
- `SITE_URL` — opcional (padrão https://wkmedia.com.br)

No painel do Mercado Pago, a notificação (webhook) já é enviada por pedido via `notification_url`; não precisa configurar nada extra.
Sem `MP_ACCESS_TOKEN`, o botão "Pagar online" avisa que o pagamento não está ativo e o cliente usa "Pedir pelo WhatsApp".

## Segurança
Preços, frete e estoque são sempre recalculados no servidor (`netlify/functions/create-checkout.js`) a partir de `shared/store.json`; valores vindos do navegador são ignorados. O aviso de pedido pago (`mp-webhook.js`) só dispara depois de consultar o pagamento na API do Mercado Pago.

## Limitações atuais
- O estoque é manual: o campo `stock` não baixa sozinho após a venda.
- Frete é valor fixo, com frete grátis acima de um valor; não calcula por CEP/Correios.
