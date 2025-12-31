"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { SERVICES } from "@/lib/services";
import type { PortfolioItem } from "@/lib/types";
import { uploadFile, getPublicUrl, generateFilePath } from "@/lib/storage";

type Props = {
  tilerId: string;
  disabled?: boolean;
};

export function PortfolioManager({ tilerId, disabled }: Props) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service_type: "",
    location: "",
    completed_date: "",
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, [tilerId]);

  const loadPortfolio = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tiler_portfolio")
      .select("*")
      .eq("tiler_id", tilerId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    setItems((data ?? []) as PortfolioItem[]);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      service_type: "",
      location: "",
      completed_date: "",
      is_featured: false,
    });
    setImageFile(null);
    setBeforeImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      if (!imageFile) {
        setMsg("Please select a main image");
        setSaving(false);
        return;
      }

      if (!formData.title.trim()) {
        setMsg("Please enter a title");
        setSaving(false);
        return;
      }

      const imagePath = generateFilePath(tilerId, "portfolio", imageFile);
      const uploadedImagePath = await uploadFile("tiler-portfolio", imagePath, imageFile);

      let beforePath = null;
      if (beforeImageFile) {
        const beforeImagePath = generateFilePath(tilerId, "portfolio-before", beforeImageFile);
        beforePath = await uploadFile("tiler-portfolio", beforeImagePath, beforeImageFile);
      }

      const { error } = await supabase.from("tiler_portfolio").insert({
        tiler_id: tilerId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        service_type: formData.service_type || null,
        location: formData.location.trim() || null,
        completed_date: formData.completed_date || null,
        image_path: uploadedImagePath,
        before_image_path: beforePath,
        is_featured: formData.is_featured,
      });

      if (error) throw error;

      setMsg("Portfolio item added successfully");
      await loadPortfolio();
      resetForm();
    } catch (error: any) {
      setMsg(error.message || "Failed to add portfolio item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    const { error } = await supabase
      .from("tiler_portfolio")
      .delete()
      .eq("id", id);

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Portfolio item deleted");
      await loadPortfolio();
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("tiler_portfolio")
      .update({ is_featured: !currentValue })
      .eq("id", id);

    if (!error) {
      await loadPortfolio();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Gallery</h3>
          <p className="text-sm text-neutral-600">Showcase your best work to attract homeowners</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} disabled={disabled}>
          {showForm ? "Cancel" : "+ Add Work Sample"}
        </Button>
      </div>

      {msg && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          {msg}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border bg-white p-4 md:p-6">
          <h4 className="font-semibold mb-4">Add Portfolio Item</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Title <span className="text-red-600">*</span>
              </label>
              <Input
                className="mt-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Modern Bathroom Renovation"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Service Type</label>
                <select
                  className="mt-2 input-field w-full"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                >
                  <option value="">Select service type</option>
                  {SERVICES.map((svc) => (
                    <option key={svc.key} value={svc.key}>{svc.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  className="mt-2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Colombo 7"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Completion Date</label>
                <Input
                  className="mt-2"
                  type="date"
                  value={formData.completed_date}
                  onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Featured (show first)
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="mt-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project, materials used, challenges overcome..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Main Photo <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 h-32 rounded-xl overflow-hidden border bg-neutral-100">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  className="mt-2 text-sm w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Before Photo (optional)</label>
                <div className="mt-2 h-32 rounded-xl overflow-hidden border bg-neutral-100">
                  {beforeImageFile ? (
                    <img
                      src={URL.createObjectURL(beforeImageFile)}
                      alt="Before Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  className="mt-2 text-sm w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeforeImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Adding..." : "Add to Portfolio"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-neutral-600">Loading portfolio...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-neutral-600">
          <svg className="w-12 h-12 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No portfolio items yet. Add your first work sample to showcase your skills!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-white overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={getPublicUrl("tiler-portfolio", item.image_path) || ""}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-semibold">{item.title}</h4>
                {item.service_type && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {SERVICES.find(s => s.key === item.service_type)?.label || item.service_type}
                  </p>
                )}
                {item.location && (
                  <p className="text-xs text-neutral-500 mt-1">{item.location}</p>
                )}
                {item.description && (
                  <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{item.description}</p>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className="text-xs text-primary hover:underline"
                    disabled={disabled}
                  >
                    {item.is_featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-600 hover:underline"
                    disabled={disabled}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
