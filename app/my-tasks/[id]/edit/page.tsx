"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@/components/Page";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "@/lib/types";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

export default function EditTaskPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [task, setTask] = useState<Task | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
      if (error) { setMsg(error.message); return; }
      setTask(data as Task);
    };
    load();
  }, [id]);

  const save = async () => {
    if (!task) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase
      .from("tasks")
      .update({
        title: task.title,
        description: task.description,
        location_text: task.location_text,
        budget_min: task.budget_min,
        budget_max: task.budget_max,
      })
      .eq("id", task.id);
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg("Saved.");
  };

  const del = async () => {
    const ok = confirm("Delete this task? This cannot be undone.");
    if (!ok) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    window.location.href = "/my-tasks";
  };

  return (
    <RequireAuth>
      <Page title="Edit Task">
        {msg && <div className="mb-3 rounded-md bg-neutral-50 p-2 text-sm">{msg}</div>}
        {!task ? (
          <div className="text-sm text-neutral-600">Loading…</div>
        ) : (
          <div className="max-w-2xl rounded-lg border border-neutral-200 p-4">
            <label className="text-sm font-medium">Title</label>
            <Input className="mt-1" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />

            <label className="mt-4 block text-sm font-medium">Description</label>
            <Textarea className="mt-1" rows={6} value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />

            <label className="mt-4 block text-sm font-medium">Location</label>
            <Input className="mt-1" value={task.location_text ?? ""} onChange={(e) => setTask({ ...task, location_text: e.target.value || null })} />

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Budget min</label>
                <Input className="mt-1" value={task.budget_min?.toString() ?? ""} onChange={(e) => setTask({ ...task, budget_min: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <label className="text-sm font-medium">Budget max</label>
                <Input className="mt-1" value={task.budget_max?.toString() ?? ""} onChange={(e) => setTask({ ...task, budget_max: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
              <Button variant="danger" onClick={del} type="button">Delete</Button>
            </div>
          </div>
        )}
      </Page>
    </RequireAuth>
  );
}
