"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/lib/types";
import Link from "next/link";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const load = async () => {
    setMsg(null);
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) return;

    const { data, error } = await supabase.from("tasks").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    if (error) { setMsg(error.message); return; }
    setTasks((data ?? []) as Task[]);
  };

  useEffect(() => { load(); }, []);

  const activeTasks = tasks.filter(t => t.status === "open");
  const pastTasks = tasks.filter(t => t.status !== "open");

  const displayedTasks = activeTab === "active" ? activeTasks : pastTasks;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 pb-28">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/tasks" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-navy">My Jobs</h1>
          </div>

          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "active" ? "text-navy" : "text-gray-500"
              }`}
            >
              Active
              {activeTab === "active" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "past" ? "text-navy" : "text-gray-500"
              }`}
            >
              Past
              {activeTab === "past" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {msg && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">{msg}</div>}

          <div className="space-y-4">
            {displayedTasks.map((t) => (
              <Link key={t.id} href={`/task/${t.id}`} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy mb-1 truncate">{t.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                    {t.location_text && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="truncate">{t.location_text}</span>
                      </div>
                    )}
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      t.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {t.status === "open" ? "Active" : "Closed"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {displayedTasks.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-gray-600">No {activeTab} jobs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
