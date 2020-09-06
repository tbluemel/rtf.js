const path = require('path');
const {merge} = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    output: {
        filename: '[name].bundle.min.js'
    },
    optimization: {
        minimize: true
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
