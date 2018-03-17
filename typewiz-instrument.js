const typewiz = require('typewiz');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');

if (process.argv.length < 4) {
    console.error("You have to provide the files to instrument as an argument.");
    process.exit(1);
    throw "Abort";
}

const targetDirectory = process.argv[2];

fs.mkdir(targetDirectory, function(err) {
    if (err) {
        console.error("Could not create directory '" + targetDirectory + "', does the directory already exist?");
        process.exit(1);
        return;
    }

    process.argv.slice(3).forEach(argument => {
        glob(argument, {}, function (err, files) {
            if (!err) {
                files.forEach(fileName => {
                    const source = fs.readFileSync(fileName, 'utf8');
                    const instrumentedSource = typewiz.instrument(source, fileName);

                    let target = fileName.split(path.sep);
                    target.splice(0,1);
                    target.unshift(targetDirectory);
                    target = target.join(path.sep);
                    target = target.replace(/\.ts$/, '.js');
                    fs.ensureFileSync(target);

                    const compiled = ts.transpile(instrumentedSource, {
                        module: ts.ModuleKind.ES2015,
                        target: ts.ScriptTarget.ES5
                    });

                    fs.writeFileSync(target, compiled);
                });
            }
        });
    });
});
