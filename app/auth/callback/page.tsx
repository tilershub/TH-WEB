import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic"; // prevents static prerender issues

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <CallbackClient />
    </Suspense>
  );
}