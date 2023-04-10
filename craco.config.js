const path = require('path')
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}
