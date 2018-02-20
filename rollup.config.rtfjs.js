import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'dist/rtfjs/index.js',
    output: {
        file: 'dist/rtf.bundle.js',
        format: 'umd',
        name: 'RTFJS',
        sourcemap: true
    },
    plugins: [
        resolve(),
        commonjs(),
        sourcemaps()
    ]
};
