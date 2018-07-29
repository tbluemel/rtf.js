# Change Log

## [2.3.1] - 2018-07-29
- Fix picture rendering issues

## [2.3.0] - 2018-05-05
- Added minified bundles

## [2.2.1] - 2018-03-29
- Added getting started guide

## [2.2.0] - 2018-03-29
- Publish typings with npm package

## [2.1.0] - 2018-03-28
- support importing rtf.js as a module
- rtf.js is now published on npm: https://www.npmjs.com/package/rtf.js

## [2.0] - 2018-02-24
- rtf.js, wmf.js and emf.js are now in the `build` directory and named rtf.bundle.js, wmf.bundle.js and emf.bundle.js
- wmf.bundle.js and emf.bundle.js have to be loaded before rtf.bundle.js
- `loggingEnabled` used to be exposed as a property (RTFJS.loggingEnabled in rtf.js, same for wmf.js and emf.js), it is now a function which accepts a boolean value. The default is still true.
- rtf.js now requires a `Promise` polyfill to work on older browsers which don't support `Promise` (e.g. IE 11).
- The rtf.bundle.js file now contains both Symboltable.js and cptables.js so these files no longer have to be loaded manually through separate script tags.
- rtf.js `Document.render()` now returns a `Promise` which returns the generated HTML once it is fulfilled (see samples).

## [1.0] - 2018-02-19
- Stable
- ES5 compatible
- Supports IE 11
