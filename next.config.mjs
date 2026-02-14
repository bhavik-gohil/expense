/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/expense",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;