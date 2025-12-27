"use client";

import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

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

  const closeTask = async (id: string) => {
    const ok = confirm("Close this task? (It will disappear from the public feed)");
    if (!ok) return;
    const { error } = await supabase.from("tasks").update({ status: "closed" }).eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <RequireAuth>
      <Page title="My Tasks">
        {msg && <div className="mb-3 rounded-md bg-neutral-50 p-2 text-sm">{msg}</div>}
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div key={t.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-neutral-600">Status: {t.status}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="text-sm underline" href={`/task/${t.id}`}>View</Link>
                  <Link className="text-sm underline" href={`/my-tasks/${t.id}/edit`}>Edit</Link>
                  <Button variant="secondary" onClick={() => closeTask(t.id)}>Close</Button>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <div className="text-sm text-neutral-600">No tasks yet.</div>}
        </div>
      </Page>
    </RequireAuth>
  );
}
