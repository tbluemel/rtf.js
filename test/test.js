var path = require("path");
var fs = require("fs");
var chai = require("chai");
var expect = require("chai").expect;
var chaiHtml  = require('chai-html');
chai.use(chaiHtml);
var typewiz = require('typewiz-core');

var utils = require("./utils");

function readFile(filePath) {
    if(path.extname(filePath) === ".emf" || path.extname(filePath) === ".wmf"){
        return fs.readFileSync(filePath).buffer;
    } else {
        return fs.readFileSync(filePath, {encoding: "utf-8"}).trim();
    }
}

function getTestFiles(testType) {
    var testFileRoot = path.join(__dirname, testType + "-test-files");

    return fs.readdirSync(testFileRoot).map(function(dir) {
        if (testType === "rtf"){
            return {
                name: dir,
                dir: path.join(testFileRoot, dir),
                source: readFile(path.join(testFileRoot, dir, "source.rtf")),
                expectedHtml: readFile(path.join(testFileRoot, dir, "expected.html")),
                expectedMetadata: JSON.parse(readFile(path.join(testFileRoot, dir, "expected-metadata.json"))),
            };
        } else if (testType === "emf" || testType === "wmf"){
            return {
                name: dir,
                dir: path.join(testFileRoot, dir),
                source: readFile(path.join(testFileRoot, dir, "source." + testType)),
                expectedSvg: readFile(path.join(testFileRoot, dir, "expected.svg"))
            };
        }
    });
};

describe("Test files", function() {
    var $_$twiz;

    describe("rtf", function() {
        getTestFiles("rtf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
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

                it("should return a result", function () {
                    expect(result).to.include.keys("html", "metadata");
                });

                it("should expected html equal result html", function () {
                    expect(testFile.expectedHtml).html.to.equal(result.html);
                });

                it("should expected metadata equal result metadata", function () {
                    expect(testFile.expectedMetadata).to.deep.equal(result.metadata);
                });
            });
        });
    });

    describe("emf", function() {
        getTestFiles("emf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
                    utils.runEmfjs(testFile.source, function (svg, twiz) {
                        result = {
                            svg: svg
                        };
                        $_$twiz = twiz;
                        done();
                    }, function (error) {
                        var formattedError = new Error(error.message);
                        formattedError.stack = error.stack;
                        return done(formattedError);
                    });
                });

                it("should return a result", function () {
                    expect(result).to.include.keys("svg");
                });

                it("should expected svg equal result svg", function () {
                    expect(testFile.expectedSvg).html.to.equal(result.svg);
                });
            });
        });
    });

    describe("wmf", function() {
        getTestFiles("wmf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
                    utils.runWmfjs(testFile.source, function (svg, twiz) {
                        result = {
                            svg: svg
                        };
                        $_$twiz = twiz;
                        done();
                    }, function (error) {
                        var formattedError = new Error(error.message);
                        formattedError.stack = error.stack;
                        return done(formattedError);
                    });
                });

                it("should return a result", function () {
                    expect(result).to.include.keys("svg");
                });

                it("should expected svg equal result svg", function () {
                    expect(testFile.expectedSvg).html.to.equal(result.svg);
                });
            });
        });
    });

    after(function() {
        // Apply captured types
        typewiz.applyTypes($_$twiz.get());
    });
});
