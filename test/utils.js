var jsdom = require("jsdom");
var {JSDOM} = jsdom;
var $_$twiz = require('typewiz-core/dist/type-collector-snippet').$_$twiz;
global.__coverage__ = {};

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function indentHtml(rawHtml) {
    return rawHtml
        .replace(/</g, "\n<")
        .replace("\n", "");
}

exports.runRtfjs = function (path, source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    new JSDOM(`
    <script src="../dist/WMFJS.bundle.js"></script>
    <script src="../dist/EMFJS.bundle.js"></script>
    <script src="../dist/RTFJS.bundle.js"></script>

    <script>
        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);

        const baseURL = path + "/";
        const settings = {
            onImport: function(relURL, cb) {
                const file = baseURL + relURL;
                const ext  = relURL.replace(/^.*\\.([^\\.]+)$/, '$1').toLowerCase();
                let keyword;
                switch(ext) {
                    case 'emf':
                        keyword = 'emfblip';
                        break;
                    case 'wmf':
                        keyword = 'wmetafile';
                        break;
                    default:
                        return cb({error});
                }

                const request = new XMLHttpRequest();
                request.open("GET", file, true);
                request.responseType = "arraybuffer";

                request.onload = function (event) {
                    const blob = request.response;
                    if (blob) {
                        let height = 300;
                        cb({keyword, blob, height});
                    } else {
                        let error = new Error(request.statusText);
                        cb({error});
                    }
                };

                request.send(null);
            }
        };

        try {
            const doc = new RTFJS.Document(rtfFile, settings);

            const meta = doc.metadata();
            doc.render().then(function(htmlElements) {
                const div = document.createElement("div");
                div.append(...htmlElements);

                window.done(meta, div.innerHTML);
            }).catch(error => window.onerror(error))
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, {
        resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.path = path;
            window.rtfFile = stringToArrayBuffer(source);
            window.done = function (meta, html) {
                callback(JSON.stringify(meta, null, 4), indentHtml(html), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
            window.__coverage__ = global.__coverage__;
        }
    });
};

exports.runEmfjs = function (source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    new JSDOM(`
    <script src="../dist/EMFJS.bundle.js"></script>

    <script>
        EMFJS.loggingEnabled(false);

        try {
            const width = 600;
            const height = 400;
            const settings = {
                width: width + "px",
                height: height + "px",
                wExt: width,
                hExt: height,
                xExt: width,
                yExt: height,
                mapMode: 8 // preserve aspect ratio
            };

            const renderer = new EMFJS.Renderer(emfFile);
            const svg = renderer.render(settings).innerHTML;

            window.done(svg);
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, {
        resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.emfFile = source;
            window.done = function (svg) {
                callback(indentHtml(svg), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
            window.__coverage__ = global.__coverage__;
        }
    });
};

exports.runWmfjs = function (source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    new JSDOM(`
    <script src="../dist/WMFJS.bundle.js"></script>

    <script>
        WMFJS.loggingEnabled(false);

        try {
            const width = 600;
            const height = 400;
            const settings = {
                width: width + "px",
                height: height + "px",
                xExt: width,
                yExt: height,
                mapMode: 8 // preserve aspect ratio
            };

            const renderer = new WMFJS.Renderer(wmfFile);
            const svg = renderer.render(settings).innerHTML;

            window.done(svg);
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, {
        resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.wmfFile = source;
            window.done = function (svg) {
                callback(indentHtml(svg), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
            window.__coverage__ = global.__coverage__;
        }
    });
};
