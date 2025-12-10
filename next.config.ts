import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" }, // Clerk 이미지
      { hostname: "api.visitkorea.or.kr" }, // 한국관광공사 이미지
      { hostname: "tong.visitkorea.or.kr" }, // 한국관광공사 이미지 (tong 도메인)
    ],
  },
  // 성능 최적화: 번들 분석 (ANALYZE=true pnpm build 시)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunks
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
      return config;
    },
  }),
};

export default nextConfig;
