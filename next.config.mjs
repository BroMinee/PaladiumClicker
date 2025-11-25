/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mineskin.eu',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'discord.com',
                pathname: '/**',
            }
        ],
    },
    logging: {
        fetches:{
            fullUrl: true,
        }
    }
};

export default nextConfig;
