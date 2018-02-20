export default {
    input: 'dist/wmfjs/index.js',
    output: {
        file: 'dist/wmf.bundle.js',
        format: 'umd',
        name: 'WMFJS'
    },
    onwarn: function (warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        console.log("Rollup warning: ", warning.message);
    }
};
