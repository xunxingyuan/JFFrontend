module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.100.248:9988/',
        // target: 'http://192.168.100.128:9988/',
        // target: 'http://192.168.100.82:9988/',

        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.extractComments = true
      config.optimization.minimizer[0].options.uglifyOptions.output.comments = false
    }
  }
}