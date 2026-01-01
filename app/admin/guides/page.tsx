"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGuides, deleteGuide, updateGuide, type Guide } from "@/lib/admin";

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadGuides = async () => {
    setLoading(true);
    const { data, count } = await getAllGuides(page, 20, true);
    if (data) {
      setGuides(data);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuides();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;
    const { error } = await deleteGuide(id);
    if (!error) {
      setGuides((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleTogglePublish = async (guide: Guide) => {
    const { error } = await updateGuide(guide.id, { is_published: !guide.is_published });
    if (!error) {
      setGuides((prev) =>
        prev.map((g) =>
          g.id === guide.id ? { ...g, is_published: !g.is_published } : g
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">How-To Guides</h1>
          <p className="text-gray-600">Create and manage step-by-step guides</p>
        </div>
        <Link
          href="/admin/guides/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Guide
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Steps</th>
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
              ) : guides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No guides yet. Create your first guide!
                  </td>
                </tr>
              ) : (
                guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-navy">{guide.title}</p>
                        <p className="text-sm text-gray-500">/guides/{guide.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {guide.steps?.length || 0} steps
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(guide)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guide.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {guide.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(guide.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/guides/${guide.id}`}
                          className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(guide.id)}
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

        {guides.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {guides.length} of {totalCount} guides
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
                disabled={guides.length < 20}
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
