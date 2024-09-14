/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("encoding", "pino-pretty");
    return config;
  },
};

export default nextConfig;
