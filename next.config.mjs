/** @type {import('next').NextConfig} */

// When building for GitHub Pages (project page at https://<org>.github.io/file-glance/)
// the app is served from a sub-path, so basePath/assetPrefix must be set.
// Set via the GitHub Actions workflow (GITHUB_PAGES=true). Local dev keeps "/" root.
const isGithubPages = process.env.GITHUB_PAGES === "true"
const basePath = isGithubPages ? "/file-glance" : ""

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    // Exposed so server components (e.g. manifest, canonical link) can build absolute sub-paths
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
