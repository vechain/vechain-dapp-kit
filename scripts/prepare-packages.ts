import util from 'util';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const exec = util.promisify(child_process.exec);

// variable packages should be all of the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

console.log('packages', packages);

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

    // if a package json contains a dependency on another package in this repo, update it to the new version
    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

        for (const dep of Object.keys(pkgJson.dependencies)) {
            if (packageNames.includes(dep)) {
                pkgJson.dependencies[dep] = version;
            }
        }

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

    console.log(' Clean:');
    console.log('       - 🚮 Removing existing packages & builds...');
    await exec('yarn purge');
    console.log('       - ✅ Removed!');

    console.log(' Build:');
    console.log('       - 📦 Building packages...');
    await exec('yarn install:all');
    console.log('       - ✅ Built!');

    console.log(' Test:');
    console.log('       - 🧪 Testing packages...');
    await exec('yarn test');
    console.log('       - ✅ Success!');

    console.log(' Version:');
    console.log(`       - 🏷  Updating package versions to ${version}...`);
    updatePackageVersions(version);
    await exec(`yarn format`);
    console.log('       - ✅ Updated!');
    //log run `yarn changeset publish` to publish the packages

    console.log('\n______________________________________________________\n\n');
    console.log(' Publish:');
    console.log(
        `       - Run 'yarn changeset publish' to publish the packages`,
    );
    console.log('\n______________________________________________________\n\n');
};

preparePackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
