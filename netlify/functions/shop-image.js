// GET ?key=<chave> -> bytes da imagem enviada pelo painel (cache longo; a chave é única).
import { imageStore } from "../lib/catalog.js";

export default async (req) => {
  const key = new URL(req.url).searchParams.get("key") || "";
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
