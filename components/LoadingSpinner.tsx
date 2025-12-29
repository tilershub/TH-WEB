export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-neutral-200 border-t-black ${sizeClasses[size]}`}
    ></div>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-2xl border bg-white p-8 text-center animate-fade-in">
        <LoadingSpinner size="lg" />
        <div className="mt-4 text-sm text-neutral-600">{message}</div>
      </div>
    </div>
  );
}
