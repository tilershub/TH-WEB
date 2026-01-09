import Link from "next/link";

import { createServerSupabase } from "@/lib/supabase/server";
import { fetchServices } from "@/lib/servicesApi.server";

export default async function DashboardServicesPage() {
  const supabase = createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="mt-4 text-sm text-muted-foreground">Please login to manage your services.</p>
      </div>
    );
  }

  const services = await fetchServices();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Select Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a main service to manage your sub-services, prices, and images.
      </p>
      <div className="mt-6 grid gap-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/dashboard/services/${service.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium shadow-sm transition hover:border-primary"
          >
            <span>{service.name}</span>
            <span className="text-xs text-muted-foreground">Manage</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
