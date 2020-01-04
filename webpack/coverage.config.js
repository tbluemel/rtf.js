const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "coverage-istanbul-loader",
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
