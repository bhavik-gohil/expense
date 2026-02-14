/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/expense",
  assetPrefix: "/expense/",
  images: { unoptimized: true },
};

export default nextConfig;