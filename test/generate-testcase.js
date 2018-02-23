var path = require("path");
var fs = require("fs");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var pretty = require("pretty");

if (process.argv.length < 4) {
    console.error("You have to provide the test name and the path to a test file as arguments.");
    process.exit(0);
    throw "Abort";
}

var testName = process.argv[2];
var testFileSource = process.argv[3];

var destRoot = path.join(__dirname, "test-files", testName);

fs.mkdir(destRoot, function(err) {
    if (err) {
        console.error("Could not create testcase directory, does the testcase already exist?");
        process.exit(1);
        return;
    }

    fs.copyFile(testFileSource, path.join(destRoot, "source.rtf"), function (err) {
        if(err) {
           console.error("Could not copy '" + testFileSource + "' to the testcase directory.");
           console.error(err);
           process.exit(1);
           return;
        }
        runRtfjs(destRoot);
    });
});

function stringToBinaryArray(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function runRtfjs(destRoot) {
    fs.readFile(path.join(destRoot, "source.rtf"), "utf8", function(err, data) {
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
                window.rtfFile = stringToBinaryArray(data);
                window.done = function(meta, html){
                    storeResults(destRoot, meta, html);
                }
            }});
    });
}

function indentHtml(html) {
    return pretty(html, {
        indent_size: 4,
        unformatted: ['code', 'pre', 'em', 'strong']
    });
}

function storeResults(destRoot, meta, html) {
    fs.writeFileSync(path.join(destRoot, "expected-metadata.json"), JSON.stringify(meta, null, 4) + "\n");
    fs.writeFileSync(path.join(destRoot, "expected.html"), indentHtml(html));
}
