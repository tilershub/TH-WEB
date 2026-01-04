"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import TaskCard from "@/components/TaskCard";

type Ad = {
  id: string;
  title: string;
  subtitle?: string;
  cta?: string;
  href?: string;
};

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  location_text: string | null;
  status: "open" | "awarded" | "closed";
  created_at: string;
  budget_min?: number | null;
  budget_max?: number | null;
};

type TaskPhotoRow = {
  task_id: string;
  storage_path: string;
  created_at: string;
};

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function HeroAdCarousel({ ads }: { ads: Ad[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!ads.length) return;
    const t = setInterval(() => setIndex((prev) => (prev + 1) % ads.length), 3500);
    return () => clearInterval(t);
  }, [ads.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-ad-card]");
    if (!card) return;
    const cardWidth = card.offsetWidth;
    el.scrollTo({ left: index * (cardWidth + 12), behavior: "smooth" });
  }, [index]);

  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Sponsored</div>
        <div className="flex gap-1">
          {ads.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-black" : "bg-neutral-300"}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to ad ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-3 flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {ads.map((ad) => (
          <div
            key={ad.id}
            data-ad-card
            className="min-w-[85%] sm:min-w-[60%] rounded-2xl border bg-gradient-to-br from-neutral-900 to-neutral-700 text-white p-5"
          >
            <div className="text-lg font-bold">{ad.title}</div>
            {ad.subtitle && <div className="mt-1 text-sm text-white/80">{ad.subtitle}</div>}

            <div className="mt-4">
              {ad.href ? (
                <Link
                  href={ad.href}
                  className="inline-flex items-center rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold"
                >
                  {ad.cta ?? "Learn more"}
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-sm">
                  {ad.cta ?? "Your ad here"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs text-neutral-500">Auto-sliding ads • Swipe to browse</div>
    </div>
  );
}

export default function TasksHomePage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "myarea">("all");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg(null);

    // 1) load tasks
    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (taskError) {
      setMsg(taskError.message);
      setTasks([]);
      setThumbs({});
      setLoading(false);
      return;
    }

    const rows = (taskData ?? []) as TaskRow[];
    setTasks(rows);

    // 2) load first photo per task (simple approach: fetch all photos for these tasks, then pick earliest)
    const taskIds = rows.map((t) => t.id);
    if (taskIds.length === 0) {
      setThumbs({});
      setLoading(false);
      return;
    }

    const { data: photoData, error: photoError } = await supabase
      .from("task_photos")
      .select("task_id, storage_path, created_at")
      .in("task_id", taskIds)
      .order("created_at", { ascending: true });

    if (photoError) {
      // If RLS blocks task_photos, thumbnails will be empty but page still works
      setThumbs({});
      setLoading(false);
      return;
    }

    const photos = (photoData ?? []) as TaskPhotoRow[];

    // 3) build map: task_id -> publicUrl
    const map: Record<string, string | null> = {};
    for (const ph of photos) {
      if (map[ph.task_id]) continue; // keep first only
      const { data } = supabase.storage.from("task-photos").getPublicUrl(ph.storage_path);
      map[ph.task_id] = data.publicUrl ?? null;
    }

    setThumbs(map);
    setLoading(false);
  };

  useEffect(() => {
    load();

    const ch = supabase
      .channel("tasks-home-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTasks = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((t) => {
      const title = String(t.title ?? "").toLowerCase();
      const loc = String(t.location_text ?? "").toLowerCase();
      const desc = String(t.description ?? "").toLowerCase();
      return title.includes(query) || loc.includes(query) || desc.includes(query);
    });
  }, [tasks, q]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy">Welcome, John</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tiling jobs..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "all" ? "text-navy" : "text-gray-500"
            }`}
          >
            All Tasks
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("myarea")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === "myarea" ? "text-navy" : "text-gray-500"
            }`}
          >
            My Area
            {activeTab === "myarea" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-navy mb-4">Recent Tiling Jobs</h2>

          {msg && <div className="text-sm text-red-600 mb-4">{msg}</div>}
          {loading && <div className="text-sm text-gray-600">Loading tasks...</div>}

          {!loading && filteredTasks.length === 0 && (
            <div className="card p-6 text-center text-gray-600">No tasks found.</div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="space-y-4">
              {filteredTasks.map((t) => (
                <TaskCard key={t.id} task={t} thumbUrl={thumbs[t.id] ?? null} />
              ))}
            </div>
          )}
        </div>

        <Link href="/post-task" className="block">
          <div className="bg-primary hover:bg-primary-dark transition-colors rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Start Your Project: Post a Task</h3>
            <p className="text-sm text-white/90">to Get Quotes to Professional Tilers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}