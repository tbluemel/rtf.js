# rtf.js
Render RTF documents in HTML.  This also includes rendering WMF images which are often contained in RTF documents.

# License
The code of this project is licensed under the MIT license.  See the file LICENSE for details.

# Dependencies
* Both rtf.js and wmf.js require [jquery](https://jquery.com/).
* Rendering WMF images is accomplished by using HTML5's <svg> feature, which means that wmf.js depends on the handy [jquery.svg.js plugin](https://github.com/kbwood/svg).
* Rendering RTF documents often requires rendering WMF images, however rtf.js can be used without wmf.js if rendering such images is not required.

# Live samples:
* RTF document rendering: http://tbluemel.github.io/rtf.js/samples/rtf.html
* WMF image rendering: http://tbluemel.github.io/rtf.js/samples/wmf.html
