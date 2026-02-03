/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "image.tmdb.org",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "m.media-amazon.com",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "images-na.ssl-images-amazon.com",
                port: "",
            }
        ]
    }
};

export default nextConfig;
