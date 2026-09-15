/* Brutalist Luxury — Blog listing */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-[var(--color-electric)]" />
            <span className="section-num">Blog</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Conteúdo sobre <span className="text-[var(--color-electric)]">marketing e vídeo</span>
          </h1>
          <p className="text-white/40 text-lg mb-16 max-w-2xl">
            Guias práticos, estratégia e bastidores de produção — escrito pela equipe que faz esse trabalho todo dia em
            Sorocaba.
          </p>

          <div className="space-y-px bg-white/5">
            {BLOG_POSTS.slice()
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-black hover:bg-[#0A0A0A] transition-colors duration-300 p-8"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[var(--color-electric)] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                      {post.category}
                    </span>
                    <span className="text-white/20 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                      {formatDate(post.date)} · {post.readTime}
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[var(--color-electric)] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed max-w-2xl">{post.excerpt}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/40 group-hover:text-[var(--color-electric)] transition-colors duration-300">
                    Ler artigo <ArrowUpRight size={16} />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
