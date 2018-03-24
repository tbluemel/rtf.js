const path = require('path');

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
        libraryTarget: 'umd'
    },
    externals: {
        EMFJS: 'EMFJS',
        WMFJS: 'WMFJS'
    },
    stats: {
        modules: false
    }
};
