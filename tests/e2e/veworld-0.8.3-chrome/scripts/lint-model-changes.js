const path = require('path');
const util = require('util');
const fs = require('fs');
const { exec: execSync } = require('child_process');
const exec = util.promisify(execSync);

const manifest = require(path.join(__dirname, '../public/manifest.json'));
const versionRegex = new RegExp(/\.V([0-9]+)_([0-9]+)_([0-9]+)\.ts/);

/**
 * Checks if v1 is less than v2
 * @param v1
 * @param v2
 * @returns {boolean}
 */
function isSemanticVersionLess(v1, v2) {
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');

    for (let i = 0; i < v1Parts.length; i++) {
        if (v1Parts[i] < v2Parts[i]) {
            return true;
        }
    }

    return false;
}

/**
 * Checks the model changes against main branch
 * Throws an error if any file
 */
async function checkForPreviousVersionChanges() {
    const diffToMain = process.argv.slice(2);
    const gitDiffArg = diffToMain[0];

    if (gitDiffArg !== '--staged' && gitDiffArg !== '--main') {
        console.error(
            `ERROR: Invalid argument. Must be either '--staged' or '--main'`,
        );
        process.exit(1);
    }

    const gitDiffCommand =
        gitDiffArg === '--staged'
            ? 'git diff --name-only --cached'
            : 'git diff origin/main --name-only';

    await exec('git fetch --all');
    const { stdout } = await exec(gitDiffCommand);

    const badFileChanges = stdout
        .split('\n')
        // Filter files with a semantic version
        .filter((file) => versionRegex.test(file))
        // Filter files with a version less than the current version
        .filter((file) => {
            const res = versionRegex.exec(file);
            const fileVersion = res[1] + '.' + res[2] + '.' + res[3];
            return isSemanticVersionLess(fileVersion, manifest.version);
        });

    if (badFileChanges.length) {
        console.error(
            `ERROR: Changes to old model files not allowed. Their versions are older than the current version (${
                manifest.version
            }):\n\n${badFileChanges.join('\n')}`,
        );
        process.exit(1);
    }
}

/**
 * Recursively lists all files in a directory
 */
const getAllModelFiles = function (dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllModelFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
};

async function lintFileNames() {
    /**
     * @param {string} str
     * @param {RegExp} search
     * @returns {boolean}
     */
    function regexEndsWith(str, search, { caseSensitive = true } = {}) {
        let source = search.source;
        if (!source.endsWith('$')) source = source + '$';
        let flags = search.flags;
        if (!caseSensitive && !flags.includes('i')) flags += 'i';
        const reg = new RegExp(source, flags);
        return reg.test(str);
    }

    const badFileNames = getAllModelFiles('src/common/model').filter(
        (file) =>
            !regexEndsWith(file, versionRegex) && !file.endsWith('/index.ts'),
    );

    if (badFileNames.length) {
        console.error(
            `ERROR: The following file names are invalid. They must be an index or end with a semantic version. (Eg. 'Account.V0.0.1.ts'):\n\n ${badFileNames.join(
                '\n',
            )}`,
        );
        process.exit(1);
    }
}

const lint = async () => {
    await lintFileNames();
    await checkForPreviousVersionChanges();
};

lint()
    .then(() => {
        console.log('Model versioning check passed.');
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
