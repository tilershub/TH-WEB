"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

type SectionType = "floor_tiling" | "bathroom" | "ceiling" | "glass" | "granite";

type BaseForm = {
  location: string;
  startText: string; // text only (ASAP / 25th Nov etc.)
  title: string;
  notes: string;
};

type FloorTilingData = {
  areaName: string; // Ground Floor / 1st Floor
  tilingSqft: string;
  tileSize: string; // 4×2 / 2×2 / 600×600 etc.
  skirtingLft: string; // optional
};

type BathroomData = {
  lengthFt: string;
  widthFt: string;
  heightFt: string;
  work: {
    plumbing: boolean;
    tiling: boolean;
    waterproofing: boolean;
    wallNiche: boolean;
    vanityTop: boolean;
    wiring: boolean;
  };
  notes: string;
};

type CeilingData = {
  ceilingType: "I-Panel" | "Gypsum" | "PVC" | "Other";
  areaSqft: string;
  addons: {
    centerDesign: boolean;
    ledStrip: boolean;
  };
  notes: string;
};

type GlassData = {
  item: "Shower Cubicle" | "Partition" | "Other";
  thickness: "8mm" | "10mm" | "12mm";
  lengthFt: string;
  widthFt: string;
  hardware: "Stainless Steel" | "Black" | "Gold" | "Other";
  notes: string;
};

type GraniteData = {
  item: "Pantry Top" | "Vanity Top" | "Other";
  lengthFt: string;
  graniteType: string; // Black Galaxy etc.
  options: {
    polishedEdge: boolean;
    sinkCutout: boolean;
  };
  notes: string;
};

type TaskSection = {
  id: string; // client id
  section_type: SectionType;
  title: string; // Ground Floor / Bathroom 1 etc.
  data: any;
};

