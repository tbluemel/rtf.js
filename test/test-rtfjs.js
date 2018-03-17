var path = require("path");
var fs = require("fs");
var chai = require("chai");
var expect = require("chai").expect;
var chaiHtml  = require('chai-html');
chai.use(chaiHtml);
var typewiz = require('typewiz');

var utils = require("./utils");

function readFile(filePath) {
    return fs.readFileSync(filePath, {encoding: "utf-8"}).trim();
}

function getTestFiles() {
    var testFileRoot = path.join(__dirname, "test-files");

    return fs.readdirSync(testFileRoot).map(function(dir) {
        return {
            name: dir,
            dir: path.join(testFileRoot, dir),
            source: readFile(path.join(testFileRoot, dir, "source.rtf")),
            expectedHtml: readFile(path.join(testFileRoot, dir, "expected.html")),
            expectedMetadata: JSON.parse(readFile(path.join(testFileRoot, dir, "expected-metadata.json"))),
        };
    });
};

var testFiles = getTestFiles();

describe("Test files", function() {
    var $_$twiz;
    testFiles.forEach(function(testFile) {
        describe(testFile.name, function() {
            this.timeout(0);

            var result;

            before(function(done) {
                utils.runRtfjs(testFile.dir, testFile.source, function (meta, html, twiz) {
                    result = {
                        html: html,
                        metadata: JSON.parse(meta)
                    };
                    $_$twiz = twiz;
                    done();
                }, function (error) {
                    var formattedError = new Error(error.message);
                    formattedError.stack = error.stack;
                    return done(formattedError);
                });
            });

            it("should return a result", function() {
                expect(result).to.include.keys("html", "metadata");
            });

            it("should expected html equal result html", function() {
                expect(testFile.expectedHtml).html.to.equal(result.html);
            });

            it("should expected metadata equal result metadata", function () {
                expect(testFile.expectedMetadata).to.deep.equal(result.metadata);
            });
        });
    });

    after(function() {
        // Apply captured types
        typewiz.applyTypes($_$twiz.get());
    });
});
