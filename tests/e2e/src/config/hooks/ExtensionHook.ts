import * as fs from 'node:fs';
import * as path from 'node:path';
import * as util from 'node:util';
import { exec } from 'node:child_process';
import { BeforeAll } from '@cucumber/cucumber';

const asyncExec = util.promisify(exec);

BeforeAll(async function () {
    const distPath = path.resolve(__dirname, '..', '..', '..', 'veworld-dist');

    fs.rmSync(distPath, { recursive: true, force: true });

    console.log('Unzipping veworld dist...');

    const zipPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'veworld-dist.zip',
    );
    await asyncExec(`unzip ${zipPath} -d ${distPath}`);
});
