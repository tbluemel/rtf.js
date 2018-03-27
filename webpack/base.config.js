const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    node: false,
    entry: {
        EMFJS: './src/emfjs/index.ts',
        RTFJS: './src/rtfjs/index.ts',
        WMFJS: './src/wmfjs/index.ts'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.ts', '.js' ],
        alias: {
            EMFJS:  path.resolve(__dirname, '../src/emfjs/index.ts'),
            WMFJS:  path.resolve(__dirname, '../src/wmfjs/index.ts'),
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        library: '[name]',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    externals: {
        EMFJS: {
            commonjs: './EMFJS.bundle.js',
            commonjs2: './EMFJS.bundle.js',
            amd: './EMFJS.bundle.js',
            root: 'EMFJS'
        },
        WMFJS: {
            commonjs: './WMFJS.bundle.js',
            commonjs2: './WMFJS.bundle.js',
            amd: './WMFJS.bundle.js',
            root: 'WMFJS'
        },
        jquery: {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: '$'
        },
        "jquery.svg": {
            commonjs: './jquery.svg',
            commonjs2: './jquery.svg',
            amd: './jquery.svg',
            root: '$'
        },
        "jquery.svgfilter": {
            commonjs: './jquery.svgfilter',
            commonjs2: './jquery.svgfilter',
            amd: './jquery.svgfilter',
            root: '$'
        }
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'vendor/jquery-svg', context: path.join(__dirname, '..')}])
    ],
    stats: {
        modules: false
    }
};
