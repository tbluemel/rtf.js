import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'build/rtfjs/index.js',
    output: {
        file: 'dist/rtf.bundle.js',
        format: 'umd',
        name: 'RTFJS',
        sourcemap: true
    },
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        console.log("Rollup warning: ", warning.message);
    },
    plugins: [
        resolve(),
        commonjs(),
        sourcemaps()
    ]
};
