/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Separate production output from running development sessions.
  distDir: process.env.NEXT_DIST_DIR || (process.env.NODE_ENV === 'production' ? '.next-release' : '.next'),
  poweredByHeader: false,
};

export default nextConfig;
