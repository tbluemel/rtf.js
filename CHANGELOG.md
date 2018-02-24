# Change Log

## [2.0] - 2018-02-24
- rtf.js, wmf.js and emf.js are now in the `build` directory and named rtf.bundle.js, wmf.bundle.js and emf.bundle.js
- The rtf.bundle.js file now contains both Symboltable.js and cptables.js so these files no longer have to be loaded manually through separate script tags.
- `loggingEnabled` used to be exposed as a property (RTFJS.loggingEnabled in rtf.js, same for wmf.js and emf.js), it is now a function which accepts a boolean value. The default is still true.

## [1.0] - 2018-02-19
- Stable
- ES5 compatible
- Supports IE 11