const tileSizes = [
  "4×2",
  "2×2",
  "2×1",
  "600×600",
  "300×600",
  "300×300",
  "Other",
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clean(s: string) {
  return (s ?? "").trim();
}

function buildDescription(base: BaseForm, sections: TaskSection[]) {
  const lines: string[] = [];

  lines.push("✅ How to Post Your Job (Use This Format)");
  lines.push("");
  lines.push("👉 Please follow this format so professionals can quote accurately");
  lines.push("");
  lines.push("⸻");
  lines.push("");
  lines.push("📍 Location");
  lines.push("");
  lines.push(clean(base.location) || "—");
  lines.push("");
  lines.push("📅 Starting Date");
  lines.push("");
  lines.push(clean(base.startText) || "—");
  lines.push("");
  lines.push("⸻");

  // Group by type (preserves order inside sections list)
  const hasType = (t: SectionType) => sections.some((s) => s.section_type === t);

  const pushFloor = () => {
    lines.push("");
    lines.push("📌 Floor Tiling");
    lines.push("");
    sections
      .filter((s) => s.section_type === "floor_tiling")
      .forEach((s) => {
        const d = s.data as FloorTilingData;
        lines.push(`${clean(d.areaName) || clean(s.title) || "Area"}`);
        lines.push(`• Tiling – ${clean(d.tilingSqft) || "—"} sq.ft – Tile Size ${clean(d.tileSize) || "—"}`);
        if (clean(d.skirtingLft)) lines.push(`• Skirting – ${clean(d.skirtingLft)} Lin.ft`);
        lines.push("");
      });
    lines.push("⸻");
  };

  const pushBathroom = () => {
    lines.push("");
    lines.push("📌 Bathroom");
    lines.push("");
    sections
      .filter((s) => s.section_type === "bathroom")
      .forEach((s) => {
        const d = s.data as BathroomData;
        const size = `Length ${clean(d.lengthFt) || "—"} ft × Width ${clean(d.widthFt) || "—"} ft × Height ${clean(d.heightFt) || "—"} ft`;
        lines.push(`${clean(s.title) || "Bathroom"}`);
        lines.push(`Bathroom Size: ${size}`);
        lines.push("Work Required:");
        const w = d.work || {};
        const items = [
          w.plumbing ? "Plumbing" : null,
          w.tiling ? "Tiling" : null,
          w.waterproofing ? "Waterproofing" : null,
          w.wallNiche ? "Wall Niche" : null,
          w.vanityTop ? "Vanity Top" : null,
          w.wiring ? "Wiring" : null,
        ].filter(Boolean) as string[];
        if (items.length) items.forEach((x) => lines.push(`• ${x}`));
        else lines.push("• —");
        if (clean(d.notes)) lines.push(`Note: ${clean(d.notes)}`);
        lines.push("");
      });
    lines.push("⸻");
  };

  const pushCeiling = () => {
    lines.push("");
    lines.push("📌 Ceiling Work");
    lines.push("");
    sections
      .filter((s) => s.section_type === "ceiling")
      .forEach((s) => {
        const d = s.data as CeilingData;
        lines.push(`${clean(s.title) || "Ceiling"}`);
        lines.push(`${d.ceilingType || "Ceiling"} – ${clean(d.areaSqft) || "—"} sq.ft`);
        const addons = [
          d.addons?.centerDesign ? "Center Design" : null,
          d.addons?.ledStrip ? "LED Strip" : null,
        ].filter(Boolean) as string[];
        if (addons.length) lines.push(`Add-ons: ${addons.join(", ")}`);
        if (clean(d.notes)) lines.push(`Note: ${clean(d.notes)}`);
        lines.push("");
      });
    lines.push("⸻");
  };

  const pushGlass = () => {
    lines.push("");
    lines.push("📌 Glass Work");
    lines.push("");
    sections
      .filter((s) => s.section_type === "glass")
      .forEach((s) => {
        const d = s.data as GlassData;
        lines.push(`${clean(s.title) || "Glass"}`);
        lines.push(`${d.item || "Glass"} – ${d.thickness || "—"} Tempered Glass`);
        lines.push(`Size: ${clean(d.lengthFt) || "—"} ft × ${clean(d.widthFt) || "—"} ft`);
        lines.push(`Hardware: ${d.hardware || "—"}`);
        if (clean(d.notes)) lines.push(`Note: ${clean(d.notes)}`);
        lines.push("");
      });
    lines.push("⸻");
  };

  const pushGranite = () => {
    lines.push("");
    lines.push("📌 Granite Work");
    lines.push("");
    sections
      .filter((s) => s.section_type === "granite")
      .forEach((s) => {
        const d = s.data as GraniteData;
        lines.push(`${clean(s.title) || "Granite"}`);
        lines.push(`${d.item || "Granite"}:`);
        lines.push(`Length ${clean(d.lengthFt) || "—"} ft – ${clean(d.graniteType) || "—"}`);
        const opts = [
          d.options?.polishedEdge ? "polished edge" : null,
          d.options?.sinkCutout ? "sink cutout" : null,
        ].filter(Boolean) as string[];
        if (opts.length) lines.push(`Includes ${opts.join(" + ")}`);
        if (clean(d.notes)) lines.push(`Note: ${clean(d.notes)}`);
        lines.push("");
      });
    lines.push("⸻");
  };

  if (hasType("floor_tiling")) pushFloor();
  if (hasType("bathroom")) pushBathroom();
  if (hasType("ceiling")) pushCeiling();
  if (hasType("glass")) pushGlass();
  if (hasType("granite")) pushGranite();

  if (clean(base.notes)) {
    lines.push("");
    lines.push("📝 Additional Notes");
    lines.push("");
    lines.push(clean(base.notes));
    lines.push("");
    lines.push("⸻");
  }

  // tidy
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function PostTaskPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [base, setBase] = useState<BaseForm>({
    location: "",
    startText: "",
    title: "",
    notes: "",
  });

  const [sections, setSections] = useState<TaskSection[]>([]);
  const [activeType, setActiveType] = useState<SectionType>("floor_tiling");

  // Draft fields for adding a section
  const [draftTitle, setDraftTitle] = useState("");

  const [floorDraft, setFloorDraft] = useState<FloorTilingData>({
    areaName: "",
    tilingSqft: "",
    tileSize: "4×2",
    skirtingLft: "",
  });

  const [bathDraft, setBathDraft] = useState<BathroomData>({
    lengthFt: "",
    widthFt: "",
    heightFt: "",
    work: { plumbing: false, tiling: true, waterproofing: false, wallNiche: false, vanityTop: false, wiring: false },
    notes: "",
  });

  const [ceilDraft, setCeilDraft] = useState<CeilingData>({
    ceilingType: "I-Panel",
    areaSqft: "",
    addons: { centerDesign: false, ledStrip: false },
    notes: "",
  });

  const [glassDraft, setGlassDraft] = useState<GlassData>({
    item: "Shower Cubicle",
    thickness: "10mm",
    lengthFt: "",
    widthFt: "",
    hardware: "Stainless Steel",
    notes: "",
  });

  const [granDraft, setGranDraft] = useState<GraniteData>({
    item: "Pantry Top",
    lengthFt: "",
    graniteType: "Black Galaxy Granite",
    options: { polishedEdge: true, sinkCutout: false },
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Auto title suggestion
  const suggestedTitle = useMemo(() => {
    const loc = clean(base.location);
    if (!loc) return "";
    return `Tile Work in ${loc}`;
  }, [base.location]);

  const previewText = useMemo(() => buildDescription(base, sections), [base, sections]);

  const canNextBasics = clean(base.location).length > 1 && clean(base.startText).length > 1;

  const addSection = () => {
    setMsg(null);

    const title = clean(draftTitle) || (activeType === "floor_tiling" ? clean(floorDraft.areaName) : "");
    if (!title) {
      setMsg("Please give a section title (e.g., Ground Floor / Bathroom 1).");
      return;
    }

    let data: any = null;

    if (activeType === "floor_tiling") {
      if (!clean(floorDraft.tilingSqft)) {
        setMsg("Enter tiling sq.ft for Floor Tiling section.");
        return;
      }
      data = { ...floorDraft, areaName: clean(floorDraft.areaName) || title };
    }

    if (activeType === "bathroom") {
      data = { ...bathDraft };
    }

    if (activeType === "ceiling") {
      if (!clean(ceilDraft.areaSqft)) {
        setMsg("Enter ceiling area sq.ft.");
        return;
      }
      data = { ...ceilDraft };
    }

    if (activeType === "glass") {
      data = { ...glassDraft };
    }

    if (activeType === "granite") {
      data = { ...granDraft };
    }

    const newSection: TaskSection = {
      id: uid(),
      section_type: activeType,
      title,
      data,
    };

    setSections((p) => [...p, newSection]);
    setDraftTitle("");
    // keep drafts as-is (fast for multiple entries)
  };

  const removeSection = (id: string) => {
    setSections((p) => p.filter((x) => x.id !== id));
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[next];
      copy[next] = tmp;
      return copy;
    });
  };

  const publish = async () => {
    setSaving(true);
    setMsg(null);

    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) {
        setMsg("Please login.");
        setSaving(false);
        return;
      }

      if (!clean(base.location) || !clean(base.startText)) {
        setMsg("Location and Starting Date are required.");
        setSaving(false);
        return;
      }

      if (sections.length === 0) {
        setMsg("Please add at least one section (Floor/Bathroom/Ceiling/Glass/Granite).");
        setSaving(false);
        return;
      }

      const title = clean(base.title) || suggestedTitle || "New Task";
      const description = previewText;

      // 1) Insert task
      const inserted = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          location_text: clean(base.location),
          status: "open",
          owner_id: user.id,
        })
        .select("*")
        .single();

      if (inserted.error) throw new Error(inserted.error.message);
      const taskId = inserted.data.id as string;

      // 2) Insert sections
      const payload = sections.map((sec, i) => ({
        task_id: taskId,
        section_type: sec.section_type,
        title: sec.title,
        data: sec.data,
        sort_order: i,
      }));

      const secIns = await supabase.from("task_sections").insert(payload);
      if (secIns.error) throw new Error(secIns.error.message);

      // go to task page
      window.location.href = `/task/${taskId}`;
    } catch (e: any) {
      setMsg(e?.message || "Failed to publish.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <Page title="Post Task">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {msg && <div className="mb-4 rounded-xl border bg-neutral-50 p-3 text-sm">{msg}</div>}

          {/* Step indicator */}
          <div className="mb-4 flex gap-2 text-xs">
            <span className={`rounded-full border px-3 py-1 ${step === 1 ? "bg-black text-white" : ""}`}>1 Basics</span>
            <span className={`rounded-full border px-3 py-1 ${step === 2 ? "bg-black text-white" : ""}`}>2 Sections</span>
            <span className={`rounded-full border px-3 py-1 ${step === 3 ? "bg-black text-white" : ""}`}>3 Review</span>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="rounded-2xl border bg-white p-4 space-y-4">
              <div>
                <div className="text-sm font-semibold">📍 Location</div>
                <Input
                  className="mt-2"
                  value={base.location}
                  onChange={(e) => setBase((p) => ({ ...p, location: e.target.value }))}
                  placeholder="City / Town (Example: Kadawatha, Gampaha, Kandy)"
                />
              </div>

              <div>
                <div className="text-sm font-semibold">📅 Starting Date (Text)</div>
                <Input
                  className="mt-2"
                  value={base.startText}
                  onChange={(e) => setBase((p) => ({ ...p, startText: e.target.value }))}
                  placeholder='Example: "Start ASAP" or "Start from 25th November"'
                />
              </div>

              <div>
                <div className="text-sm font-semibold">Title (optional)</div>
                <Input
                  className="mt-2"
                  value={base.title}
                  onChange={(e) => setBase((p) => ({ ...p, title: e.target.value }))}
                  placeholder={suggestedTitle || "Tile Work Task"}
                />
                <div className="mt-1 text-xs text-neutral-500">
                  Suggestion: <span className="font-medium">{suggestedTitle || "—"}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Additional Notes (optional)</div>
                <Textarea
                  className="mt-2"
                  rows={4}
                  value={base.notes}
                  onChange={(e) => setBase((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Any extra info (tile brand, access, stairs, material availability, etc.)"
                />
              </div>

              <div className="flex justify-end">
                <Button disabled={!canNextBasics} onClick={() => setStep(2)}>
                  Next → Add Sections
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Add section card */}
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">+ Add Section</div>

                <div className="mt-3 grid gap-2 sm:grid-cols-5">
                  {(
                    [
                      ["floor_tiling", "Floor"],
                      ["bathroom", "Bathroom"],
                      ["ceiling", "Ceiling"],
                      ["glass", "Glass"],
                      ["granite", "Granite"],
                    ] as [SectionType, string][]
                  ).map(([t, label]) => (
                    <button
                      key={t}
                      onClick={() => setActiveType(t)}
                      className={`rounded-xl border px-3 py-2 text-sm ${
                        activeType === t ? "bg-black text-white" : "bg-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">Section Title</div>
                  <Input
                    className="mt-2"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder={
                      activeType === "floor_tiling"
                        ? "Ground Floor / 1st Floor / Kitchen"
                        : activeType === "bathroom"
                        ? "Bathroom 1 / Master Bathroom"
                        : activeType === "ceiling"
                        ? "Living Room Ceiling"
                        : activeType === "glass"
                        ? "Shower Area"
                        : "Pantry Top"
                    }
                  />
                </div>

                {/* Dynamic form */}
                <div className="mt-4 rounded-xl border bg-neutral-50 p-3">
                  {activeType === "floor_tiling" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Area Name</div>
                        <Input
                          className="mt-2"
                          value={floorDraft.areaName}
                          onChange={(e) => setFloorDraft((p) => ({ ...p, areaName: e.target.value }))}
                          placeholder="Ground Floor"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Tiling (sq.ft)</div>
                        <Input
                          className="mt-2"
                          value={floorDraft.tilingSqft}
                          onChange={(e) => setFloorDraft((p) => ({ ...p, tilingSqft: e.target.value }))}
                          placeholder="700"
                          inputMode="numeric"
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium">Tile Size</div>
                        <select
                          className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                          value={floorDraft.tileSize}
                          onChange={(e) => setFloorDraft((p) => ({ ...p, tileSize: e.target.value }))}
                        >
                          {tileSizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-sm font-medium">Skirting (Lin.ft) (optional)</div>
                        <Input
                          className="mt-2"
                          value={floorDraft.skirtingLft}
                          onChange={(e) => setFloorDraft((p) => ({ ...p, skirtingLft: e.target.value }))}
                          placeholder="250"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  )}

                  {activeType === "bathroom" && (
                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <div className="text-sm font-medium">Length (ft)</div>
                          <Input className="mt-2" value={bathDraft.lengthFt} onChange={(e) => setBathDraft((p) => ({ ...p, lengthFt: e.target.value }))} placeholder="10" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Width (ft)</div>
                          <Input className="mt-2" value={bathDraft.widthFt} onChange={(e) => setBathDraft((p) => ({ ...p, widthFt: e.target.value }))} placeholder="5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Height (ft)</div>
                          <Input className="mt-2" value={bathDraft.heightFt} onChange={(e) => setBathDraft((p) => ({ ...p, heightFt: e.target.value }))} placeholder="10" />
                        </div>
                      </div>

                      <div className="text-sm font-medium">Work Required</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {[
                          ["plumbing", "Plumbing"],
                          ["tiling", "Tiling"],
                          ["waterproofing", "Waterproofing"],
                          ["wallNiche", "Wall Niche"],
                          ["vanityTop", "Vanity Top"],
                          ["wiring", "Wiring"],
                        ].map(([k, label]) => (
                          <label key={k} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(bathDraft.work as any)[k]}
                              onChange={(e) =>
                                setBathDraft((p) => ({
                                  ...p,
                                  work: { ...p.work, [k]: e.target.checked } as any,
                                }))
                              }
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>

                      <div>
                        <div className="text-sm font-medium">Notes (optional)</div>
                        <Textarea className="mt-2" rows={3} value={bathDraft.notes} onChange={(e) => setBathDraft((p) => ({ ...p, notes: e.target.value }))} placeholder="Any extra bathroom details" />
                      </div>
                    </div>
                  )}

                  {activeType === "ceiling" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Ceiling Type</div>
                        <select
                          className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                          value={ceilDraft.ceilingType}
                          onChange={(e) => setCeilDraft((p) => ({ ...p, ceilingType: e.target.value as any }))}
                        >
                          {["I-Panel", "Gypsum", "PVC", "Other"].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-sm font-medium">Area (sq.ft)</div>
                        <Input className="mt-2" value={ceilDraft.areaSqft} onChange={(e) => setCeilDraft((p) => ({ ...p, areaSqft: e.target.value }))} placeholder="820" inputMode="numeric" />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Add-ons</div>
                        <div className="mt-2 flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={ceilDraft.addons.centerDesign} onChange={(e) => setCeilDraft((p) => ({ ...p, addons: { ...p.addons, centerDesign: e.target.checked } }))} />
                            Center Design
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={ceilDraft.addons.ledStrip} onChange={(e) => setCeilDraft((p) => ({ ...p, addons: { ...p.addons, ledStrip: e.target.checked } }))} />
                            LED Strip
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Notes (optional)</div>
                        <Textarea className="mt-2" rows={3} value={ceilDraft.notes} onChange={(e) => setCeilDraft((p) => ({ ...p, notes: e.target.value }))} placeholder="Any extra ceiling details" />
                      </div>
                    </div>
                  )}

                  {activeType === "glass" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Item</div>
                        <select className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm" value={glassDraft.item} onChange={(e) => setGlassDraft((p) => ({ ...p, item: e.target.value as any }))}>
                          {["Shower Cubicle", "Partition", "Other"].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-sm font-medium">Thickness</div>
                        <select className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm" value={glassDraft.thickness} onChange={(e) => setGlassDraft((p) => ({ ...p, thickness: e.target.value as any }))}>
                          {["8mm", "10mm", "12mm"].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-sm font-medium">Length (ft)</div>
                        <Input className="mt-2" value={glassDraft.lengthFt} onChange={(e) => setGlassDraft((p) => ({ ...p, lengthFt: e.target.value }))} placeholder="6" />
                      </div>

                      <div>
                        <div className="text-sm font-medium">Width (ft)</div>
                        <Input className="mt-2" value={glassDraft.widthFt} onChange={(e) => setGlassDraft((p) => ({ ...p, widthFt: e.target.value }))} placeholder="4" />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Hardware</div>
                        <select className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm" value={glassDraft.hardware} onChange={(e) => setGlassDraft((p) => ({ ...p, hardware: e.target.value as any }))}>
                          {["Stainless Steel", "Black", "Gold", "Other"].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Notes (optional)</div>
                        <Textarea className="mt-2" rows={3} value={glassDraft.notes} onChange={(e) => setGlassDraft((p) => ({ ...p, notes: e.target.value }))} placeholder="Any extra glass details" />
                      </div>
                    </div>
                  )}

                  {activeType === "granite" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium">Item</div>
                        <select className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm" value={granDraft.item} onChange={(e) => setGranDraft((p) => ({ ...p, item: e.target.value as any }))}>
                          {["Pantry Top", "Vanity Top", "Other"].map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-sm font-medium">Length (ft)</div>
                        <Input className="mt-2" value={granDraft.lengthFt} onChange={(e) => setGranDraft((p) => ({ ...p, lengthFt: e.target.value }))} placeholder="12" />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Granite Type</div>
                        <Input className="mt-2" value={granDraft.graniteType} onChange={(e) => setGranDraft((p) => ({ ...p, graniteType: e.target.value }))} placeholder="Black Galaxy Granite" />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Options</div>
                        <div className="mt-2 flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={granDraft.options.polishedEdge} onChange={(e) => setGranDraft((p) => ({ ...p, options: { ...p.options, polishedEdge: e.target.checked } }))} />
                            Polished edge
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={granDraft.options.sinkCutout} onChange={(e) => setGranDraft((p) => ({ ...p, options: { ...p.options, sinkCutout: e.target.checked } }))} />
                            Sink cutout
                          </label>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-sm font-medium">Notes (optional)</div>
                        <Textarea className="mt-2" rows={3} value={granDraft.notes} onChange={(e) => setGranDraft((p) => ({ ...p, notes: e.target.value }))} placeholder="Any extra granite details" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={addSection}>Add Section</Button>
                </div>
              </div>

              {/* Sections list */}
              <div className="rounded-2xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Your Sections</div>
                  <div className="text-xs text-neutral-500">{sections.length} added</div>
                </div>

                <div className="mt-3 grid gap-2">
                  {sections.map((s) => (
                    <div key={s.id} className="rounded-xl border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{s.title}</div>
                          <div className="mt-0.5 text-xs text-neutral-500">{s.section_type.replace("_", " ")}</div>
                        </div>

                        <div className="flex gap-2">
                          <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => moveSection(s.id, -1)}>↑</button>
                          <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => moveSection(s.id, 1)}>↓</button>
                          <button className="rounded-lg border px-2 py-1 text-xs" onClick={() => removeSection(s.id)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sections.length === 0 && (
                    <div className="text-sm text-neutral-600">No sections yet. Add at least one.</div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button disabled={sections.length === 0} onClick={() => setStep(3)}>
                    Review →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">Preview (Auto-generated)</div>
                <div className="mt-3 rounded-xl border bg-neutral-50 p-3">
                  <pre className="whitespace-pre-wrap text-sm">{previewText}</pre>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(previewText);
                      setMsg("Copied preview to clipboard ✅");
                    }}
                  >
                    Copy
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setStep(2)}
                  >
                    ← Edit Sections
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">Publish</div>
                <div className="mt-2 text-sm text-neutral-600">
                  This will post your task publicly so tilers can bid.
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={publish} disabled={saving}>
                    {saving ? "Publishing…" : "Publish Task"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Page>
    </RequireAuth>
  );
}