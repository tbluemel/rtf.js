import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'dist/rtfjs/index.js',
    output: {
        file: 'dist/rtf.bundle.js',
        format: 'umd',
        name: 'RTFJS'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
};
