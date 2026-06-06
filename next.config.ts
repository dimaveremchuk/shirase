import type { NextConfig } from "next";

// SVG icon convention: /src/assets/icons/
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: { typescript: true, memo: true },
          },
        ],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: RegExp }) => rule.test?.test?.('.svg'),
    )
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i

    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: '@svgr/webpack', options: { typescript: true, memo: true } }],
    })

    return config
  },
}

export default nextConfig;
