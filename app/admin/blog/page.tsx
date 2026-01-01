"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBlogPosts, deleteBlogPost, updateBlogPost, type BlogPost } from "@/lib/admin";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadPosts = async () => {
    setLoading(true);
    const { data, count } = await getAllBlogPosts(page, 20, true);
    if (data) {
      setPosts(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await deleteBlogPost(id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const { error } = await updateBlogPost(post.id, { is_published: !post.is_published });
    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_published: !p.is_published } : p
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Blog Posts</h1>
          <p className="text-gray-600">Create and manage blog articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Created</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-navy">{post.title}</p>
                        <p className="text-sm text-gray-500">/blog/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {posts.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {posts.length} of {totalCount} posts
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={posts.length < 20}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
