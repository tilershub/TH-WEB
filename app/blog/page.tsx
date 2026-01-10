import Link from "next/link";
import { Page } from "@/components/Page";
import AdminEditLink from "@/components/AdminEditLink";
import { getBlogPosts } from "@/lib/content";

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Tips: "bg-blue-100 text-blue-700",
    Trends: "bg-purple-100 text-purple-700",
    Pricing: "bg-green-100 text-green-700",
    Guides: "bg-orange-100 text-orange-700",
    "For Tilers": "bg-primary/10 text-primary",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    Tips: "උපදෙස්",
    Trends: "ප්‍රවණතා",
    Pricing: "මිල ගණන්",
    Guides: "මාර්ගෝපදේශ",
    "For Tilers": "කාර්යකරුවන් සඳහා",
  };
  return labels[category] || category;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <Page title="බ්ලොග්">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">බ්ලොග්</h1>
            <p className="text-gray-600 text-sm">නිවාස හිමියන් සහ කාර්යකරුවන් සඳහා උපදෙස්, මාර්ගෝපදේශ සහ ප්‍රවණතා</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-2 rounded-full bg-navy text-white text-sm font-medium whitespace-nowrap">
            සියලු ලිපි
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            උපදෙස්
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            ප්‍රවණතා
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            මාර්ගෝපදේශ
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            කාර්යකරුවන් සඳහා
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="card hover:shadow-card-hover transition-shadow h-full">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="font-semibold text-navy mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
              <div className="flex items-center justify-between px-4 pb-4">
                <span className="text-xs text-gray-500">{post.date}</span>
                <div className="flex items-center gap-3">
                  <Link href={`/blog/${post.slug}`} className="text-primary text-sm font-medium">
                    තවත් කියවන්න
                  </Link>
                  {post.isFromDb && (
                    <AdminEditLink href={`/admin/blog/${post.id}`}>
                      සංස්කරණය
                    </AdminEditLink>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-navy mb-2">පියවරෙන් පියවර මාර්ගෝපදේශය අවශ්‍යද?</h3>
              <p className="text-sm text-gray-600">විස්තරාත්මක උපදෙස් සඳහා අපගේ කෙසේ කරන්න මාර්ගෝපදේශ බලන්න.</p>
            </div>
            <Link
              href="/guides"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
            >
              මාර්ගෝපදේශ බලන්න
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
