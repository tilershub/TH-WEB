import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found | TILERSHUB" };
  return {
    title: `${post.title} | TILERSHUB Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const categoryColors: Record<string, string> = {
    Bathrooms: "bg-sky-100 text-sky-700",
    Kitchen: "bg-amber-100 text-amber-700",
    Flooring: "bg-emerald-100 text-emerald-700",
    Ceiling: "bg-violet-100 text-violet-700",
    Waterproofing: "bg-blue-100 text-blue-700",
    "Glass Work": "bg-cyan-100 text-cyan-700",
    Electrical: "bg-yellow-100 text-yellow-700",
    Plumbing: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-100">
            <span>{post.date}</span>
            <span>By TILERSHUB Team</span>
          </div>

          <div className="prose prose-gray max-w-none">
            {post.content.map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold text-navy mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <li key={i} className="text-gray-700 ml-4 list-disc">
                    {paragraph.replace("- ", "")}
                  </li>
                );
              }
              if (paragraph.includes("**")) {
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {parts.map((part, j) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-navy mb-4">Need help with your project?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-medium py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
