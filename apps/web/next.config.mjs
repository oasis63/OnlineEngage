/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@anonchat/ui', '@anonchat/shared', '@anonchat/types'],
};

export default nextConfig;
