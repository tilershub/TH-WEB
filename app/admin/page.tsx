"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/lib/admin";

type Stats = {
  totalUsers: number;
  totalTilers: number;
  totalTasks: number;
  totalBlogPosts: number;
  totalGuides: number;
};

function StatCard({ title, value, icon, href, color }: { title: string; value: number; icon: React.ReactNode; href: string; color: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-navy mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getAdminStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Tilers Hub content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          href="/admin/users"
          color="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Tilers"
          value={stats?.totalTilers || 0}
          href="/admin/users?role=tiler"
          color="bg-green-100"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          href="/admin/tasks"
          color="bg-orange-100"
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Blog Posts"
          value={stats?.totalBlogPosts || 0}
          href="/admin/blog"
          color="bg-purple-100"
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          title="Guides"
          value={stats?.totalGuides || 0}
          href="/admin/guides"
          color="bg-teal-100"
          icon={
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-navy mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-navy">Create Blog Post</p>
                <p className="text-sm text-gray-500">Write a new article</p>
              </div>
            </Link>
            <Link
              href="/admin/guides/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-navy">Create Guide</p>
                <p className="text-sm text-gray-500">Add a step-by-step guide</p>
              </div>
            </Link>
            <Link
              href="/admin/users?verified=false&role=tiler"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-navy">Verify Tilers</p>
                <p className="text-sm text-gray-500">Review pending verifications</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-navy mb-4">Getting Started</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <p>Welcome to the Tilers Hub Admin Dashboard. Here you can:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Manage user profiles and verify tilers</li>
              <li>Create and edit blog posts</li>
              <li>Create and manage how-to guides</li>
              <li>View and moderate tasks</li>
            </ul>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium">Note</p>
              <p className="text-amber-700 mt-1">
                Make sure to run the database migration to create the blog_posts and guides tables. Check the migration files in supabase/migrations folder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
