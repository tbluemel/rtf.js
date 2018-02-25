var path = require("path");
var fs = require("fs");

var utils = require('./utils');

if (process.argv.length < 3) {
    console.error("You have to provide the test name as an argument.");
    process.exit(0);
    throw "Abort";
}

var testName = process.argv[2];

var destRoot = path.join(__dirname, "test-files", testName);

fs.stat(path.join(destRoot, "source.rtf"), function(err) {
    if (err) {
        console.error("Testcase doesn't exist.");
        process.exit(1);
        return;
    }

    try {
        fs.unlinkSync(path.join(destRoot, "expected.html"), (err) => {
        });
        fs.unlinkSync(path.join(destRoot, "expected-metadata.json"), (err) => {
        });
    }catch (_ignore){}

    runRtfjs(destRoot);
});

function runRtfjs(destRoot) {
    fs.readFile(path.join(destRoot, "source.rtf"), "utf8", function(err, data) {
        utils.runRtfjs(data, function (meta, html) {
            fs.writeFileSync(path.join(destRoot, "expected-metadata.json"), meta + "\n");
            fs.writeFileSync(path.join(destRoot, "expected.html"), html + "\n");
        })
    });
}
