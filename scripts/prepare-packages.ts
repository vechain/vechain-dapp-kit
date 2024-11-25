/* eslint-disable no-console */
import util from 'util';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

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

const preparePackages = async () => {
    const version = process.argv[2];

    if (!version || !version.match(/^\d+\.\d+\.\d+$/)) {
        console.error(
            `🚨 You must specify a semantic version as the first argument  🚨`,
        );
        process.exit(1);
    }

    console.log('\n______________________________________________________\n\n');
    console.log(`   🚀🚀🚀 Preparing ${version} for release  🚀🚀🚀`);
    console.log('\n______________________________________________________\n\n');

    console.log(` Checkout the release branch:`);
    await exec(`git checkout -b v${version}`);
    console.log('       - ✅  Checked out!');

    console.log(' Clean:');
    console.log('       - 🚮 Removing existing packages & builds...');
    await exec('yarn purge');
    console.log('       - ✅  Removed!');

    console.log(' Build:');
    console.log('       - 📦 Install dependencies and build packages...');
    await exec('yarn install:all');
    console.log('       - ✅  Built!');

    console.log(' Test:');
    console.log('       - 🧪 Testing packages...');
    await exec('yarn test');
    console.log('       - ✅  Success!');

    console.log(' Version:');
    console.log(`       - 🏷 Updating package versions to ${version}...`);
    updatePackageVersions(version);
    console.log('       - ✅  Updated!');

    console.log(' Commit:');
    console.log(`       - 📦 Committing changes...`);
    await exec(`git commit -am "chore(release): v${version}"`);
    console.log('       - ✅  Committed!');

    console.log(' Push:');
    console.log(`       - 📦 Pushing changes...`);
    await exec(`git push --set-upstream origin v${version}`);
    console.log('       - ✅  Pushed!');

    console.log('\n______________________________________________________\n\n');
    console.log(
        `       - 🚀🚀🚀 Release branch is ready to be merged 🚀🚀🚀\n\n`,
        `       - 📝 Create the PR for the release branch v${version}\n`,
        `       - 🔖 When the PR is merged, create the release on github called ${version}, it will automatically tag the commit with the version ${version}.\n`,
        `       - 🚀 Then run 'yarn publish:release ${version}' to checkout in the tag and publish packages\n`,
    );
    console.log('\n______________________________________________________\n\n');
};

preparePackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
