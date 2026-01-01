"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGuide, type GuideStep } from "@/lib/admin";
import { supabase } from "@/lib/supabaseClient";

const ICONS = ["home", "user", "edit", "scale", "droplet", "kitchen", "sun", "sparkle", "book", "tool"];

export default function NewGuidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "book",
    is_published: false,
  });
  const [steps, setSteps] = useState<GuideStep[]>([
    { title: "", content: [""] }
  ]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const addStep = () => {
    setSteps([...steps, { title: "", content: [""] }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStepTitle = (index: number, title: string) => {
    const newSteps = [...steps];
    newSteps[index].title = title;
    setSteps(newSteps);
  };

  const updateStepContent = (stepIndex: number, contentIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].content[contentIndex] = value;
    setSteps(newSteps);
  };

  const addContentItem = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].content.push("");
    setSteps(newSteps);
  };

  const removeContentItem = (stepIndex: number, contentIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].content = newSteps[stepIndex].content.filter((_, i) => i !== contentIndex);
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const validSteps = steps.filter(s => s.title.trim() && s.content.some(c => c.trim()));

    const { error } = await createGuide({
      ...form,
      slug: form.slug || generateSlug(form.title),
      steps: validSteps,
      author_id: user?.id,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/guides");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/guides" className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy">New Guide</h1>
          <p className="text-gray-600">Create a step-by-step how-to guide</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="font-semibold text-navy">Guide Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="How to..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">/guides/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Brief description of the guide..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy">Steps</h2>
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              + Add Step
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, stepIndex) => (
              <div key={stepIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Step {stepIndex + 1}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(stepIndex)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Step Title *</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStepTitle(stepIndex, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Enter step title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Content Points</label>
                    <button
                      type="button"
                      onClick={() => addContentItem(stepIndex)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      + Add Point
                    </button>
                  </div>
                  <div className="space-y-2">
                    {step.content.map((content, contentIndex) => (
                      <div key={contentIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={content}
                          onChange={(e) => updateStepContent(stepIndex, contentIndex, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                          placeholder="Enter content point"
                        />
                        {step.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContentItem(stepIndex, contentIndex)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>

            <div className="flex gap-3">
              <Link
                href="/admin/guides"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Guide"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
