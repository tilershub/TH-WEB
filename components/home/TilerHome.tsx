"use client";

import { useEffect, useState, memo } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import BlogCard from "./BlogCard";
import Link from "next/link";
import { SkeletonCard } from "@/components/Skeleton";

const BLOG_POSTS = [
  { title: "How to Win More Bids", excerpt: "Tips and strategies to stand out from other tilers and win more projects.", category: "Business", href: "/blog/essential-tiling-tools" },
  { title: "Pricing Your Services Right", excerpt: "Learn how to calculate fair rates that attract clients and grow your business.", category: "Pricing", href: "/blog/tiling-cost-guide" },
  { title: "Building Your Portfolio", excerpt: "Showcase your best work to attract more homeowners.", category: "Growth", href: "/blog/floor-preparation" },
];

const MemoizedTaskCard = memo(TaskCard);
const MemoizedBlogCard = memo(BlogCard);

export default function TilerHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(10);

        if (!cancelled && !error && data) {
          setTasks(data as Task[]);
        }
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
      if (!cancelled) setLoading(false);
    };
    
    loadTasks();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pb-8">
      <section className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-navy">Available Tasks</h2>
          <Link href="/tasks" className="text-sm text-primary font-medium">See All</Link>
        </div>

        <div className="space-y-3">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
          {!loading && tasks.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-sm">No open tasks at the moment</p>
              <p className="text-gray-400 text-xs mt-1">Check back later for new opportunities</p>
            </div>
          )}
          {!loading && tasks.map((task) => (
            <MemoizedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-navy">Blog for Tilers</h2>
          <Link href="/blog" className="text-sm text-primary font-medium">See All</Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {BLOG_POSTS.map((post) => (
              <MemoizedBlogCard
                key={post.title}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                href={post.href}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
