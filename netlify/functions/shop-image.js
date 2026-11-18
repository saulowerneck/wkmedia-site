// GET ?key=<chave> -> bytes da imagem enviada pelo painel (cache longo; a chave é única).
import { imageStore } from "../lib/catalog.js";

export default async (req) => {
  const key = new URL(req.url).searchParams.get("key") || "";

  // Fotos dos produtos automáticos: vêm do GitHub (client/public/loja/<arquivo>), então produto novo não precisa de deploy.
  if (key.startsWith("gh-")) {
    const file = key.slice(3);
    if (!/^[a-z0-9][a-z0-9_-]*\.(jpg|jpeg|png|webp)$/.test(file)) return new Response("not found", { status: 404 });
    const base = process.env.AUTO_IMAGES_BASE || "https://raw.githubusercontent.com/saulowerneck/wkmedia-site/main/client/public/loja";
    const up = await fetch(`${base}/${file}`, { signal: AbortSignal.timeout(5000) }).catch(() => null);
    if (!up || !up.ok) return new Response("not found", { status: 404 });
    const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
    return new Response(await up.arrayBuffer(), {
      status: 200,
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" },
    });
  }

  if (!/^[\w.\-]{6,80}$/.test(key)) return new Response("not found", { status: 404 });
  const res = await imageStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!res) return new Response("not found", { status: 404 });
  return new Response(res.data, {
    status: 200,
    headers: {
      "Content-Type": res.metadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
