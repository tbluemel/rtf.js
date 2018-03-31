var path = require("path");
var fs = require("fs");

var utils = require('./utils');

if (process.argv.length < 5) {
    console.error("You have to provide the test type, test name and the path to a test file as arguments.");
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
var testFileSource = process.argv[4];

var destRoot = path.join(__dirname, testType + "-test-files", testName);

fs.mkdir(destRoot, function(err) {
    if (err) {
        console.error("Could not create testcase directory, does the testcase already exist?");
        process.exit(1);
        return;
    }

    fs.copyFile(testFileSource, path.join(destRoot, "source." + testType), function (err) {
        if(err) {
            console.error("Could not copy '" + testFileSource + "' to the testcase directory.");
            console.error(err);
            process.exit(1);
            return;
        }
        generateExpectedResult(destRoot);
    });
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
