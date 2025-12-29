"use client";

import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import type { Certification } from "@/lib/types";
import { getPublicUrl } from "@/lib/storage";

type CertificationFormData = {
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  certificate_number: string;
  description: string;
  image?: File | null;
};

type CertificationManagerProps = {
  certifications: Certification[];
  onAdd: (data: CertificationFormData) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  disabled?: boolean;
};

export function CertificationManager({
  certifications,
  onAdd,
  onRemove,
  disabled = false,
}: CertificationManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CertificationFormData>({
    title: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    certificate_number: "",
    description: "",
    image: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      certificate_number: "",
      description: "",
      image: null,
    });
    setShowForm(false);
    setError(null);
  };

  const handleAdd = async () => {
    try {
      setError(null);

      if (!formData.title.trim()) {
        setError("Certification title is required");
        return;
      }
      if (!formData.issuer.trim()) {
        setError("Issuing organization is required");
        return;
      }
      if (!formData.issue_date) {
        setError("Issue date is required");
        return;
      }

      setSaving(true);
      await onAdd(formData);
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Failed to add certification");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm("Remove this certification?")) return;

    try {
      setSaving(true);
      await onRemove(id);
    } catch (err: any) {
      setError(err?.message || "Failed to remove certification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Certifications & Qualifications</h3>
        {!showForm && (
          <Button
            variant="secondary"
            onClick={() => setShowForm(true)}
            disabled={disabled}
            className="text-xs"
          >
            + Add Certification
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border bg-neutral-50 p-4 space-y-3 animate-slide-up">
          <div>
            <label className="text-sm font-medium">Certification Title *</label>
            <Input
              className="mt-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Certified Tile Installer"
              disabled={saving}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Issuing Organization *</label>
            <Input
              className="mt-2"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Sri Lanka Construction Industry Association"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Issue Date *</label>
              <Input
                type="date"
                className="mt-2"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                disabled={saving}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                type="date"
                className="mt-2"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Certificate Number</label>
            <Input
              className="mt-2"
              value={formData.certificate_number}
              onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
              placeholder="Certificate ID or number"
              disabled={saving}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              className="mt-2"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the certification..."
              disabled={saving}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Certificate Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 text-sm"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              disabled={saving}
            />
            {formData.image && (
              <div className="mt-2 text-xs text-neutral-600">
                Selected: {formData.image.name}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={resetForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? "Adding..." : "Add Certification"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {certifications.length === 0 && !showForm && (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-neutral-600">
            No certifications added yet. Add your qualifications to stand out!
          </div>
        )}

        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl border bg-white p-4 animate-fade-in"
          >
            <div className="flex items-start gap-4">
              {cert.image_path && (
                <div className="shrink-0">
                  <img
                    src={getPublicUrl("certifications", cert.image_path) || ""}
                    alt={cert.title}
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{cert.title}</h4>
                <p className="text-sm text-neutral-600 mt-1">{cert.issuer}</p>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
                  <span className="px-2 py-1 rounded-full bg-neutral-100">
                    Issued: {new Date(cert.issue_date).toLocaleDateString()}
                  </span>
                  {cert.expiry_date && (
                    <span className="px-2 py-1 rounded-full bg-neutral-100">
                      Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                    </span>
                  )}
                  {cert.certificate_number && (
                    <span className="px-2 py-1 rounded-full bg-neutral-100">
                      #{cert.certificate_number}
                    </span>
                  )}
                </div>

                {cert.description && (
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {cert.description}
                  </p>
                )}
              </div>

              <Button
                variant="secondary"
                className="text-xs shrink-0"
                onClick={() => handleRemove(cert.id)}
                disabled={saving || disabled}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
