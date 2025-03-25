import path from 'path';
import { fileURLToPath } from 'url';

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'www.informatik.tu-darmstadt.de',
      'www.cs.tu-dortmund.de',
      'www.iais.fraunhofer.de',
      'www.uni-bamberg.de',
      'www.dfki.de',
      'ui-avatars.com',
      'logo.clearbit.com',
      'example.com'
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  transpilePackages: ['bcrypt'],
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    // Ignore HTML files from @mapbox/node-pre-gyp
    config.module.rules.unshift({
      test: /node_modules[\\/]@mapbox[\\/]node-pre-gyp[\\/].*\.html$/,
      type: 'asset/resource',
    })
    
    // Ignore C# files from node-gyp
    config.module.rules.unshift({
      test: /\.cs$/,
      type: 'asset/resource',
    })
    
    // Handle node: protocol imports
    config.module.rules.unshift({
      test: /\.js$/,
      issuer: /node_modules/,
      resolve: {
        fullySpecified: false,
        fallback: {
          assert: 'assert',
          buffer: 'buffer',
          util: 'util',
          stream: 'stream-browserify',
          path: 'path-browserify',
          crypto: 'crypto-browserify',
          fs: false
        }
      }
    })
    
    config.resolve = config.resolve || {}
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': path.resolve(__dirname, 'lib'),
      'node:assert': 'assert',
      'node:buffer': 'buffer',
      'node:util': 'util',
      'node:stream': 'stream-browserify',
      'node:path': 'path-browserify',
      'node:crypto': 'crypto-browserify',
      'node:fs': false,
      'node:os': false
    }
    
    // Polyfill Node.js core modules for bcrypt and other native modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        url: false,
        zlib: false,
        querystring: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'timers/promises': false,
        'mock-aws-s3': 'mock-aws-s3',
        'aws-sdk': false,
        'nock': false
      }
    }
    return config
  }
}
