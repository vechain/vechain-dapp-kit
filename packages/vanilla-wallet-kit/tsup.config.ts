import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: 'esm',
    sourcemap: true,
    dts: true,
    clean: true,
    esbuildPlugins: [
        polyfillNode({
            polyfills: { crypto: true, http: true },
        }),
    ],
});
