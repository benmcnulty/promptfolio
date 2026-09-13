import createMDX from '@next/mdx';

const withMDX = createMDX();

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: { root: import.meta.dirname },
  experimental: { optimizePackageImports: ['@radix-ui/react-icons'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80, 88],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};

export default withMDX(nextConfig);
