var jsdom = require("jsdom");
var { JSDOM } = jsdom;

function stringToBinaryArray(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

exports.runRtfjs = function(source, callback) {
    var dom = new JSDOM(`
    <script src="../samples/.common/dep/jquery.min.js"></script>

    <script src="../samples/.common/dep/jquery.svg.min.js"></script>
    <script src="../samples/.common/dep/jquery.svgfilter.min.js"></script>
    <script src="../samples/.common/dep/cptable.full.js"></script>
    <script src="../samples/.common/dep/symboltable.js"></script>

    <script src="../rtf.js"></script>
    <script src="../wmf.js"></script>
    <script src="../emf.js"></script>

    <script>
        RTFJS.loggingEnabled = false;
        WMFJS.loggingEnabled = false;
        EMFJS.loggingEnabled = false;
        var doc = new RTFJS.Document(rtfFile);

        var meta = doc.metadata();
        var html = $("<div>").append(doc.render()).html();

        window.done(meta, html);
    </script>
    `, { resources: "usable",
        runScripts: "dangerously",
        url: "file://" + __dirname + "/",
        beforeParse(window) {
            window.rtfFile = stringToBinaryArray(source);
            window.done = function(meta, html){
                callback(meta, html);
            }
        }});
}
