"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import type { AvailabilityStatus } from "@/lib/types";

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

type Props = {
  availabilityStatus: AvailabilityStatus;
  workingDistricts: string[];
  yearsExperience: number | null;
  onStatusChange: (status: AvailabilityStatus) => void;
  onDistrictsChange: (districts: string[]) => void;
  onExperienceChange: (years: number | null) => void;
  disabled?: boolean;
};

export function AvailabilitySettings({
  availabilityStatus,
  workingDistricts,
  yearsExperience,
  onStatusChange,
  onDistrictsChange,
  onExperienceChange,
  disabled,
}: Props) {
  const [newDistrict, setNewDistrict] = useState("");

  const addDistrict = (district: string) => {
    if (district && !workingDistricts.includes(district)) {
      onDistrictsChange([...workingDistricts, district]);
    }
    setNewDistrict("");
  };

  const removeDistrict = (district: string) => {
    onDistrictsChange(workingDistricts.filter((d) => d !== district));
  };

  const statusColors = {
    available: "bg-green-100 text-green-800 border-green-200",
    busy: "bg-yellow-100 text-yellow-800 border-yellow-200",
    unavailable: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Availability Status</label>
        <p className="text-xs text-neutral-500 mb-3">Let homeowners know if you're available for new jobs</p>
        <div className="flex flex-wrap gap-2">
          {(["available", "busy", "unavailable"] as AvailabilityStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full border text-sm font-medium capitalize transition ${
                availabilityStatus === status
                  ? statusColors[status]
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {status === "available" && "Available"}
              {status === "busy" && "Busy (Limited Availability)"}
              {status === "unavailable" && "Not Taking Jobs"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Years of Experience</label>
        <p className="text-xs text-neutral-500 mb-3">How many years have you been tiling professionally?</p>
        <Input
          type="number"
          min="0"
          max="50"
          value={yearsExperience ?? ""}
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value) : null;
            onExperienceChange(val);
          }}
          placeholder="e.g., 5"
          className="max-w-32"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Working Areas (Districts)</label>
        <p className="text-xs text-neutral-500 mb-3">Select the districts where you offer your services</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {workingDistricts.map((district) => (
            <span
              key={district}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {district}
              <button
                type="button"
                onClick={() => removeDistrict(district)}
                disabled={disabled}
                className="ml-1 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {workingDistricts.length === 0 && (
            <span className="text-sm text-neutral-500">No districts selected</span>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            className="input-field flex-1"
            disabled={disabled}
          >
            <option value="">Select a district to add</option>
            {SRI_LANKA_DISTRICTS.filter((d) => !workingDistricts.includes(d)).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={() => addDistrict(newDistrict)}
            disabled={!newDistrict || disabled}
            variant="secondary"
          >
            Add
          </Button>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => onDistrictsChange(SRI_LANKA_DISTRICTS)}
            disabled={disabled}
            className="text-xs text-primary hover:underline"
          >
            Select all districts (Island-wide service)
          </button>
        </div>
      </div>
    </div>
  );
}
