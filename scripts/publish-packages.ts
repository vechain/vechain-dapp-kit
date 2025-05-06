/* eslint-disable no-console */
import util from 'util';
import * as child_process from 'child_process';
import fs from "fs"
import path from "path"

const exec = util.promisify(child_process.exec);

// variable packages should be all the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const updatePackageVersions = (version: string) => {
    const packageNames = [];

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        pkgJson.version = version;
        packageNames.push(pkgJson.name);
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    }
};

const publishPackages = async () => {
    const version = process.argv[2];

    if (
      !version ||
      (!version.match(/^\d+\.\d+\.\d+$/) &&
        !version.match(/^\d+\.\d+\.\d+(-rc\.\d+)?$/))
    ) {
        console.error(
          `🚨 You must specify a semantic version as the first argument  🚨`,
        );
        process.exit(1);
    }

    console.log('\n______________________________________________________\n\n');
    console.log(`   🚀🚀🚀 Publishing ${version}  🚀🚀🚀`);
    console.log('\n______________________________________________________\n\n');

    console.log(' Checkout to main:');
    await exec('git checkout main');
    console.log('       - ✅  Checked out!');

    console.log(' Pull the tag:');
    await exec('git pull');
    console.log('       - ✅  Pulled!');

    console.log(' Checkout the tag:');
    await exec(`git checkout ${version}`);
    console.log('       - ✅  Checked out!');

    console.log(' Clean:');
    console.log('       - 🚮 Purging node_modules...');
    await exec('yarn purge');
    console.log('       - ✅  Purged!');

    console.log(' Build:');
    console.log('       - 📦 Install dependencies and build packages...');
    await exec('yarn install');
    await exec('yarn install:all');
    console.log('       - ✅  Built!');

    console.log(' Test:');
    console.log('       - 🧪 Testing packages...');
    await exec('yarn test');
    console.log('       - ✅  Tested!');

    console.log(' Version:');
    console.log(`       - 🏷 Updating package versions to ${version}...`);
    updatePackageVersions(version);
    console.log('       - ✅  Updated!');

    console.log(' Publish:');
    console.log('       - 📦 Publishing packages...');
    await new Promise((resolve, reject) => {
        const publishProcess = child_process.spawn(
            'yarn',
            ['changeset', 'publish'],
            {
                stdio: 'inherit', // This allows interaction with the process's stdio
                shell: true, // Enables shell features if needed
            },
        );

        publishProcess.on('close', (code) => {
            if (code === 0) {
                resolve(null);
            } else {
                reject(new Error(`Publish process exited with code ${code}`));
            }
        });

        publishProcess.on('error', (err) => {
            reject(err);
        });
    });

    console.log('\n______________________________________________________\n\n');
    console.log(`       - 🎉🎉🎉 Packages published successfully 🎉🎉🎉`);
    console.log('\n______________________________________________________\n\n');
};

publishPackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
