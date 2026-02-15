/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
