/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: 's3.localhost.localstack.cloud',
            port: '4566',
            pathname: '/data/**',
         },
      ],
   },
   experimental: {
      instrumentationHook: true,
   },
};

export default nextConfig;
