import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: 'esm',
    minify: true,
    sourcemap: true,
    dts: true,
    clean: true,
    external: ['react']
});
