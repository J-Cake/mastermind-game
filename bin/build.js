const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const browserify = require('browserify');
const { ENOENT } = require('constants');

const awaitProc = cli => new Promise(function (resolve, reject) {
    const proc = childProcess.exec(cli);

    proc.stdout.on("data", function (data) {
        process.stdout.write(data.split("\n").map(i => `\t${i}`).join("\n"));
    });

    proc.stderr.on("data", function (data) {
        process.stderr.write(data.split("\n").map(i => `\t${i}`).join("\n"));
    });

    proc.on('exit', function (code) {
        if (code === 0)
            resolve();
        else
            reject(code);
    });
});

const start = new Date();

// .then(() => awaitProc("pnpx tsc").then(() => console.log(`Build Succeeded in ${new Date(new Date().getTime() - start).getTime()}ms`))).catch(() => console.error("Build Failed"))
// awaitProc("pnpm install").then(function() {
// });

const copy = function (loc, dest) {
    if (fs.existsSync(loc)) {
        if (fs.lstatSync(loc).isDirectory()) {
            const items = fs.readdirSync(loc);

            if (!fs.existsSync(dest))
                fs.mkdirSync(dest, { recursive: true });

            for (const item of items) {
                if (fs.lstatSync(path.join(loc, item)).isDirectory())
                    copy(path.join(loc, item), dest);
                else
                    fs.copyFileSync(path.join(loc, item), path.join(dest, item));
            }
        } else
            fs.copyFileSync(path.join(loc, item), dest);
    } else
        throw new Error("The item does not exist");
}

copy("./app/static", "./build/final");

browserify({
    entries: ["./build/app/src/index.js"],
    debug: true
}).bundle().pipe(fs.createWriteStream('./build/final/app.js'));
