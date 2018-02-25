var path = require("path");
var fs = require("fs");

var utils = require('./utils');

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

function runRtfjs(destRoot) {
    fs.readFile(path.join(destRoot, "source.rtf"), "utf8", function(err, data) {
        utils.runRtfjs(data, function (meta, html) {
            fs.writeFileSync(path.join(destRoot, "expected-metadata.json"), meta + "\n");
            fs.writeFileSync(path.join(destRoot, "expected.html"), html + "\n");
        })
    });
}
