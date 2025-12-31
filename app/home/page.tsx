"use client";

import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) setTasks(data as Task[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Page title="Latest Tasks">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">Browse posted tasks and submit a bid.</p>
        <a className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-neutral-800" href="/post-task">
          Post a Task
        </a>
      </div>

      <div className="mt-5 grid gap-3">
        {loading && <div className="text-sm text-neutral-600">Loading…</div>}
        {!loading && tasks.length === 0 && <div className="text-sm text-neutral-600">No tasks yet.</div>}
        {tasks.map((t) => <TaskCard key={t.id} task={t} />)}
      </div>
    </Page>
  );
}
