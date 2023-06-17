/* eslint-disable no-undef */
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['react-syntax-highlighter'])

module.exports = withPlugins([withTM], {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
      }
    }

    return config
  },
  env: {
    MONGODB_URI: 'mongodb://localhost:27017',
    customKey: 'write posts in next.js',
  },
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
        has: [{ type: 'query', key: 'test', value: 'rewrite' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/aboutme',
        destination: '/',
        permanent: true,
      },
    ]
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
  distDir: 'build',
  devIndicators: {
    buildActivityPosition: 'top-right',
  },
})
