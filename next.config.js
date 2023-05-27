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
})
