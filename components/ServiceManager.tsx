"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

type TilerService = {
  id: string;
  service_name: string;
  area_type: string | null;
  tile_size: string | null;
  unit: string;
  price: number;
  description: string | null;
  image_path: string | null;
  is_active: boolean;
};

export default function ServiceManager({ tilerId }: { tilerId: string }) {
  const [services, setServices] = useState<TilerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    service_name: "",
    area_type: "",
    tile_size: "",
    unit: "square foot",
    price: "",
    description: "",
  });

  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, [tilerId]);

  const loadServices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tiler_services")
      .select("*")
      .eq("tiler_id", tilerId)
      .order("created_at", { ascending: false });

    setServices((data ?? []) as TilerService[]);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      service_name: "",
      area_type: "",
      tile_size: "",
      unit: "square foot",
      price: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (service: TilerService) => {
    setFormData({
      service_name: service.service_name,
      area_type: service.area_type || "",
      tile_size: service.tile_size || "",
      unit: service.unit,
      price: service.price.toString(),
      description: service.description || "",
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setMsg("Please enter a valid price");
        setSaving(false);
        return;
      }

      const payload = {
        tiler_id: tilerId,
        service_name: formData.service_name.trim(),
        area_type: formData.area_type.trim() || null,
        tile_size: formData.tile_size.trim() || null,
        unit: formData.unit,
        price,
        description: formData.description.trim() || null,
        is_active: true,
      };

      if (editingId) {
        const { error } = await supabase
          .from("tiler_services")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        setMsg("Service updated successfully");
      } else {
        const { error } = await supabase
          .from("tiler_services")
          .insert([payload]);

        if (error) throw error;
        setMsg("Service added successfully");
      }

      await loadServices();
      resetForm();
    } catch (error: any) {
      setMsg(error.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase
      .from("tiler_services")
      .delete()
      .eq("id", id);

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Service deleted");
      await loadServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">My Services</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Service"}
        </Button>
      </div>

      {msg && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          {msg}
        </div>
      )}

      {showForm && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-navy mb-4">
            {editingId ? "Edit Service" : "Add New Service"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <Input
                value={formData.service_name}
                onChange={(e) =>
                  setFormData({ ...formData, service_name: e.target.value })
                }
                placeholder="e.g., Tiling, Bathroom Tiling, Floor Tiling"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Type
                </label>
                <Input
                  value={formData.area_type}
                  onChange={(e) =>
                    setFormData({ ...formData, area_type: e.target.value })
                  }
                  placeholder="e.g., Ground Floor, Bathroom, Kitchen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tile Size
                </label>
                <Input
                  value={formData.tile_size}
                  onChange={(e) =>
                    setFormData({ ...formData, tile_size: e.target.value })
                  }
                  placeholder="e.g., 2x2, 600x600mm, 12x24"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (LKR) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., 120"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  className="input-field"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  required
                >
                  <option value="square foot">square foot</option>
                  <option value="linear foot">linear foot</option>
                  <option value="job">per job</option>
                  <option value="hour">per hour</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add any additional details about this service..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Service" : "Add Service"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="card p-8 text-center text-gray-600">
          <p>No services added yet. Click "Add Service" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy">{service.service_name}</h3>
                  {service.area_type && (
                    <p className="text-sm text-gray-600 mt-1">{service.area_type}</p>
                  )}
                  {service.tile_size && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tile Size: {service.tile_size}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="text-xl font-bold text-primary">
                      LKR {service.price.toLocaleString("en-LK")}
                    </span>
                    <span className="text-xs text-gray-600 ml-2">
                      per {service.unit}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-sm text-red-600 hover:underline"
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
