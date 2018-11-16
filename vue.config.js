module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.100.248:9988/',
        target: 'http://192.168.100.170:9988/',
        // target: 'http://192.168.100.82:9988/',

        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}