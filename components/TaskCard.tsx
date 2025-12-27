import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string | null;
  location_text: string | null;
  status: "open" | "awarded" | "closed";
  created_at: string;
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
  return (
    <Link
      href={`/task/${task.id}`}
      className="block border rounded-2xl p-4 bg-white hover:bg-neutral-50 transition"
    >
      <div className="flex justify-between gap-3">
        {/* Left */}
        <div className="min-w-0">
          <h3 className="font-semibold text-lg truncate">
            {task.title}
          </h3>

          <div className="mt-2 flex gap-2 flex-wrap text-xs">
            {task.location_text && (
              <span className="border rounded-full px-2 py-1">
                {task.location_text}
              </span>
            )}

            <span className="border rounded-full px-2 py-1 capitalize">
              {task.status}
            </span>
          </div>
        </div>

        {/* Right */}
        <span className="text-xs text-neutral-500 whitespace-nowrap">
          {timeAgo(task.created_at)}
        </span>
      </div>

      {task.description && (
        <p className="mt-3 text-sm text-neutral-700 line-clamp-2">
          {task.description}
        </p>
      )}
    </Link>
  );
}