/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [
      /**
       * Shopify Customer Account API redirects users to /{shopId}/account/...
       * after login through the hosted portal. This catches that pattern and
       * redirects to the correct /account/... path on our headless store.
       *
       * Source: https://peteora.com/99213639976/account/orders
       * Destination: https://peteora.com/account/orders
       */
      {
        source: '/:shopId(\\d+)/account',
        destination: '/account/orders',
        permanent: false,
      },
      {
        source: '/account/login',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/account/register',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/:shopId(\\d+)/account/:path*',
        destination: '/account/:path*',
        permanent: false,
      },
      /**
       * Also handle the Shopify authentication path that may redirect
       * to /{shopId}/... on our domain
       */
      {
        source: '/:shopId(\\d+)/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
