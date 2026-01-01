import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tilershub.com";
  
  const staticPages = [
    "",
    "/home",
    "/tilers",
    "/blog",
    "/guides",
    "/post-task",
    "/login",
    "/signup",
  ];

  const services = [
    "floor-tiling",
    "wall-tiling",
    "staircase-tiling",
    "bathroom-tiling",
    "pantry-backsplash",
    "waterproofing",
    "screed",
    "demolition",
    "nosing",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" || path === "/home" ? 1 : 0.8,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries];
}
