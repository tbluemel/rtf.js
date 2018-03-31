var path = require("path");
var fs = require("fs");

var utils = require('./utils');

if (process.argv.length < 4) {
    console.error("You have to provide the test type and test name as an argument.");
    process.exit(0);
    throw "Abort";
}
if (process.argv[2] !== "rtf" && process.argv[2] !== "emf" && process.argv[2] !== "wmf") {
    console.error("The test type has to be either rtf, emf or wmf.");
    process.exit(0);
    throw "Abort";
}

var testType = process.argv[2];
var testName = process.argv[3];

var destRoot = path.join(__dirname, testType + "-test-files", testName);

fs.stat(path.join(destRoot, "source." + testType), function(err) {
    if (err) {
        console.error("Testcase doesn't exist.");
        process.exit(1);
        return;
    }

    try {
        if (testType === "rtf"){
            fs.unlinkSync(path.join(destRoot, "expected.html"), (err) => {
            });
            fs.unlinkSync(path.join(destRoot, "expected-metadata.json"), (err) => {
            });
        } else if (testType === "emf" || testType === "wmf"){
            fs.unlinkSync(path.join(destRoot, "expected.svg"), (err) => {
            });
        }
    }catch (_ignore){}

    generateExpectedResult(destRoot);
});

function generateExpectedResult(destRoot) {
    if (testType === "rtf"){
        fs.readFile(path.join(destRoot, "source." + testType), "utf8", function(err, data) {
            utils.runRtfjs(destRoot, data, function (meta, html) {
                fs.writeFileSync(path.join(destRoot, "expected-metadata.json"), meta + "\n");
                fs.writeFileSync(path.join(destRoot, "expected.html"), html + "\n");
            })
        });
    } else if (testType === "emf"){
        fs.readFile(path.join(destRoot, "source." + testType), function(err, data) {
            utils.runEmfjs(data.buffer, function (svg) {
                fs.writeFileSync(path.join(destRoot, "expected.svg"), svg + "\n");
            })
        });
    } else if (testType === "wmf"){
        fs.readFile(path.join(destRoot, "source." + testType), function(err, data) {
            utils.runWmfjs(data.buffer, function (svg) {
                fs.writeFileSync(path.join(destRoot, "expected.svg"), svg + "\n");
            })
        });
    }
}
