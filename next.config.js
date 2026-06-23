/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sunnysliderentals.com',
      },
      {
        protocol: 'https',
        hostname: 'vibe.filesafe.space',
      },
    ],
  },
};

module.exports = nextConfig;
