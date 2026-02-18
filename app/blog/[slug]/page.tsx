import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found | TILERSHUB" };
  return { title: `${post.title} | TILERSHUB Blog`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pb-28">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            Blog
          </Link>
        </div>
        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-wide text-taupe-400">{post.category}</span>
            <span className="text-xs text-charcoal-muted">{post.readTime}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-charcoal-muted mb-10 pb-6 border-b border-taupe-100">
            <span>{post.date}</span>
            <span>By Tilershub Team</span>
          </div>
          <div className="space-y-1">
            {post.content.map((paragraph, i) => {
              if (paragraph.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-charcoal mt-10 mb-4">{paragraph.replace("## ", "")}</h2>;
              if (paragraph.startsWith("- ")) return <li key={i} className="text-charcoal-muted ml-4 list-disc leading-relaxed">{paragraph.replace("- ", "")}</li>;
              if (paragraph.includes("**")) {
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (<p key={i} className="text-charcoal-muted leading-relaxed mb-4">{parts.map((part, j) => { if (part.startsWith("**") && part.endsWith("**")) return <strong key={j} className="text-charcoal">{part.replace(/\*\*/g, "")}</strong>; return part; })}</p>);
              }
              return <p key={i} className="text-charcoal-muted leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>
          <div className="mt-12 pt-6 border-t border-taupe-100">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Need help with your project?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors">Get a Free Quote</Link>
              <Link href="/services" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide border border-charcoal/20 text-charcoal rounded-full hover:bg-sand transition-colors">View Our Services</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
