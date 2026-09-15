/* Brutalist Luxury — Blog post detail */
import { useEffect } from "react";
import { useParams, Link, Redirect } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, type ContentBlock } from "@/data/blogPosts";

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-display)" }}>
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="space-y-3 my-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/60 leading-relaxed">
              <span className="text-[var(--color-electric)] mt-1.5 shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-[var(--color-electric)] pl-6 my-8 text-xl text-white/80 italic" style={{ fontFamily: "var(--font-display)" }}>
          {block.text}
        </blockquote>
      );
    case "p":
    default:
      return <p className="text-white/60 leading-relaxed mb-5 text-lg">{block.text}</p>;
  }
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = getPostBySlug(params.slug || "");

  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.title} | Blog WK Media`;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const [, attrName, attrValue] = selector.match(/\[(.+)="(.+)"\]/) || [];
        if (attrName && attrValue) el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", post.excerpt);
    setMeta('meta[property="og:title"]', "content", post.title);
    setMeta('meta[property="og:description"]', "content", post.excerpt);

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.id = "blog-post-ld";
    ldScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: "WK Media" },
      publisher: { "@type": "Organization", name: "WK Media" },
    });
    document.head.appendChild(ldScript);

    return () => {
      document.title = prevTitle;
      document.getElementById("blog-post-ld")?.remove();
    };
  }, [post]);

  if (!post) {
    return <Redirect to="/blog" />;
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--color-electric)] transition-colors mb-8">
            <ArrowLeft size={16} />
            Voltar ao blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[var(--color-electric)] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              {post.category}
            </span>
            <span className="text-white/20 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              {formatDate(post.date)} · {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h1>

          <article>
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>

          <div className="mt-16 pt-8 border-t border-white/5">
            <a href="#contato" className="btn-electric">
              Solicitar Orçamento
            </a>
          </div>

          {otherPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/5">
              <h3 className="text-sm text-white/40 tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "var(--font-mono)" }}>
                Leia também
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block border border-white/5 hover:border-[var(--color-electric)]/30 p-6 transition-colors duration-300"
                  >
                    <h4 className="text-lg font-bold text-white group-hover:text-[var(--color-electric)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                      {p.title}
                    </h4>
                    <p className="text-white/40 text-sm mt-2 line-clamp-2">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
