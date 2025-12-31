"use client";

import { useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

type ServiceType = 
  | "floor_tiling" 
  | "wall_tiling" 
  | "staircase_tiling" 
  | "bathroom_tiling" 
  | "pantry_backsplash" 
  | "other";

type BaseForm = {
  projectAddress: string;
  startingDate: string;
  title: string;
};

type FloorTilingData = {
  tilingType: "floor_tiling";
  floor: string;
  material: string;
  tileSize: string;
  area: string;
  skirtingEnabled: boolean;
  skirtingLength: string;
  screedEnabled: boolean;
  screedArea: string;
  doubleNosingEnabled: boolean;
  doubleNosingLength: string;
  singleNosingEnabled: boolean;
  singleNosingLength: string;
  demolitionEnabled: boolean;
  demolitionArea: string;
  notes: string;
  imagePath: string | null;
};

type WallTilingData = {
  tilingType: "wall_tiling";
  floor: string;
  material: string;
  tileSize: string;
  area: string;
  skirtingEnabled: boolean;
  skirtingLength: string;
  screedEnabled: boolean;
  screedArea: string;
  doubleNosingEnabled: boolean;
  doubleNosingLength: string;
  singleNosingEnabled: boolean;
  singleNosingLength: string;
  demolitionEnabled: boolean;
  demolitionArea: string;
  notes: string;
  imagePath: string | null;
};

type StaircaseTilingData = {
  tilingType: "staircase_tiling";
  material: string;
  tileSize: string;
  steps: string;
  stepLength: string;
  top: string;
  riser: string;
  landings: string;
  skirtingEnabled: boolean;
  sizeAndLevelingEnabled: boolean;
  edgeFinishing: string;
  demolitionEnabled: boolean;
  notes: string;
  imagePath: string | null;
};

type BathroomTilingData = {
  tilingType: "bathroom_tiling";
  floor: string;
  material: string;
  tileSize: string;
  wallTilingArea: string;
  floorTilingArea: string;
  screedEnabled: boolean;
  screedArea: string;
  doubleNosingEnabled: boolean;
  doubleNosingLength: string;
  fortyFiveDegreeEnabled: boolean;
  fortyFiveDegreeLength: string;
  demolitionEnabled: boolean;
  demolitionArea: string;
  notes: string;
  imagePath: string | null;
};

type PantryBacksplashData = {
  tilingType: "pantry_backsplash";
  material: string;
  tileSize: string;
  area: string;
  pantryLength: string;
  shape: string;
  edgeFinish: string;
  demolitionEnabled: boolean;
  notes: string;
  imagePath: string | null;
};

type OtherServiceData = {
  tilingType: "other";
  description: string;
  notes: string;
  imagePath: string | null;
};

type ServiceData = FloorTilingData | WallTilingData | StaircaseTilingData | BathroomTilingData | PantryBacksplashData | OtherServiceData;

type TaskSection = {
  id: string;
  serviceType: ServiceType;
  title: string;
  data: ServiceData;
};

const tileSizes = ["1×1", "2×1", "2×2", "4×2", "300×300", "300×600", "600×600", "Other"];
const materials = ["Tile", "Mosaic", "Granite", "Marble", "Other"];
const floors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "Basement", "Other"];
const shapes = ["Straight", "L-Shape", "U-Shape", "Island", "Other"];
const edgeFinishes = ["Double Nose (Curve)", "Single Nose", "Flat Edge", "Beveled Edge", "Other"];
const staircaseEdgeFinishes = ["Double Nose", "Single Nose", "Flat Edge", "Other"];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clean(s: string) {
  return (s ?? "").trim();
}

const defaultFloorTiling: FloorTilingData = {
  tilingType: "floor_tiling",
  floor: "Ground Floor",
  material: "Tile",
  tileSize: "2×2",
  area: "",
  skirtingEnabled: false,
  skirtingLength: "",
  screedEnabled: false,
  screedArea: "",
  doubleNosingEnabled: false,
  doubleNosingLength: "",
  singleNosingEnabled: false,
  singleNosingLength: "",
  demolitionEnabled: false,
  demolitionArea: "",
  notes: "",
  imagePath: null,
};

