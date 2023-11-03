/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { legacyPlugin } from '@web/dev-server-legacy';

const mode = 'dev';
if (!['dev', 'prod'].includes(mode)) {
    throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

// eslint-disable-next-line import/no-default-export
export default {
    nodeResolve: { exportConditions: mode === 'dev' ? ['development'] : [] },
    preserveSymlinks: true,
    plugins: [
        legacyPlugin({
            polyfills: {
                // Manually imported in index.html file
                webcomponents: false,
            },
        }),
    ],
};
