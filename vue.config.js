const webpack = require('webpack')

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('openlayers')
            .test(/\.es\.js$/)
            .use('babel-loader')
            .loader('babel-loader')
            .end()

        config.plugins
            .delete('case-sensitive-paths')
    }
}
  