const defaultWallTiling: WallTilingData = {
  tilingType: "wall_tiling",
  floor: "Ground Floor",
  material: "Tile",
  tileSize: "2×2",
  area: "",
  skirtingEnabled: false,
  skirtingLength: "",
  screedEnabled: false,
  screedArea: "",
  doubleNosingEnabled: false,
  doubleNosingLength: "",
  singleNosingEnabled: false,
  singleNosingLength: "",
  demolitionEnabled: false,
  demolitionArea: "",
  notes: "",
  imagePath: null,
};

const defaultStaircaseTiling: StaircaseTilingData = {
  tilingType: "staircase_tiling",
  material: "Tile",
  tileSize: "4×2",
  steps: "",
  stepLength: "",
  top: "",
  riser: "",
  landings: "",
  skirtingEnabled: false,
  sizeAndLevelingEnabled: false,
  edgeFinishing: "Double Nose",
  demolitionEnabled: false,
  notes: "",
  imagePath: null,
};

const defaultBathroomTiling: BathroomTilingData = {
  tilingType: "bathroom_tiling",
  floor: "Ground Floor",
  material: "Tile",
  tileSize: "2×2",
  wallTilingArea: "",
  floorTilingArea: "",
  screedEnabled: false,
  screedArea: "",
  doubleNosingEnabled: false,
  doubleNosingLength: "",
  fortyFiveDegreeEnabled: false,
  fortyFiveDegreeLength: "",
  demolitionEnabled: false,
  demolitionArea: "",
  notes: "",
  imagePath: null,
};

const defaultPantryBacksplash: PantryBacksplashData = {
  tilingType: "pantry_backsplash",
  material: "Granite",
  tileSize: "4×2",
  area: "",
  pantryLength: "",
  shape: "Straight",
  edgeFinish: "Double Nose (Curve)",
  demolitionEnabled: false,
  notes: "",
  imagePath: null,
};

const defaultOtherService: OtherServiceData = {
  tilingType: "other",
  description: "",
  notes: "",
  imagePath: null,
};

function getDefaultData(type: ServiceType): ServiceData {
  switch (type) {
    case "floor_tiling": return { ...defaultFloorTiling };
    case "wall_tiling": return { ...defaultWallTiling };
    case "staircase_tiling": return { ...defaultStaircaseTiling };
    case "bathroom_tiling": return { ...defaultBathroomTiling };
    case "pantry_backsplash": return { ...defaultPantryBacksplash };
    case "other": return { ...defaultOtherService };
  }
}

