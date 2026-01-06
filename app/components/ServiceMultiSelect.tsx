"use client";

import React from "react";

/**
 * ServiceMultiSelect renders a list of service options as selectable chips.
 * Users can select one or more services and the component will update
 * the selected list via the provided setSelected callback. Selected
 * services are highlighted for visual feedback.
 */
export type ServiceOption = {
  id: string;
  name: string;
};

interface ServiceMultiSelectProps {
  services: ServiceOption[];
  selected: string[];
  setSelected: (selected: string[]) => void;
}

export default function ServiceMultiSelect({
  services,
  selected,
  setSelected,
}: ServiceMultiSelectProps) {
  /**
   * Toggle the selection state of a given service. If the service is
   * already selected it will be removed, otherwise it will be added.
   */
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {services.map((service) => {
        const isSelected = selected.includes(service.id);
        return (
          <button
            key={service.id}
            type="button"
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              isSelected
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-black border-neutral-300"
            }`}
            onClick={() => toggle(service.id)}
          >
            {service.name}
          </button>
        );
      })}
    </div>
  );
}