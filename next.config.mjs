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
            },
            {
                protocol: 'https',
                hostname: "images.unsplash.com",
                port: "",
            },
            {
                protocol: 'http',
                hostname: "ia.media-imdb.com",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "ia.media-imdb.com",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "yts.bz",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "yts.mx",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "img.yts.mx",
                port: "",
            },
            {
                protocol: 'https',
                hostname: "yts.lt",
                port: "",
            }
        ]
    }
};

export default nextConfig;
