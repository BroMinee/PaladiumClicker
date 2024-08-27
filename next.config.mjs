/** @type {import('next').NextConfig} */
const nextConfig = {
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
