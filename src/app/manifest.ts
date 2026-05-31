import { description } from "@/constants"
import type { MetadataRoute } from "next"

// https://github.com/vercel/next.js/discussions/72221
export const dynamic = "force-static"

// Prefix with the deployment base path so PWA assets resolve under a sub-path
// (e.g. a GitHub Pages project page) as well as at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FileGlance",
    short_name: "FileGlance",
    description: description,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#22272b",
    orientation: "any",
    icons: [
      {
        src: `${basePath}/web-app-manifest-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${basePath}/web-app-manifest-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
