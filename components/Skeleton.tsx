export function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTilerCard() {
  return (
    <div className="flex-shrink-0 w-40 card p-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className="flex-shrink-0 w-64 card animate-pulse">
      <div className="h-32 bg-gray-200 rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonGuideCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
