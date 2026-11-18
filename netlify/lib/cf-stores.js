// Armazenamento da loja no Cloudflare: D1 (catálogo) e KV (fotos enviadas pelo painel),
// com a mesma interface mínima que o código usa do Netlify Blobs.
export const cfCatalogStore = (db) => ({
  async get(key, { type } = {}) {
    const row = await db.prepare("SELECT v FROM kv WHERE k = ?1").bind(key).first();
    if (!row) return null;
    return type === "json" ? JSON.parse(row.v) : row.v;
  },
  async setJSON(key, value) {
    await db
      .prepare("INSERT INTO kv (k, v) VALUES (?1, ?2) ON CONFLICT(k) DO UPDATE SET v = excluded.v")
      .bind(key, JSON.stringify(value))
      .run();
  },
});

export const cfImageStore = (kv) => ({
  async set(key, buf, { metadata } = {}) {
    await kv.put(key, buf, { metadata });
  },
  async getWithMetadata(key) {
    const r = await kv.getWithMetadata(key, { type: "arrayBuffer" });
    if (!r || !r.value) return null;
    return { data: r.value, metadata: r.metadata };
  },
});
