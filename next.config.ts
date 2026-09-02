import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
