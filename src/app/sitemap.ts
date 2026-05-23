import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://smartstepacademy.in", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://smartstepacademy.in/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
