const path = require('path');
const {merge} = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        devMiddleware: {
            publicPath: '/dist/'
        },
        static: path.resolve(__dirname, '../samples')
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                include: [
                    path.resolve(__dirname, "../src"),
                    path.resolve(__dirname, "../node_modules/codepage")
                ]
            }
        ]
    }
});
