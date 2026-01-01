import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile/setup", "/profile/edit"],
      },
    ],
    sitemap: "https://tilershub.com/sitemap.xml",
  };
}
