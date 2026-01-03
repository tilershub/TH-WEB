"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>App Error</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
    </div>
  );
}