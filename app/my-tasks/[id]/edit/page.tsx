"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@/components/Page";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import ServiceMultiSelect from "@/components/ServiceMultiSelect";
import { SERVICES } from "@/lib/services";

export default function EditTaskPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [task, setTask] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Load task once on mount
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
      if (error) { setMsg(error.message); return; }
      // Default missing fields for controlled inputs
      const t: any = {
        ...data,
        city: (data as any).city ?? "",
        start_date_type: (data as any).start_date_type ?? "asap",
        start_date: (data as any).start_date ?? "",
        service_ids: (data as any).service_ids ?? [],
      };
      setTask(t);
    };
    load();
  }, [id]);

  // Save updated task
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
        city: task.city || null,
        start_date_type: task.start_date_type || null,
        start_date: task.start_date || null,
        service_ids: task.service_ids && task.service_ids.length > 0 ? task.service_ids : null,
      })
      .eq("id", task.id);
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg("Saved.");
  };

  // Delete the task (unchanged from original)
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
            {/* Title */}
            <label className="text-sm font-medium">Title</label>
            <Input
              className="mt-1"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />

            {/* Description */}
            <label className="mt-4 block text-sm font-medium">Description</label>
            <Textarea
              className="mt-1"
              rows={6}
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />

            {/* City */}
            <label className="mt-4 block text-sm font-medium">City</label>
            <Input
              className="mt-1"
              value={task.city ?? ""}
              onChange={(e) => setTask({ ...task, city: e.target.value })}
            />

            {/* Start date type */}
            <label className="mt-4 block text-sm font-medium">Start Date</label>
            <div className="mt-1 flex items-center gap-4 text-sm">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="startType"
                  className="mr-2"
                  checked={task.start_date_type === "asap"}
                  onChange={() => setTask({ ...task, start_date_type: "asap", start_date: "" })}
                />
                ASAP
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="startType"
                  className="mr-2"
                  checked={task.start_date_type === "date"}
                  onChange={() => setTask({ ...task, start_date_type: "date" })}
                />
                Specific Date
              </label>
            </div>
            {task.start_date_type === "date" && (
              <input
                type="date"
                className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                value={task.start_date ?? ""}
                onChange={(e) => setTask({ ...task, start_date: e.target.value })}
              />
            )}

            {/* Service selection */}
            <label className="mt-4 block text-sm font-medium">Services</label>
            <ServiceMultiSelect
              services={SERVICES.map((svc) => ({ id: svc.key, name: svc.label }))}
              selected={task.service_ids ?? []}
              setSelected={(sel) => setTask({ ...task, service_ids: sel })}
            />

            {/* Legacy fields: location text and budgets */}
            <label className="mt-4 block text-sm font-medium">Location (Legacy)</label>
            <Input
              className="mt-1"
              value={task.location_text ?? ""}
              onChange={(e) => setTask({ ...task, location_text: e.target.value || null })}
            />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Budget min</label>
                <Input
                  className="mt-1"
                  value={task.budget_min?.toString() ?? ""}
                  onChange={(e) => setTask({ ...task, budget_min: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget max</label>
                <Input
                  className="mt-1"
                  value={task.budget_max?.toString() ?? ""}
                  onChange={(e) => setTask({ ...task, budget_max: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex items-center gap-2">
              <Button onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </Button>
              <Button variant="danger" onClick={del} type="button">
                Delete
              </Button>
            </div>
          </div>
        )}
      </Page>
    </RequireAuth>
  );
}