"use client";

import { useMemo, useState } from "react";

import { createBrowserSupabase } from "@/lib/supabase/client";
import { Service, SubService, TaskerSubService } from "@/lib/types";

const BUCKET_NAME = "tasker-service-images";

type SubServicesEditorProps = {
  userId: string;
  service: Service;
  subServices: SubService[];
  existingOffers: TaskerSubService[];
  signedUrlMap: Record<string, string>;
};

type SubServiceState = {
  price: string;
  imagePath: string | null;
  previewUrl: string | null;
  isUploading: boolean;
};

export default function SubServicesEditor({
  userId,
  service,
  subServices,
  existingOffers,
  signedUrlMap,
}: SubServicesEditorProps) {
  const offerMap = useMemo(() => {
    return new Map(existingOffers.map((offer) => [offer.sub_service_id, offer]));
  }, [existingOffers]);

  const [formState, setFormState] = useState<Record<string, SubServiceState>>(() => {
    const initialState: Record<string, SubServiceState> = {};

    subServices.forEach((subService) => {
      const offer = offerMap.get(subService.id);
      initialState[subService.id] = {
        price: String(offer?.price ?? subService.default_price ?? ""),
        imagePath: offer?.image_path ?? null,
        previewUrl: offer?.image_path ? signedUrlMap[offer.image_path] ?? null : null,
        isUploading: false,
      };
    });

    return initialState;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = useMemo(() => createBrowserSupabase(), []);

  const handlePriceChange = (subServiceId: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        price: value,
      },
    }));
  };

  const handleFileChange = async (subServiceId: string, file: File | null) => {
    if (!file) return;

    setFormState((prev) => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        isUploading: true,
      },
    }));
    setErrorMessage(null);
    setSuccessMessage(null);

    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `taskers/${userId}/sub-services/${subServiceId}/${timestamp}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
      upsert: true,
    });

    if (error) {
      setErrorMessage(error.message);
      setFormState((prev) => ({
        ...prev,
        [subServiceId]: {
          ...prev[subServiceId],
          isUploading: false,
        },
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setFormState((prev) => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        imagePath: path,
        previewUrl,
        isUploading: false,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = subServices.map((subService) => {
      const state = formState[subService.id];
      const priceValue = Number(state.price);

      return {
        subServiceId: subService.id,
        isActive: true,
        price: Number.isFinite(priceValue) ? priceValue : null,
        imagePath: state.imagePath,
      };
    });

    const invalidPrice = payload.find((item) => item.price === null || item.price < 0);

    if (invalidPrice) {
      setErrorMessage("Please enter a valid price for all sub-services.");
      setIsSaving(false);
      return;
    }

    const response = await fetch("/api/tasker-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: service.id,
        offers: payload,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setErrorMessage(data?.error ?? "Failed to save services.");
      setIsSaving(false);
      return;
    }

    setSuccessMessage("Services updated successfully.");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 border-b border-border pb-2 text-xs font-semibold uppercase text-muted-foreground md:grid">
          <div>Category</div>
          <div>Service</div>
          <div>Scope/Location</div>
          <div>Qty/UOM</div>
          <div>Specs</div>
          <div>Rate (LKR)</div>
          <div>Media</div>
        </div>
        <div className="grid gap-4">
          {subServices.map((subService) => {
            const state = formState[subService.id];
            const displayUrl = state.previewUrl;

            return (
              <div
                key={subService.id}
                className="rounded-lg border border-border bg-background p-4 md:border-0 md:p-0 md:py-3 md:first:pt-4 md:last:pb-4"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Category
                    </p>
                    <p className="text-sm font-semibold text-foreground">{service.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Service
                    </p>
                    <p className="text-sm font-semibold text-foreground">{subService.name}</p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Scope/Location
                    </p>
                    <span>{subService.description || "No scope details"}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Qty/UOM
                    </p>
                    <span>{subService.unit}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Specs
                    </p>
                    <span>—</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Rate (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.price}
                      onChange={(event) => handlePriceChange(subService.id, event.target.value)}
                      className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm md:mt-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground md:hidden">
                      Media
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-xs"
                      onChange={(event) =>
                        handleFileChange(subService.id, event.target.files?.[0] ?? null)
                      }
                      disabled={state.isUploading}
                    />
                    {state.isUploading && (
                      <p className="text-xs text-muted-foreground">Uploading...</p>
                    )}
                    <p className="text-xs text-muted-foreground">Used in portfolio.</p>
                    <div className="flex items-center gap-3">
                      {displayUrl ? (
                        <img
                          src={displayUrl}
                          alt={`${subService.name} preview`}
                          className="h-16 w-20 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-20 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}
