# rtf.js
Render RTF documents in HTML.  This also includes rendering WMF and EMF images which are often contained in RTF documents.

# License
The code of this project is licensed under the MIT license.  See the file LICENSE for details.

# Dependencies
* rtf.js requires:
  * [jquery](https://jquery.com/)
  * [js-codepage](https://github.com/SheetJS/js-codepage/) (Apache 2.0 license)
  * symboltable.js (provided in the sample directory)
* wmf.js and emf.js require:
  * [jquery](https://jquery.com/)
  * [jquery.svg.js plugin](https://github.com/kbwood/svg) with the jquery.svgfilter.js extension.
* Rendering WMF and EMF images is accomplished by using HTML5's `<svg>` feature.
* Rendering RTF documents often requires rendering embedded WMF and EMF images, however rtf.js can be used without wmf.js and emf.js or with just one of them, if rendering such images is not required.

# Live samples (original):
* [RTF document rendering](http://tbluemel.github.io/rtf.js/samples/rtf.html)
* [WMF image rendering](http://tbluemel.github.io/rtf.js/samples/wmf.html)
* [EMF image rendering](http://tbluemel.github.io/rtf.js/samples/emf.html)

# Live samples (modified in fork):
* [RTF document rendering](https://warren-bank.github.io/rtf.js/samples/01_rtf/rtf.html)
* [WMF image rendering](https://warren-bank.github.io/rtf.js/samples/02_wmf/wmf.html)
* [EMF image rendering](https://warren-bank.github.io/rtf.js/samples/03_emf/emf.html)
* [RTF document w/ external WMF image imports](https://warren-bank.github.io/rtf.js/samples/04_rtf_imports/rtf.html)
