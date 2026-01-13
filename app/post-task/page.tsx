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
    { id: "floor_tiling", name: "බිම් ටයිල් කිරීම" },
    { id: "bathroom_renovation", name: "නානකාමර නවීකරණය" },
    { id: "plumbing", name: "ජල සැපයුම්" },
    { id: "electrical", name: "විදුලි වැඩ" },
    { id: "cleaning", name: "පිරිසිදු කිරීම" },
    { id: "moving", name: "ස්ථානාන්ත කිරීම" },
    { id: "other", name: "වෙනත්" },
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
      setMsg("කරුණාකර කාර්යය සිදු වන නගරය ඇතුළත් කරන්න.");
      return;
    }
    if (startType === "date" && !startDate) {
      setMsg("කරුණාකර ආරම්භ දිනයක් තෝරන්න හෝ ඉක්මනින්ම තෝරන්න.");
      return;
    }
    if (services.length === 0) {
      setMsg("කරුණාකර අවම වශයෙන් එක් සේවාවක් තෝරන්න.");
      return;
    }
    if (files.length === 0) {
      setMsg("කරුණාකර අවම වශයෙන් එක් ඡායාරූපයක් එක් කරන්න.");
      return;
    }
    setSaving(true);
    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) {
        setMsg("කාර්යයක් පළ කිරීමට පෙර කරුණාකර පිවිසෙන්න.");
        setSaving(false);
        return;
      }

      const finalTitle = title.trim() || suggestion || "කාර්යය";
      let desc = "";
      desc += `නගරය: ${city}\n`;
      desc += `ආරම්භය: ${startType === "asap" ? "ඉක්මනින්ම" : startDate}\n`;
      desc += `සේවා: ${services
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
            approval_status: "pending",
            approval_note: null,
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
      const message = error instanceof Error ? error.message : "කාර්යය පළ කිරීමට අසමත් විය.";
      setMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <Page
        title="කාර්යයක් පළ කරන්න"
        description="මූලික තොරතුරු බෙදාගෙන කාර්යකරුවන්ට බිඩ් කිරීමට ඉඩ දෙන්න. පසුව ඔබට කාර්යය සංස්කරණය කළ හැක."
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {msg && <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{msg}</div>}

          <div className="card p-4 md:p-6 space-y-4">
            <FormField label="නගරය" hint="කාර්යය කෙතැනද?" required>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="උදා: කොළඹ"
                autoComplete="address-level2"
              />
            </FormField>

            <FormField label="ආරම්භය" hint="කවදා ආරම්භ කරන්නද?" required>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                  className="input-field"
                  value={startType}
                  onChange={(e) => setStartType(e.target.value as any)}
                >
                  <option value="asap">ඉක්මනින්ම</option>
                  <option value="date">දිනයක් තෝරන්න</option>
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

            <FormField label="සේවා" hint="එකක් හෝ වැඩි ගණනක් තෝරන්න" required>
              <ServiceMultiSelect services={serviceOptions} selected={services} setSelected={setServices} />
            </FormField>

            <FormField label="ශීර්ෂය" hint="විකල්පයි">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={suggestion || "කාර්ය ශීර්ෂය"}
              />
              {suggestion && !title ? (
                <div className="text-xs text-neutral-500 mt-1">යෝජනා: {suggestion}</div>
              ) : null}
            </FormField>

            <FormField label="විස්තරය" hint="අපි දැනගත යුතු දේ මොනවාද?" required>
              <Textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="කාර්යකරුවන්ට කරවීමට අවශ්‍ය දේ, මිනුම්, ද්‍රව්‍ය, ප්‍රවේශ විස්තර ආදිය කියන්න."
              />
            </FormField>

            <FormField label="ඡායාරූප" hint="අවම 1, උපරිම 5" required>
              <PhotoPicker files={files} setFiles={setFiles} max={5} />
            </FormField>
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-[rgb(var(--bg))] pb-4 pt-3">
            <div className="mx-auto max-w-3xl">
              <Button onClick={publish} loading={saving} fullWidth size="lg">
                කාර්යය පළ කරන්න
              </Button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                පළ කිරීමෙන් ඔබගේ කාර්ය විස්තර කාර්යකරුවන් සමඟ බෙදාගැනීමට එකඟ වේ.
              </p>
            </div>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
