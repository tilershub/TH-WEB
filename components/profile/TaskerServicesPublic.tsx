import { fetchTaskerOffersPublic } from "@/lib/servicesApi.server";
import { createSignedUrlsBatch } from "@/lib/storage.server";

interface TaskerServicesPublicProps {
  taskerId: string;
}

export default async function TaskerServicesPublic({ taskerId }: TaskerServicesPublicProps) {
  const offers = await fetchTaskerOffersPublic(taskerId);
  const imagePaths = offers.map((offer) => offer.image_path).filter(Boolean) as string[];
  const signedUrls = await createSignedUrlsBatch(imagePaths);

  const grouped = new Map<string, typeof offers>();
  offers.forEach((offer) => {
    const serviceId = offer.sub_services?.services?.id ?? "unknown";
    const items = grouped.get(serviceId) ?? [];
    items.push(offer);
    grouped.set(serviceId, items);
  });

  if (offers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 text-sm text-muted-foreground">
        No active services listed yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([serviceId, serviceOffers]) => {
        const serviceName = serviceOffers[0]?.sub_services?.services?.name ?? "Other";

        return (
          <div key={serviceId} className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold">{serviceName}</h2>
            <div className="mt-4 grid gap-4">
              {serviceOffers.map((offer) => {
                const signedUrl = offer.image_path
                  ? signedUrls.get(offer.image_path) ?? null
                  : null;

                return (
                  <div
                    key={offer.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">{offer.sub_services?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {offer.sub_services?.unit} · LKR {offer.price.toFixed(2)}
                      </p>
                    </div>
                    {signedUrl ? (
                      <img
                        src={signedUrl}
                        alt={offer.sub_services?.name ?? "Service image"}
                        className="h-20 w-28 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-28 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
