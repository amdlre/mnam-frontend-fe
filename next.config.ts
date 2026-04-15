import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic memoization (stable in Next.js 16)
  // reactCompiler: true,
};

export default withNextIntl(nextConfig);
