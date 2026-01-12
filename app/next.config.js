/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  transpilePackages: [
    "@mui/x-data-grid",
    "@mui/x-date-pickers",
    "@mui/material",
    "@mui/system",
    "@mui/icons-material",
  ],
};

module.exports = nextConfig;
