const basePath = process.env.BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath,
    env: {
        basePath,
    },
};

module.exports = nextConfig;
