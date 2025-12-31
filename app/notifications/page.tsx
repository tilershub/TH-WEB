"use client";

import { Page } from "@/components/Page";
import { RequireAuth } from "@/components/RequireAuth";

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <Page title="Notifications">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-xl font-bold mb-4">Notifications</h1>
          <div className="rounded-2xl border bg-white p-6 text-center text-neutral-500">
            <div className="text-4xl mb-3">🔔</div>
            <p>No notifications yet</p>
            <p className="text-sm mt-1">You'll see updates about your tasks and bids here</p>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
