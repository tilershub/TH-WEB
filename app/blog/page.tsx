import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Interior design tips, renovation guides, and trends from TILERSHUB.",
};

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Bathrooms: "bg-sky-100 text-sky-700",
    Kitchen: "bg-amber-100 text-amber-700",
    Flooring: "bg-stone-100 text-stone-700",
    Ceiling: "bg-violet-100 text-violet-700",
    "Glass Work": "bg-blue-100 text-blue-700",
    Electrical: "bg-yellow-100 text-yellow-700",
    Plumbing: "bg-cyan-100 text-cyan-700",
    Waterproofing: "bg-emerald-100 text-emerald-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <section className="bg-navy text-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            Tips, guides, and trends for your interior design and renovation projects.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="font-semibold text-navy text-lg mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-primary text-sm font-medium">Read More</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10 mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-navy mb-2">Need step-by-step guidance?</h3>
                <p className="text-sm text-gray-600">Check out our detailed how-to guides for your renovation projects.</p>
              </div>
              <Link href="/guides" className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors whitespace-nowrap">
                View Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
