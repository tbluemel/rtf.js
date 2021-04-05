const path = require('path');
const {merge} = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "@jsdevtools/coverage-istanbul-loader",
                        options: {
                            esModules: true
                        }
                    },
                    "ts-loader"
                ],
                include: [
                    path.resolve(__dirname, "../src"),
                    path.resolve(__dirname, "../node_modules/codepage")
                ]
            }
        ]
    }
});
