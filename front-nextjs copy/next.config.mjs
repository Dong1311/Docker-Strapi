/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', 
    distDir: 'out',
    eslint: {
        ignoreDuringBuilds: true, // Tắt ESLint khi build
    },
};

export default nextConfig;
