/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/21-Day-Habit',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
