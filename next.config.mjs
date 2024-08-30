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
    logging: {
        fetches:{
            fullUrl: true,
        }
    }
};

export default nextConfig;
