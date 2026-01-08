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
import { FormField } from "@/components/FormField";
import ServiceMultiSelect from "@/components/ServiceMultiSelect";
import { SERVICES } from "@/lib/services";

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
      // When loading a task, ensure new optional fields are defined so inputs are controlled.
      // Some legacy tasks may not have city, start_date_type, start_date or service_ids.
      const base = data as Task;
      const t: Task = {
        ...base,
        title: base.title ?? "",
        description: base.description ?? "",
        city: base.city ?? "",
        start_date_type: base.start_date_type ?? "asap",
        start_date: base.start_date ?? "",
        service_ids: base.service_ids ?? [],
      };
      setTask(t);
    };
    load();
  }, [id]);

  const save = async () => {
    if (!task) return;
    setBusy(true);
    setMsg(null);
    const normalizedTitle = task.title?.trim() ?? "";
    const { error } = await supabase
      .from("tasks")
      .update({
        title: normalizedTitle || null,
        description: task.description ?? "",
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

  const del = async () => {
    const ok = confirm("Delete this task? This cannot be undone.");
    if (!ok) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    window.location.href = "/my-tasks";
  };

  return (
    <RequireAuth>
      <Page title="Edit task" description="Update your task details. Changes are visible to taskers.">
        {msg && <div className="mb-3 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-800">{msg}</div>}
        {!task ? (
          <div className="text-sm text-neutral-600">Loading…</div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <div className="card p-4 md:p-6 space-y-4">
              <FormField label="Title" hint="Optional">
                <Input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              </FormField>

              <FormField label="Description" required>
                <Textarea
                  rows={6}
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                />
              </FormField>

              <FormField label="City" required>
                <Input value={task.city ?? ""} onChange={(e) => setTask({ ...task, city: e.target.value })} />
              </FormField>

              <FormField label="Start" hint="ASAP or choose a date" required>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <select
                    className="input-field"
                    value={task.start_date_type}
                    onChange={(e) =>
                      setTask({
                        ...task,
                        start_date_type: e.target.value,
                        start_date: e.target.value === "asap" ? "" : task.start_date,
                      })
                    }
                  >
                    <option value="asap">ASAP</option>
                    <option value="date">Choose a date</option>
                  </select>
                  {task.start_date_type === "date" && (
                    <input
                      type="date"
                      className="input-field"
                      value={task.start_date ?? ""}
                      onChange={(e) => setTask({ ...task, start_date: e.target.value })}
                    />
                  )}
                </div>
              </FormField>

              <FormField label="Services" hint="Pick one or more">
                <ServiceMultiSelect
                  services={SERVICES.map((svc) => ({ id: svc.key, name: svc.label }))}
                  selected={task.service_ids ?? []}
                  setSelected={(sel) => setTask({ ...task, service_ids: sel })}
                />
              </FormField>

              {/* Legacy fields */}
              <details className="rounded-xl border border-gray-200 p-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-900">Advanced (budget & legacy fields)</summary>
                <div className="mt-3 space-y-3">
                  <FormField label="Location text">
                    <Input
                      value={task.location_text ?? ""}
                      onChange={(e) => setTask({ ...task, location_text: e.target.value || null })}
                    />
                  </FormField>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Budget min">
                      <Input
                        value={task.budget_min?.toString() ?? ""}
                        onChange={(e) =>
                          setTask({ ...task, budget_min: e.target.value ? Number(e.target.value) : null })
                        }
                      />
                    </FormField>
                    <FormField label="Budget max">
                      <Input
                        value={task.budget_max?.toString() ?? ""}
                        onChange={(e) =>
                          setTask({ ...task, budget_max: e.target.value ? Number(e.target.value) : null })
                        }
                      />
                    </FormField>
                  </div>
                </div>
              </details>

            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-[rgb(var(--bg))] pb-4 pt-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={save} loading={busy} fullWidth size="lg">
                  Save changes
                </Button>
                <Button variant="danger" onClick={del} type="button" fullWidth size="lg">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Page>
    </RequireAuth>
  );
}
