import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Interior design tips, renovation guides, and trends from TILERSHUB.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">Insights</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">Blog</h1>
          <p className="mt-4 text-charcoal-muted max-w-lg mx-auto leading-relaxed">Tips, guides, and trends for your interior design and renovation projects.</p>
        </div>
      </section>
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="rounded-2xl border border-taupe-100/60 bg-cream overflow-hidden">
                  <div className="h-40 bg-taupe-100 flex items-center justify-center">
                    <span className="text-taupe-300 text-sm">Photo</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium tracking-wide text-taupe-400">{post.category}</span>
                      <span className="text-xs text-charcoal-muted">{post.readTime}</span>
                    </div>
                    <h2 className="font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-sage-dark transition-colors">{post.title}</h2>
                    <p className="text-sm text-charcoal-muted line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-charcoal-muted">{post.date}</span>
                      <span className="text-xs font-medium tracking-wide text-taupe-400 group-hover:text-charcoal transition-colors">Read &rarr;</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="rounded-2xl bg-sand/50 p-6 mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-charcoal mb-1">Need step-by-step guidance?</h3>
                <p className="text-sm text-charcoal-muted">Check out our detailed how-to guides for your renovation projects.</p>
              </div>
              <Link href="/guides" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors whitespace-nowrap">View Guides</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
