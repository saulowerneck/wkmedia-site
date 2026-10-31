# WK Shop — como operar a loja

A loja fica em `/loja`. O catálogo (produtos, preços, fotos, frete, parcelas) é editado no **painel**, sem mexer em código.

## Painel (`/admin`)
Acesse `wkmedia.com.br/admin` e entre com a senha (variável `ADMIN_PASSWORD` no Netlify).
- **Produtos**: busca, filtro por categoria/situação, preço editável direto na lista, editar/duplicar/ocultar/excluir, novo produto.
- **Fotos**: envie JPG/PNG/WebP no editor do produto (reduzidas automaticamente para 1200px); a primeira é a principal; dá para reordenar e remover.
- **Ações em massa**: marque vários produtos e defina um preço, reajuste por % ou mostre/oculte.
- **Configurações**: WhatsApp, parcelas, frete (valor fixo e frete grátis a partir de), retirada e o aviso de "sob encomenda".
- **Salvar alterações**: nada vale para os clientes antes de clicar. Se outro aparelho salvou antes, o painel avisa e pede para recarregar.
- **Backup / Importar backup**: baixa/restaura o catálogo em JSON.

Os dados ficam no Netlify Blobs (`wk-shop`, fotos em `wk-shop-images`). Enquanto nada for salvo no painel, a loja usa o catálogo inicial `shared/store.json` (69 produtos Victoria's Secret, R$ 89, sob encomenda).

## Variáveis no Netlify (Site configuration → Environment variables)
- `ADMIN_PASSWORD` — senha do painel (obrigatória para usar `/admin`; sem ela o painel informa que não está configurado). Opcional: `ADMIN_TOKEN_SECRET`.
- `MP_ACCESS_TOKEN` — Access Token de **produção** do Mercado Pago (APP_USR-...)
- `CALLMEBOT_PHONE` / `CALLMEBOT_APIKEY` — aviso de pedido pago no WhatsApp
- `SITE_URL` — opcional (padrão https://wkmedia.com.br)

## Sob encomenda x estoque
Produto "sob encomenda" não usa estoque (limite de 20 por pedido); o prazo é o texto em Configurações. Produto com estoque: campo `stock` é manual e não baixa sozinho após a venda; `0` = esgotado.

## Segurança
Preços, frete e estoque são sempre recalculados no servidor (`create-checkout.js`) a partir do catálogo salvo; valores do navegador são ignorados. As rotas do painel exigem token assinado (12 h). O aviso de pedido pago (`mp-webhook.js`) só dispara depois de consultar o pagamento na API do Mercado Pago.

## Limitações atuais
- Frete é valor fixo, com frete grátis acima de um valor; não calcula por CEP/Correios.
- O Mercado Pago está usando a API "Preferences"; migrar para "Orders" no futuro.
