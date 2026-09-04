import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Routes are also referenced from mock data (activity feed, quick actions),
  // so hrefs are plain strings rather than the generated `Route` union.
  typedRoutes: false,

  // The dev server advertises `localhost`; without this, opening the app at
  // 127.0.0.1 or over the LAN makes Next reject the HMR socket as a
  // cross-origin dev request, and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1", "localhost", "[::1]"],
};

export default nextConfig;
