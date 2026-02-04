import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'mdx'],
  sassOptions: {
    additionalData: '@use "@/styles/modules" as *;',
  },
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
