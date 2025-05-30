import adapter from '@sveltejs/adapter-static';
const basePath = process.env.BASE_PATH ?? '';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: {
        postcss: true,
    },
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({
            // default options are shown. On some platforms
            // these options are set automatically — see below
            pages: 'dist',
            assets: 'dist',
            fallback: undefined,
            precompress: true,
        }),
        paths: {
            base: basePath,
        },
    },
};

export default config;
