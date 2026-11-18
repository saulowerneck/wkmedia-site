// No Cloudflare o armazenamento vem dos bindings (D1/KV); este stub só evita carregar o @netlify/blobs.
export const getStore = () => {
  throw new Error("Netlify Blobs indisponível no Cloudflare: configure os bindings DB e IMAGES.");
};
