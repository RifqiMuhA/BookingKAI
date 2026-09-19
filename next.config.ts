import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/search-results",
        destination: "/cari",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
