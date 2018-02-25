var path = require("path");
var fs = require("fs");
var chai = require("chai");
var expect = require("chai").expect;
var chaiHtml  = require('chai-html');
chai.use(chaiHtml);

var utils = require("./utils");

function readFile(filePath) {
    return fs.readFileSync(filePath, {encoding: "utf-8"}).trim();
}

function getTestFiles() {
    var testFileRoot = path.join(__dirname, "test-files");

    return fs.readdirSync(testFileRoot).map(function(dir) {
        return {
            dir: dir,
            source: readFile(path.join(testFileRoot, dir, "source.rtf")),
            expectedHtml: readFile(path.join(testFileRoot, dir, "expected.html")),
            expectedMetadata: JSON.parse(readFile(path.join(testFileRoot, dir, "expected-metadata.json"))),
        };
    });
};

var testFiles = getTestFiles();

describe("Test files", function() {
    testFiles.forEach(function(testFile) {
        describe(testFile.dir, function() {
            this.timeout(10000);

            var result;

            before(function(done) {
                utils.runRtfjs(testFile.source, function (meta, html) {
                    result = {
                        html: html,
                        metadata: JSON.parse(meta)
                    };
                    done();
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
});
