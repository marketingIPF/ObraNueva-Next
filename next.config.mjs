/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.inmobiliariapalanca.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
