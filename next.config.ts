import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash — mock cover images during development
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Placeholder — mock partner logos during development
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Supabase Storage — real media once Supabase is wired up
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
