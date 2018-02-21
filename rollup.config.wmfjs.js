import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'build/wmfjs/index.js',
    output: {
        file: 'dist/wmf.bundle.js',
        format: 'umd',
        name: 'WMFJS',
        sourcemap: true
    },
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        console.log("Rollup warning: ", warning.message);
    },
    plugins: [
        sourcemaps()
    ]
};
