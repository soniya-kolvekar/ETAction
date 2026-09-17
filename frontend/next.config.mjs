/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/network",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
