import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jolarme.pt",
        pathname: "/back/fotos/**",
      },
    ],
  },
};

export default nextConfig;
