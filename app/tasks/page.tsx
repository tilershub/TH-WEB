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

function InlineAdSpace() {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Advertising Space</div>
          <div className="mt-1 text-xs text-neutral-600">
            Promote tile shops, tools, leveling systems, adhesives, services.
          </div>
        </div>
        <span className="text-[10px] rounded-full border px-2 py-1 text-neutral-600">
          Sponsored
        </span>
      </div>

      <div className="mt-3 h-20 rounded-xl bg-neutral-100 grid place-items-center text-sm text-neutral-600">
        728×90 / 320×100 Banner Area
      </div>
    </div>
  );
}

export default function TasksHomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [q, setQ] = useState("");

  const heroAds: Ad[] = useMemo(
    () => [
      { id: "ad1", title: "Tile Leveling Clips • Best Price", subtitle: "Islandwide delivery • COD available", cta: "Shop Now", href: "/shop" },
      { id: "ad2", title: "Premium Bathroom Packages", subtitle: "Rocell • Swiss • Luxury finish", cta: "View Packages", href: "/packages" },
      { id: "ad3", title: "Promote Your Tile Shop Here", subtitle: "Get calls from homeowners daily", cta: "Advertise", href: "/advertise" },
    ],
    []
  );

  const load = async () => {
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      setTasks([]);
    } else {
      setTasks(data ?? []);
    }

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

  const blocks = useMemo(() => chunk(filteredTasks, 5), [filteredTasks]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* ✅ Search Bar (replaces title + post button) */}
      <div className="sticky top-0 z-40 bg-white pt-2 pb-3">
        <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2">
          <span className="text-neutral-500">🔎</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks (Gampaha, bathroom, floor, 600×600...)"
            className="w-full bg-transparent outline-none text-sm"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="text-xs rounded-full border px-2 py-1 text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Hero ads */}
      <HeroAdCarousel ads={heroAds} />

      {msg && <div className="text-sm text-red-600">{msg}</div>}
      {loading && <div className="text-sm text-neutral-600">Loading tasks…</div>}

      {!loading && filteredTasks.length === 0 && (
        <div className="rounded-2xl border bg-white p-4 text-sm text-neutral-600">
          No tasks found.
        </div>
      )}

      {/* Repeating pattern */}
      {!loading && filteredTasks.length > 0 && (
        <div className="space-y-5">
          {blocks.map((group, i) => (
            <div key={i} className="space-y-5">
              <div className="grid gap-3">
                {group.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>

              {/* ad after every 10 tasks (5+5) */}
              {i % 2 === 1 && <InlineAdSpace />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}