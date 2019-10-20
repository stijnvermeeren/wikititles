const configureAPI = require('./src/server/configure')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  devServer: {
    before: configureAPI
  },
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  }
}
