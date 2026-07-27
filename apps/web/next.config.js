/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/contacts',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

module.exports = nextConfig;
