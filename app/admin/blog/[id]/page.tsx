"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getBlogPost, updateBlogPost, type BlogPost } from "@/lib/admin";

const CATEGORIES = ["Tips", "Trends", "Pricing", "Guides", "For Tilers"];

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Tips",
    read_time: "5 min read",
    is_published: false,
  });

  useEffect(() => {
    async function loadPost() {
      const { data, error } = await getBlogPost(params.id as string);
      if (error || !data) {
        router.push("/admin/blog");
        return;
      }
      setForm(data);
      setLoading(false);
    }
    loadPost();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await updateBlogPost(params.id as string, form);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy">Edit Blog Post</h1>
          <p className="text-gray-600">Update article content</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
            <input
              type="text"
              value={form.read_time}
              onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="5 min read"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt || ""}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Brief description for previews..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={15}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">Supports Markdown formatting</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/blog"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