function buildDescription(base: BaseForm, sections: TaskSection[]) {
  const lines: string[] = [];

  lines.push("📍 Project Address");
  lines.push(clean(base.projectAddress) || "—");
  lines.push("");
  lines.push("📅 Starting Date");
  lines.push(clean(base.startingDate) || "—");
  lines.push("");
  lines.push("⸻");

  sections.forEach((section, idx) => {
    lines.push("");
    lines.push(`📌 Service ${idx + 1}: ${section.title}`);
    lines.push("");

    const d = section.data;
    
    if (d.tilingType === "floor_tiling" || d.tilingType === "wall_tiling") {
      const fd = d as FloorTilingData | WallTilingData;
      lines.push(`Type: ${d.tilingType === "floor_tiling" ? "Floor Tiling" : "Wall Tiling"}`);
      lines.push(`Floor: ${fd.floor}`);
      lines.push(`Material: ${fd.material}`);
      lines.push(`Tile Size: ${fd.tileSize}`);
      lines.push(`Area: ${fd.area} sq.ft`);
      if (fd.skirtingEnabled) lines.push(`Skirting: Yes / ${fd.skirtingLength} Lin.ft`);
      if (fd.screedEnabled) lines.push(`Screed: Yes / ${fd.screedArea} sq.ft`);
      if (fd.doubleNosingEnabled) lines.push(`Double Nosing: Yes / ${fd.doubleNosingLength} Lin.ft`);
      if (fd.singleNosingEnabled) lines.push(`Single Nosing: Yes / ${fd.singleNosingLength} Lin.ft`);
      if (fd.demolitionEnabled) lines.push(`Demolition Work: Yes / ${fd.demolitionArea} sq.ft`);
    }

    if (d.tilingType === "staircase_tiling") {
      const sd = d as StaircaseTilingData;
      lines.push(`Type: Staircase Tiling`);
      lines.push(`Material: ${sd.material}`);
      lines.push(`Tile Size: ${sd.tileSize}`);
      lines.push(`Steps: ${sd.steps}`);
      lines.push(`Step Length: ${sd.stepLength} Lin.ft`);
      lines.push(`Top: ${sd.top} ft`);
      lines.push(`Riser: ${sd.riser}`);
      lines.push(`Landings: ${sd.landings}`);
      if (sd.skirtingEnabled) lines.push(`Skirting: Yes`);
      if (sd.sizeAndLevelingEnabled) lines.push(`Size & Leveling: Yes`);
      lines.push(`Edge Finishing: ${sd.edgeFinishing}`);
      if (sd.demolitionEnabled) lines.push(`Demolition Work: Yes`);
    }

    if (d.tilingType === "bathroom_tiling") {
      const bd = d as BathroomTilingData;
      lines.push(`Type: Bathroom Tiling`);
      lines.push(`Floor: ${bd.floor}`);
      lines.push(`Material: ${bd.material}`);
      lines.push(`Tile Size: ${bd.tileSize}`);
      lines.push(`Wall Tiling Area: ${bd.wallTilingArea} sq.ft`);
      lines.push(`Floor Tiling Area: ${bd.floorTilingArea} sq.ft`);
      if (bd.screedEnabled) lines.push(`Screed: Yes / ${bd.screedArea} sq.ft`);
      if (bd.doubleNosingEnabled) lines.push(`Double Nosing: Yes / ${bd.doubleNosingLength} Lin.ft`);
      if (bd.fortyFiveDegreeEnabled) lines.push(`45°: ${bd.fortyFiveDegreeLength} Lin.ft`);
      if (bd.demolitionEnabled) lines.push(`Demolition Work: Yes / ${bd.demolitionArea} sq.ft`);
    }

    if (d.tilingType === "pantry_backsplash") {
      const pd = d as PantryBacksplashData;
      lines.push(`Type: Pantry Top / Backsplash`);
      lines.push(`Material: ${pd.material}`);
      lines.push(`Tile Size: ${pd.tileSize}`);
      lines.push(`Area: ${pd.area} sq.ft`);
      lines.push(`Pantry Length: ${pd.pantryLength} Lin.ft`);
      lines.push(`Shape: ${pd.shape}`);
      lines.push(`Edge Finish: ${pd.edgeFinish}`);
      if (pd.demolitionEnabled) lines.push(`Demolition Work: Yes`);
    }

    if (d.tilingType === "other") {
      const od = d as OtherServiceData;
      lines.push(`Type: Other Service`);
      lines.push(`Description: ${od.description}`);
    }

    if (d.notes) {
      lines.push(`Additional Notes: ${d.notes}`);
    }

    lines.push("");
    lines.push("⸻");
  });

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function SelectField({ label, value, onChange, options }: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  options: string[] 
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-1">{label}</div>
      <select
        className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ToggleWithInput({
  label,
  unit,
  enabled,
  value,
  onToggle,
  onChange,
}: {
  label: string;
  unit: string;
  enabled: boolean;
  value: string;
  onToggle: (val: boolean) => void;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer min-w-[140px]">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">{label}</span>
      </label>
      {enabled && (
        <div className="flex items-center gap-2 flex-1">
          <Input
            className="flex-1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            inputMode="numeric"
          />
          <span className="text-sm text-neutral-500 whitespace-nowrap">{unit}</span>
        </div>
      )}
    </div>
  );
}

function SimpleToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

function ImageUpload({
  imagePath,
  onUpload,
  uploading,
}: {
  imagePath: string | null;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-2">Image (optional)</div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
      {imagePath ? (
        <div className="relative inline-block">
          <img
            src={imagePath}
            alt="Uploaded"
            className="w-24 h-24 object-cover rounded-xl border"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="border-2 border-dashed border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-500 hover:border-black hover:text-black transition"
        >
          {uploading ? "Uploading..." : "📷 Add Image"}
        </button>
      )}
    </div>
  );
}

function FloorWallTilingForm({
  data,
  onChange,
  onImageUpload,
  uploading,
  isWall,
}: {
  data: FloorTilingData | WallTilingData;
  onChange: (data: FloorTilingData | WallTilingData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
  isWall: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Floor" value={data.floor} onChange={(v) => onChange({ ...data, floor: v })} options={floors} />
        <SelectField label="Material" value={data.material} onChange={(v) => onChange({ ...data, material: v })} options={materials} />
        <SelectField label="Tile Size" value={data.tileSize} onChange={(v) => onChange({ ...data, tileSize: v })} options={tileSizes} />
        <div>
          <div className="text-sm font-medium mb-1">Area (sq.ft)</div>
          <Input
            value={data.area}
            onChange={(e) => onChange({ ...data, area: e.target.value })}
            placeholder="700"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="text-sm font-semibold text-neutral-700">Additional Work</div>
        <ToggleWithInput
          label="Skirting"
          unit="Lin.ft"
          enabled={data.skirtingEnabled}
          value={data.skirtingLength}
          onToggle={(v) => onChange({ ...data, skirtingEnabled: v })}
          onChange={(v) => onChange({ ...data, skirtingLength: v })}
        />
        <ToggleWithInput
          label="Screed"
          unit="sq.ft"
          enabled={data.screedEnabled}
          value={data.screedArea}
          onToggle={(v) => onChange({ ...data, screedEnabled: v })}
          onChange={(v) => onChange({ ...data, screedArea: v })}
        />
        <ToggleWithInput
          label="Double Nosing"
          unit="Lin.ft"
          enabled={data.doubleNosingEnabled}
          value={data.doubleNosingLength}
          onToggle={(v) => onChange({ ...data, doubleNosingEnabled: v })}
          onChange={(v) => onChange({ ...data, doubleNosingLength: v })}
        />
        <ToggleWithInput
          label="Single Nosing"
          unit="Lin.ft"
          enabled={data.singleNosingEnabled}
          value={data.singleNosingLength}
          onToggle={(v) => onChange({ ...data, singleNosingEnabled: v })}
          onChange={(v) => onChange({ ...data, singleNosingLength: v })}
        />
        <ToggleWithInput
          label="Demolition Work"
          unit="sq.ft"
          enabled={data.demolitionEnabled}
          value={data.demolitionArea}
          onToggle={(v) => onChange({ ...data, demolitionEnabled: v })}
          onChange={(v) => onChange({ ...data, demolitionArea: v })}
        />
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-1">Additional Notes</div>
        <Textarea
          rows={3}
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Any extra details about this section..."
        />
      </div>

      <ImageUpload imagePath={data.imagePath} onUpload={onImageUpload} uploading={uploading} />
    </div>
  );
}

function StaircaseTilingForm({
  data,
  onChange,
  onImageUpload,
  uploading,
}: {
  data: StaircaseTilingData;
  onChange: (data: StaircaseTilingData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Material" value={data.material} onChange={(v) => onChange({ ...data, material: v })} options={materials} />
        <SelectField label="Tile Size" value={data.tileSize} onChange={(v) => onChange({ ...data, tileSize: v })} options={tileSizes} />
        <div>
          <div className="text-sm font-medium mb-1">Number of Steps</div>
          <Input value={data.steps} onChange={(e) => onChange({ ...data, steps: e.target.value })} placeholder="20" inputMode="numeric" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Step Length (Lin.ft)</div>
          <Input value={data.stepLength} onChange={(e) => onChange({ ...data, stepLength: e.target.value })} placeholder="3" inputMode="numeric" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Top (ft)</div>
          <Input value={data.top} onChange={(e) => onChange({ ...data, top: e.target.value })} placeholder="1" inputMode="numeric" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Riser</div>
          <Input value={data.riser} onChange={(e) => onChange({ ...data, riser: e.target.value })} placeholder="6 inch" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Landings</div>
          <Input value={data.landings} onChange={(e) => onChange({ ...data, landings: e.target.value })} placeholder="1" inputMode="numeric" />
        </div>
        <SelectField label="Edge Finishing" value={data.edgeFinishing} onChange={(v) => onChange({ ...data, edgeFinishing: v })} options={staircaseEdgeFinishes} />
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="text-sm font-semibold text-neutral-700">Additional Options</div>
        <SimpleToggle label="Skirting" enabled={data.skirtingEnabled} onToggle={(v) => onChange({ ...data, skirtingEnabled: v })} />
        <SimpleToggle label="Size & Leveling" enabled={data.sizeAndLevelingEnabled} onToggle={(v) => onChange({ ...data, sizeAndLevelingEnabled: v })} />
        <SimpleToggle label="Demolition Work" enabled={data.demolitionEnabled} onToggle={(v) => onChange({ ...data, demolitionEnabled: v })} />
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-1">Additional Notes</div>
        <Textarea rows={3} value={data.notes} onChange={(e) => onChange({ ...data, notes: e.target.value })} placeholder="Any extra details about this staircase..." />
      </div>

      <ImageUpload imagePath={data.imagePath} onUpload={onImageUpload} uploading={uploading} />
    </div>
  );
}

function BathroomTilingForm({
  data,
  onChange,
  onImageUpload,
  uploading,
}: {
  data: BathroomTilingData;
  onChange: (data: BathroomTilingData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Floor" value={data.floor} onChange={(v) => onChange({ ...data, floor: v })} options={floors} />
        <SelectField label="Material" value={data.material} onChange={(v) => onChange({ ...data, material: v })} options={materials} />
        <SelectField label="Tile Size" value={data.tileSize} onChange={(v) => onChange({ ...data, tileSize: v })} options={tileSizes} />
        <div>
          <div className="text-sm font-medium mb-1">Wall Tiling Area (sq.ft)</div>
          <Input value={data.wallTilingArea} onChange={(e) => onChange({ ...data, wallTilingArea: e.target.value })} placeholder="300" inputMode="numeric" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Floor Tiling Area (sq.ft)</div>
          <Input value={data.floorTilingArea} onChange={(e) => onChange({ ...data, floorTilingArea: e.target.value })} placeholder="70" inputMode="numeric" />
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="text-sm font-semibold text-neutral-700">Additional Work</div>
        <ToggleWithInput label="Screed" unit="sq.ft" enabled={data.screedEnabled} value={data.screedArea} onToggle={(v) => onChange({ ...data, screedEnabled: v })} onChange={(v) => onChange({ ...data, screedArea: v })} />
        <ToggleWithInput label="Double Nosing" unit="Lin.ft" enabled={data.doubleNosingEnabled} value={data.doubleNosingLength} onToggle={(v) => onChange({ ...data, doubleNosingEnabled: v })} onChange={(v) => onChange({ ...data, doubleNosingLength: v })} />
        <ToggleWithInput label="45°" unit="Lin.ft" enabled={data.fortyFiveDegreeEnabled} value={data.fortyFiveDegreeLength} onToggle={(v) => onChange({ ...data, fortyFiveDegreeEnabled: v })} onChange={(v) => onChange({ ...data, fortyFiveDegreeLength: v })} />
        <ToggleWithInput label="Demolition Work" unit="sq.ft" enabled={data.demolitionEnabled} value={data.demolitionArea} onToggle={(v) => onChange({ ...data, demolitionEnabled: v })} onChange={(v) => onChange({ ...data, demolitionArea: v })} />
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-1">Additional Notes</div>
        <Textarea rows={3} value={data.notes} onChange={(e) => onChange({ ...data, notes: e.target.value })} placeholder="Any extra details about this bathroom..." />
      </div>

      <ImageUpload imagePath={data.imagePath} onUpload={onImageUpload} uploading={uploading} />
    </div>
  );
}

function PantryBacksplashForm({
  data,
  onChange,
  onImageUpload,
  uploading,
}: {
  data: PantryBacksplashData;
  onChange: (data: PantryBacksplashData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Material" value={data.material} onChange={(v) => onChange({ ...data, material: v })} options={materials} />
        <SelectField label="Tile Size" value={data.tileSize} onChange={(v) => onChange({ ...data, tileSize: v })} options={tileSizes} />
        <div>
          <div className="text-sm font-medium mb-1">Area (sq.ft)</div>
          <Input value={data.area} onChange={(e) => onChange({ ...data, area: e.target.value })} placeholder="60" inputMode="numeric" />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Pantry Length (Lin.ft)</div>
          <Input value={data.pantryLength} onChange={(e) => onChange({ ...data, pantryLength: e.target.value })} placeholder="15" inputMode="numeric" />
        </div>
        <SelectField label="Shape" value={data.shape} onChange={(v) => onChange({ ...data, shape: v })} options={shapes} />
        <SelectField label="Edge Finish" value={data.edgeFinish} onChange={(v) => onChange({ ...data, edgeFinish: v })} options={edgeFinishes} />
      </div>

      <div className="border-t pt-4">
        <SimpleToggle label="Demolition Work" enabled={data.demolitionEnabled} onToggle={(v) => onChange({ ...data, demolitionEnabled: v })} />
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-1">Additional Notes</div>
        <Textarea rows={3} value={data.notes} onChange={(e) => onChange({ ...data, notes: e.target.value })} placeholder="Any extra details about this pantry/backsplash..." />
      </div>

      <ImageUpload imagePath={data.imagePath} onUpload={onImageUpload} uploading={uploading} />
    </div>
  );
}

function OtherServiceForm({
  data,
  onChange,
  onImageUpload,
  uploading,
}: {
  data: OtherServiceData;
  onChange: (data: OtherServiceData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-1">Description</div>
        <Textarea
          rows={4}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Describe the service you need..."
        />
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-1">Additional Notes</div>
        <Textarea rows={3} value={data.notes} onChange={(e) => onChange({ ...data, notes: e.target.value })} placeholder="Any extra details..." />
      </div>

      <ImageUpload imagePath={data.imagePath} onUpload={onImageUpload} uploading={uploading} />
    </div>
  );
}

export default function PostTaskPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [base, setBase] = useState<BaseForm>({
    projectAddress: "",
    startingDate: "",
    title: "",
  });

  const [sections, setSections] = useState<TaskSection[]>([]);
  const [activeType, setActiveType] = useState<ServiceType>("floor_tiling");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftData, setDraftData] = useState<ServiceData>(getDefaultData("floor_tiling"));
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const suggestedTitle = useMemo(() => {
    const addr = clean(base.projectAddress);
    if (!addr) return "";
    return `Tiling Work - ${addr}`;
  }, [base.projectAddress]);

  const previewText = useMemo(() => buildDescription(base, sections), [base, sections]);

  const canNextBasics = clean(base.projectAddress).length > 1 && clean(base.startingDate).length > 1;

  const handleTypeChange = (type: ServiceType) => {
    setActiveType(type);
    setDraftData(getDefaultData(type));
    setDraftTitle("");
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session?.user) {
        setMsg("Please login to upload images.");
        return;
      }

      const ext = file.name.split(".").pop() || "jpg";
      const path = `task-images/${s.session.user.id}/${uid()}.${ext}`;

      const { error } = await supabase.storage.from("uploads").upload(path, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      
      setDraftData((prev) => ({ ...prev, imagePath: urlData.publicUrl }));
    } catch (err: any) {
      setMsg(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const addSection = () => {
    setMsg(null);

    const title = clean(draftTitle) || getDefaultTitle(activeType);
    if (!title) {
      setMsg("Please give a section title.");
      return;
    }

    const newSection: TaskSection = {
      id: uid(),
      serviceType: activeType,
      title,
      data: { ...draftData },
    };

    setSections((p) => [...p, newSection]);
    setDraftTitle("");
    setDraftData(getDefaultData(activeType));
  };

  const getDefaultTitle = (type: ServiceType): string => {
    switch (type) {
      case "floor_tiling": return "Floor Tiling";
      case "wall_tiling": return "Wall Tiling";
      case "staircase_tiling": return "Staircase Tiling";
      case "bathroom_tiling": return "Bathroom Tiling";
      case "pantry_backsplash": return "Pantry Top / Backsplash";
      case "other": return "Other Service";
    }
  };

  const removeSection = (id: string) => {
    setSections((p) => p.filter((x) => x.id !== id));
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

      if (!clean(base.projectAddress) || !clean(base.startingDate)) {
        setMsg("Project address and starting date are required.");
        setSaving(false);
        return;
      }

      if (sections.length === 0) {
        setMsg("Please add at least one service section.");
        setSaving(false);
        return;
      }

      const title = clean(base.title) || suggestedTitle || "Tiling Task";
      const description = previewText;

      const inserted = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          location_text: clean(base.projectAddress),
          status: "open",
          owner_id: user.id,
        })
        .select("*")
        .single();

      if (inserted.error) throw new Error(inserted.error.message);
      const taskId = inserted.data.id as string;

      const payload = sections.map((sec, i) => ({
        task_id: taskId,
        section_type: sec.serviceType,
        title: sec.title,
        data: sec.data,
        sort_order: i,
      }));

      const secIns = await supabase.from("task_sections").insert(payload);
      if (secIns.error) throw new Error(secIns.error.message);

      window.location.href = `/task/${taskId}`;
    } catch (e: any) {
      setMsg(e?.message || "Failed to publish.");
    } finally {
      setSaving(false);
    }
  };

  const serviceTypes: [ServiceType, string][] = [
    ["floor_tiling", "Floor Tiling"],
    ["wall_tiling", "Wall Tiling"],
    ["staircase_tiling", "Staircase"],
    ["bathroom_tiling", "Bathroom"],
    ["pantry_backsplash", "Pantry/Backsplash"],
    ["other", "Other"],
  ];

  return (
    <RequireAuth>
      <Page title="Post Task">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {msg && <div className="mb-4 rounded-xl border bg-red-50 text-red-700 p-3 text-sm">{msg}</div>}

          <div className="mb-4 flex gap-2 text-xs">
            <span className={`rounded-full border px-3 py-1 ${step === 1 ? "bg-black text-white" : ""}`}>1 Project Info</span>
            <span className={`rounded-full border px-3 py-1 ${step === 2 ? "bg-black text-white" : ""}`}>2 Services</span>
            <span className={`rounded-full border px-3 py-1 ${step === 3 ? "bg-black text-white" : ""}`}>3 Review</span>
          </div>

          {step === 1 && (
            <div className="rounded-2xl border bg-white p-4 space-y-4">
              <div>
                <div className="text-sm font-semibold">📍 Project Address</div>
                <Input
                  className="mt-2"
                  value={base.projectAddress}
                  onChange={(e) => setBase((p) => ({ ...p, projectAddress: e.target.value }))}
                  placeholder="Full project address (e.g., 123 Main St, Kadawatha, Gampaha)"
                />
              </div>

              <div>
                <div className="text-sm font-semibold">📅 Starting Date</div>
                <Input
                  className="mt-2"
                  value={base.startingDate}
                  onChange={(e) => setBase((p) => ({ ...p, startingDate: e.target.value }))}
                  placeholder='e.g., "Start ASAP" or "25th November 2024"'
                />
              </div>

              <div>
                <div className="text-sm font-semibold">Title (optional)</div>
                <Input
                  className="mt-2"
                  value={base.title}
                  onChange={(e) => setBase((p) => ({ ...p, title: e.target.value }))}
                  placeholder={suggestedTitle || "Tiling Work Task"}
                />
                {suggestedTitle && (
                  <div className="mt-1 text-xs text-neutral-500">
                    Suggestion: <span className="font-medium">{suggestedTitle}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button disabled={!canNextBasics} onClick={() => setStep(2)}>
                  Next → Add Services
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold mb-3">+ Add Service</div>

                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                  {serviceTypes.map(([t, label]) => (
                    <button
                      key={t}
                      onClick={() => handleTypeChange(t)}
                      className={`rounded-xl border px-3 py-2 text-xs sm:text-sm transition ${
                        activeType === t ? "bg-black text-white" : "bg-white hover:bg-neutral-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-1">Section Title</div>
                  <Input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder={getDefaultTitle(activeType)}
                  />
                </div>

                <div className="mt-4 rounded-xl border bg-neutral-50 p-4">
                  {activeType === "floor_tiling" && (
                    <FloorWallTilingForm
                      data={draftData as FloorTilingData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                      isWall={false}
                    />
                  )}
                  {activeType === "wall_tiling" && (
                    <FloorWallTilingForm
                      data={draftData as WallTilingData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                      isWall={true}
                    />
                  )}
                  {activeType === "staircase_tiling" && (
                    <StaircaseTilingForm
                      data={draftData as StaircaseTilingData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                    />
                  )}
                  {activeType === "bathroom_tiling" && (
                    <BathroomTilingForm
                      data={draftData as BathroomTilingData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                    />
                  )}
                  {activeType === "pantry_backsplash" && (
                    <PantryBacksplashForm
                      data={draftData as PantryBacksplashData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                    />
                  )}
                  {activeType === "other" && (
                    <OtherServiceForm
                      data={draftData as OtherServiceData}
                      onChange={(d) => setDraftData(d)}
                      onImageUpload={handleImageUpload}
                      uploading={uploading}
                    />
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={addSection}>+ Add This Service</Button>
                </div>
              </div>

              {sections.length > 0 && (
                <div className="rounded-2xl border bg-white p-4">
                  <div className="text-sm font-semibold mb-3">Added Services ({sections.length})</div>
                  <div className="space-y-2">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="flex items-center justify-between rounded-xl border bg-neutral-50 px-3 py-2">
                        <div>
                          <span className="text-sm font-medium">{idx + 1}. {sec.title}</span>
                          <span className="ml-2 text-xs text-neutral-500">
                            ({getDefaultTitle(sec.serviceType)})
                          </span>
                        </div>
                        <button
                          onClick={() => removeSection(sec.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button disabled={sections.length === 0} onClick={() => setStep(3)}>
                  Next → Review
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold mb-3">Preview</div>
                <pre className="whitespace-pre-wrap text-sm bg-neutral-50 rounded-xl p-4 border overflow-x-auto">
                  {previewText}
                </pre>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button disabled={saving} onClick={publish}>
                  {saving ? "Publishing..." : "Publish Task"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Page>
    </RequireAuth>
  );
}
