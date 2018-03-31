var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var $_$twiz = require('typewiz/dist/type-collector-snippet').$_$twiz;

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function indentHtml(rawHtml) {
    return rawHtml
        .replace(/</g, "\n<")
        .replace("\n", "");
}

exports.runRtfjs = function(path, source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    var dom = new JSDOM(`
    <script src="../samples/.common/dep/jquery.min.js"></script>

    <script src="../samples/.common/dep/jquery.svg.min.js"></script>
    <script src="../samples/.common/dep/jquery.svgfilter.min.js"></script>

    <script src="../dist/WMFJS.bundle.js"></script>
    <script src="../dist/EMFJS.bundle.js"></script>
    <script src="../dist/RTFJS.bundle.js"></script>

    <script>
        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);

        var baseURL = path + "/";
        var settings = {
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

                var request = new XMLHttpRequest();
                request.open("GET", file, true);
                request.responseType = "arraybuffer";

                request.onload = function (event) {
                    var blob = request.response;
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
        }

        try {
            var doc = new RTFJS.Document(rtfFile, settings);
    
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
            window.path = path;
            window.rtfFile = stringToArrayBuffer(source);
            window.done = function(meta, html){
                callback(JSON.stringify(meta, null, 4), indentHtml(html), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            // Catch exceptions from jquery.svg.min.js
            window.alert = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
        }});
};

exports.runEmfjs = function(source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    var dom = new JSDOM(`
    <script src="../samples/.common/dep/jquery.min.js"></script>

    <script src="../samples/.common/dep/jquery.svg.min.js"></script>
    <script src="../samples/.common/dep/jquery.svgfilter.min.js"></script>

    <script src="../dist/EMFJS.bundle.js"></script>

    <script>
        EMFJS.loggingEnabled(false);

        try {
            var width = 600;
            var height = 400;
            var settings = {
                width: width + "px",
                height: height + "px",
                wExt: width,
                hExt: height,
                xExt: width,
                yExt: height,
                mapMode: 8 // preserve aspect ratio
            };
            
            var renderer = new EMFJS.Renderer(emfFile);
            var svg = renderer.render(settings).html();
            
            window.done(svg);
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.emfFile = source;
            window.done = function(svg){
                callback(indentHtml(svg), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            // Catch exceptions from jquery.svg.min.js
            window.alert = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
        }});
};

exports.runWmfjs = function(source, callback, errorCallback) {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(console);

    var dom = new JSDOM(`
    <script src="../samples/.common/dep/jquery.min.js"></script>

    <script src="../samples/.common/dep/jquery.svg.min.js"></script>
    <script src="../samples/.common/dep/jquery.svgfilter.min.js"></script>

    <script src="../dist/WMFJS.bundle.js"></script>

    <script>
        WMFJS.loggingEnabled(false);

        try {
            var width = 600;
            var height = 400;
            var settings = {
                width: width + "px",
                height: height + "px",
                xExt: width,
                yExt: height,
                mapMode: 8 // preserve aspect ratio
            };
            
            var renderer = new WMFJS.Renderer(wmfFile);
            var svg = renderer.render(settings).html();
            
            window.done(svg);
        } catch (error){
            window.onerror(error)
        }
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        virtualConsole,
        beforeParse(window) {
            window.wmfFile = source;
            window.done = function(svg){
                callback(indentHtml(svg), $_$twiz);
            };
            window.onerror = function (error) {
                errorCallback(error)
            };
            // Catch exceptions from jquery.svg.min.js
            window.alert = function (error) {
                errorCallback(error)
            };
            window.$_$twiz = $_$twiz;
        }});
};
