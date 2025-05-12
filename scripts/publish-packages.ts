/* eslint-disable no-console */
import util from 'util';
import * as child_process from 'child_process';
import fs from 'fs';
import path from 'path';

const exec = util.promisify(child_process.exec);

// variable packages should be all the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const updatePackageVersions = (version: string) => {
    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        if (pkgJson.version !== version) {
            throw new Error(`Tag/ package.json mismatch ${pkgJsonPath}`);
        }
        for (const dep of Object.keys(pkgJson.dependencies || {})) {
            if (dep.includes('@vechain/dapp-kit')) {
                pkgJson.dependencies[dep] = version;
            }
        }
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    }
};

const publishPackages = async () => {
    if (process.env.GITHUB_ACTIONS !== 'true') {
        console.error(`🚨 This script should only be run in GitHub Actions 🚨`);
        process.exit(1);
    }

    if (!process.env.NODE_AUTH_TOKEN) {
        console.error(
            `🚨 You must set the NODE_AUTH_TOKEN environment variable 🚨`,
        );
        process.exit(1);
    }

    const { stdout } = await exec('git describe --exact-match --tags HEAD');

    const version = stdout.trim();

    console.log(`Version: ${version}`);

    if (
        !version ||
        (!version.match(/^\d+\.\d+\.\d+$/) &&
            !version.match(/^\d+\.\d+\.\d+(-rc\.\d+)?$/))
    ) {
        console.error(`🚨 Branch name is not a valid tag (${version}) 🚨\n`);
        process.exit(1);
    }

    console.log('\n______________________________________________________\n\n');
    console.log(`   🚀🚀🚀 Publishing ${version}  🚀🚀🚀`);
    console.log('\n______________________________________________________\n\n');

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
                env: {
                    ...process.env,
                    NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN,
                },
            },
        );

        publishProcess.on('close', (code) => {
            if (code === 0) {
                resolve(null);
            } else {
                reject(new Error(`Publish process exited with code ${code}`));
            }
        });

        publishProcess.on('message', (data) => {
            console.log(data);
        });

        publishProcess.stdout?.on('data', (data) => {
            console.log(data);
        });

        publishProcess.stderr?.on('data', (data) => {
            console.error(data);
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
