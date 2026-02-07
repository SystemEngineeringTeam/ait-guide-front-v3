import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error('API_URL is not defined in environment variables');

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'mdx'],
  sassOptions: {
    additionalData: '@use "@/styles/modules" as *;',
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${API_URL}/api/:path*`,
    },
  ],
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
