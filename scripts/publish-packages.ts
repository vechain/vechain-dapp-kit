/* eslint-disable no-console */
import util from 'util';
import * as child_process from 'child_process';

const exec = util.promisify(child_process.exec);

const publishPackages = async () => {
    const version = process.argv[2];

    if (!version || !version.match(/^\d+\.\d+\.\d+$/)) {
        console.error(
            `🚨 You must specify a semantic version as the first argument  🚨`,
        );
        process.exit(1);
    }

    console.log('\n______________________________________________________\n\n');
    console.log(`   🚀🚀🚀 Publishing ${version}  🚀🚀🚀`);
    console.log('\n______________________________________________________\n\n');

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
    await exec('yarn install:all');
    console.log('       - ✅  Built!');

    console.log(' Test:');
    console.log('       - 🧪 Testing packages...');
    await exec('yarn test');
    console.log('       - ✅  Success!');

    console.log(' Publish:');
    console.log('       - 📦 Publishing packages...');
    await exec('yarn changeset publish');
    console.log('       - ✅  Published!');

    console.log('\n______________________________________________________\n\n');
    console.log(`       - 🎉🎉🎉 Packages published successfully 🎉🎉🎉`);
    console.log('\n______________________________________________________\n\n');
};

publishPackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
