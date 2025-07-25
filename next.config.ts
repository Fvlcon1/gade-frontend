import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['gade-account-profile-url.s3.amazonaws.com'],
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-left',
  },
};

export default nextConfig;
