/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'dist',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crafatar.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
