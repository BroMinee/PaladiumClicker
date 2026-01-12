import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next',
    outputFileTracingRoot: __dirname,
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
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
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
