import Link from "next/link";
import { useMemo } from "react";
import { getPublicUrl } from "@/lib/storage";

type Task = {
  id: string;
  title: string;
  description: string | null;
  location_text: string | null;
  status: "open" | "awarded" | "closed";
  created_at: string;
  budget_min?: number | null;
  budget_max?: number | null;
  cover_image?: string | null; // ✅ add this
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TaskCard({ task }: { task: Task }) {
  // Compute a full thumbnail URL. If the stored cover_image path is already a full
  // URL (begins with http/https), use it directly. Otherwise generate a
  // public URL via the Supabase storage helper. Memoize to avoid repeated
  // computation on re-renders.
  const thumbnailUrl = useMemo(() => {
    const path = task.cover_image;
    if (!path) return null;
    const lower = path.toLowerCase();
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return path;
    }
    // Convert storage path to full URL. If getPublicUrl returns null
    // (e.g. invalid path), return null so we fall back to placeholder.
    return getPublicUrl("task-images", path) ?? null;
  }, [task.cover_image]);

  return (
    <Link
      href={`/task/${task.id}`}
      className="card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt="Task thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy mb-1 truncate">{task.title}</h3>
          <p className="text-xs text-gray-600 mb-2">{timeAgo(task.created_at)}</p>

          {task.location_text && (
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{task.location_text}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            {task.budget_min && task.budget_max ? (
              <div className="font-bold text-navy">
                ${task.budget_min} - ${task.budget_max}
              </div>
            ) : (
              <div className="text-sm text-gray-600">Budget not specified</div>
            )}

            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {task.status === "open" ? "Open" : task.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}