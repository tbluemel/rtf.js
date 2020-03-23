This guide shows how to use the library to render a basic rtf file

# Loading rtf.js as a script
## Prerequisites
- Include a promise polyfill if you have to support older browsers

## Code
Put the following code into a html file:
```html
<script src="../vendor/WMFJS.bundle.js"></script>
<script src="../vendor/EMFJS.bundle.js"></script>
<script src="../vendor/RTFJS.bundle.js"></script>

<script>
const rtf = 
    `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
    {\\*\\generator Msftedit 5.41.21.2510;}\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang9\\f0\\fs22 This \\fs44 is \\fs22 a \\b simple \\ul one \\i paragraph \\ulnone\\b0 document\\i0 .\\par
    }`;

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

RTFJS.loggingEnabled(false);
WMFJS.loggingEnabled(false);
EMFJS.loggingEnabled(false);

const doc = new RTFJS.Document(stringToArrayBuffer(rtf));

const meta = doc.metadata();
doc.render().then(function(htmlElements) {
    console.log(meta);
    console.log(htmlElements);
}).catch(error => console.error(error))
</script>
```

# Importing rtf.js as a module
## Prerequisites
- Install rtf.js from npm (`npm install rtf.js`)

## Code
```javascript
import {EMFJS, RTFJS, WMFJS} from 'rtf.js';

const rtf = 
    `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
    {\\*\\generator Msftedit 5.41.21.2510;}\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang9\\f0\\fs22 This \\fs44 is \\fs22 a \\b simple \\ul one \\i paragraph \\ulnone\\b0 document\\i0 .\\par
    }`;

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

RTFJS.loggingEnabled(false);
WMFJS.loggingEnabled(false);
EMFJS.loggingEnabled(false);

const doc = new RTFJS.Document(stringToArrayBuffer(rtf));

const meta = doc.metadata();
doc.render().then(function(htmlElements) {
    console.log(meta);
    console.log(htmlElements);
}).catch(error => console.error(error))
```

# Importing rtf.js as a module (Typescript)
## Prerequisites
- Install rtf.js from npm (`npm install rtf.js`)
- Disable lib check in `tsconfig.json` (add `"skipLibCheck": true`)

## Code
```typescript
import {EMFJS, RTFJS, WMFJS} from 'rtf.js';

const rtf: string = 
    `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
    {\\*\\generator Msftedit 5.41.21.2510;}\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang9\\f0\\fs22 This \\fs44 is \\fs22 a \\b simple \\ul one \\i paragraph \\ulnone\\b0 document\\i0 .\\par
    }`;

function stringToArrayBuffer(string: string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

RTFJS.loggingEnabled(false);
WMFJS.loggingEnabled(false);
EMFJS.loggingEnabled(false);

const doc = new RTFJS.Document(stringToArrayBuffer(rtf));

const meta = doc.metadata();
doc.render().then(function(htmlElements) {
    console.log(meta);
    console.log(htmlElements);
}).catch(error => console.error(error))
```

# Node (using jsdom)
## Prerequisites
- Install rtf.js and jsdom from npm (`npm install rtf.js jsdom`)

## Code
This is a minimal example for wrapper around rtf.js and jsdom:
```javascript
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

exports.runRtfjs = function(rtf, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    var dom = new JSDOM(`
    <script src="./node_modules/rtf.js/dist/WMFJS.bundle.js"></script>
    <script src="./node_modules/rtf.js/dist/EMFJS.bundle.js"></script>
    <script src="./node_modules/rtf.js/dist/RTFJS.bundle.js"></script>

    <script>
        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);

        try {
            var doc = new RTFJS.Document(rtfFile);
    
            var meta = doc.metadata();
            doc.render().then(function(htmlElements) {
                var html = $("<div>").append(htmlElements).html();
    
                window.done(meta, html);
            }).catch(error => window.onerror(error))
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.rtfFile = stringToArrayBuffer(rtf);
            window.done = function(meta, html){
                callback(meta, html);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
        }});
}
```
