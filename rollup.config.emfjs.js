import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'build/emfjs/index.js',
    output: {
        file: 'dist/emf.bundle.js',
        format: 'umd',
        name: 'EMFJS',
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
