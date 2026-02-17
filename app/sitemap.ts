import { MetadataRoute } from "next";
import { services } from "@/lib/services-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tilershub.com";

  const staticPages = [
    "",
    "/services",
    "/portfolio",
    "/blog",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/services" ? 0.9 : 0.8,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries];
}
