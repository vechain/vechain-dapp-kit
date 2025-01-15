import * as fs from 'node:fs';
import * as path from 'node:path';
import * as util from 'node:util';
import { execFile } from 'node:child_process';
import { BeforeAll } from '@cucumber/cucumber';

const asyncExecFile = util.promisify(execFile);

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
    await asyncExecFile('unzip', ['-o', zipPath]);
});
