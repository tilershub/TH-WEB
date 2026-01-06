"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import ServiceMultiSelect, { ServiceOption } from "@/components/ServiceMultiSelect";
import PhotoPicker from "@/components/PhotoPicker";

/**
 * PostTaskPage implements a simplified one‑page workflow for posting a new task
 * on the platform. Instead of multiple complex tiling‑specific steps, users
 * only need to provide a city, desired start date, one or more service
 * categories, an optional title, a free‑text description and up to five
 * supporting photos. The task is then persisted to Supabase and the user
 * is redirected to the task detail page upon success.
 */
export default function PostTaskPage() {
  // Basic form fields
  const [city, setCity] = useState("");
  const [startType, setStartType] = useState<"asap" | "date">("asap");
  const [startDate, setStartDate] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState("");

  // Define the list of available service categories.
  const serviceOptions: ServiceOption[] = [
    { id: "floor_tiling", name: "Floor Tiling" },
    { id: "bathroom_renovation", name: "Bathroom Renovation" },
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "cleaning", name: "Cleaning" },
    { id: "moving", name: "Moving" },
    { id: "other", name: "Other" },
  ];

  // Compute a suggested title when services or city change.
  useEffect(() => {
    if (services.length && city.trim()) {
      const names = services
        .map((id) => serviceOptions.find((o) => o.id === id)?.name || id)
        .join(", ");
      setSuggestion(`${names} – ${city}`);
    } else {
      setSuggestion("");
    }
  }, [services, city]);

  /**
   * Publish the task to Supabase. Validates required fields, creates the task,
   * uploads images, updates cover_image, and redirects to task details.
   */
  const publish = async () => {
    setMsg(null);
    if (!city.trim()) {
      setMsg("Please enter the city where the task is located.");
      return;
    }
    if (startType === "date" && !startDate) {
      setMsg("Please choose a start date or select ASAP.");
      return;
    }
    if (services.length === 0) {
      setMsg("Please select at least one service.");
      return;
    }
    setSaving(true);
    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) {
        setMsg("Please login before posting a task.");
        setSaving(false);
        return;
      }

      const finalTitle = title.trim() || suggestion || "Task";
      let desc = "";
      desc += `City: ${city}\n`;
      desc += `Start: ${startType === "asap" ? "ASAP" : startDate}\n`;
      desc += `Services: ${services
        .map((id) => serviceOptions.find((o) => o.id === id)?.name)
        .filter(Boolean)
        .join(", ")}\n\n`;
      desc += description.trim();

      const insertRes = await supabase
        .from("tasks")
        .insert({
          title: finalTitle,
          description: desc,
          location_text: city.trim(),
          status: "open",
          owner_id: user.id,
          cover_image: null,
        })
        .select("*")
        .single();
      if (insertRes.error) throw new Error(insertRes.error.message);
      const taskId = insertRes.data.id as string;

      let coverImage: string | null = null;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${user.id}/task-images/${taskId}-${i}-${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("task-images")
          .upload(path, file, { upsert: true });
        if (uploadError) throw new Error(uploadError.message);
        if (i === 0) coverImage = path;
      }
      if (coverImage) {
        await supabase.from("tasks").update({ cover_image: coverImage }).eq("id", taskId);
      }
      window.location.href = `/task/${taskId}`;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to publish task.";
      setMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <Page
        title="Post a task"
        description="Share the basics and let taskers bid. You can edit your task later."
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {msg && <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{msg}</div>}

          <div className="card p-4 md:p-6 space-y-4">
            <FormField label="City" hint="Where is the job?" required>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Colombo"
                autoComplete="address-level2"
              />
            </FormField>

            <FormField label="Start" hint="When do you want to start?" required>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                  className="input-field"
                  value={startType}
                  onChange={(e) => setStartType(e.target.value as any)}
                >
                  <option value="asap">ASAP</option>
                  <option value="date">Choose a date</option>
                </select>
                {startType === "date" && (
                  <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                )}
              </div>
            </FormField>

            <FormField label="Services" hint="Pick one or more" required>
              <ServiceMultiSelect services={serviceOptions} selected={services} setSelected={setServices} />
            </FormField>

            <FormField label="Title" hint="Optional">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={suggestion || "Task title"}
              />
              {suggestion && !title ? (
                <div className="text-xs text-neutral-500 mt-1">Suggestion: {suggestion}</div>
              ) : null}
            </FormField>

            <FormField label="Description" hint="What should we know?" required>
              <Textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell taskers what you want done, measurements, materials, access details, etc."
              />
            </FormField>

            <FormField label="Photos" hint="Up to 5">
              <PhotoPicker files={files} setFiles={setFiles} max={5} />
            </FormField>
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-[rgb(var(--bg))] pb-4 pt-3">
            <div className="mx-auto max-w-3xl">
              <Button onClick={publish} loading={saving} fullWidth size="lg">
                Publish task
              </Button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                By publishing you agree to share your task details with taskers.
              </p>
            </div>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}