var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var html = require("html");

function stringToBinaryArray(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function indentHtml(rawHtml) {
    return html.prettyPrint(rawHtml, {
        indent_size: 2
    });
}

exports.runRtfjs = function(source, callback) {
    var dom = new JSDOM(`
    <script src="../samples/.common/dep/jquery.min.js"></script>

    <script src="../samples/.common/dep/jquery.svg.min.js"></script>
    <script src="../samples/.common/dep/jquery.svgfilter.min.js"></script>

    <script src="../dist/rtf.bundle.js"></script>
    <script src="../dist/wmf.bundle.js"></script>
    <script src="../dist/emf.bundle.js"></script>

    <script>
        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);
        var doc = new RTFJS.Document(rtfFile);

        var meta = doc.metadata();
        doc.render().then(function(htmlElements) {
            var html = $("<div>").append(htmlElements).html();

            window.done(meta, html);
        })
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        beforeParse(window) {
            window.rtfFile = stringToBinaryArray(source);
            window.done = function(meta, html){
                callback(JSON.stringify(meta, null, 4), indentHtml(html));
            }
        }});
}
