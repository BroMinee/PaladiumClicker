/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: ".next",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
