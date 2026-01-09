import Link from "next/link";

import { createServerSupabase } from "@/lib/supabase/server";
import { fetchServices, fetchSubServices, fetchMyTaskerOffers } from "@/lib/servicesApi.server";
import { createSignedUrlsBatch } from "@/lib/storage.server";
import SubServicesEditor from "@/components/services/SubServicesEditor";

interface ServiceEditPageProps {
  params: { serviceId: string };
}

export default async function ServiceEditPage({ params }: ServiceEditPageProps) {
  const supabase = createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Manage Sub-services</h1>
        <p className="mt-4 text-sm text-muted-foreground">Please login to manage your services.</p>
      </div>
    );
  }

  const [services, subServices, taskerOffers] = await Promise.all([
    fetchServices(),
    fetchSubServices(params.serviceId),
    fetchMyTaskerOffers(),
  ]);

  const service = services.find((item) => item.id === params.serviceId);
  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Service not found</h1>
        <Link href="/dashboard/services" className="mt-4 inline-flex text-sm text-primary">
          Back to services
        </Link>
      </div>
    );
  }

  const relevantOffers = taskerOffers.filter((offer) =>
    subServices.some((sub) => sub.id === offer.sub_service_id)
  );
  const imagePaths = relevantOffers.map((offer) => offer.image_path).filter(Boolean) as string[];
  const signedUrls = await createSignedUrlsBatch(imagePaths);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/dashboard/services" className="text-xs text-muted-foreground">
            ← Back to services
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{service.name}</h1>
          <p className="text-sm text-muted-foreground">
            Update your offerings, prices, and images for each sub-service.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <SubServicesEditor
          userId={authData.user.id}
          service={service}
          subServices={subServices}
          existingOffers={relevantOffers}
          signedUrlMap={Object.fromEntries(signedUrls)}
        />
      </div>
    </div>
  );
}
