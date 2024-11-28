/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/makeup/:path*",
                destination: `${process.env.NEXT_PUBLIC_MAKEUP_API_BASE_URL}/:path*`, // Makeup API 경로
            },
            {
                source: "/guestbook/:path*",
                destination: `${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL}/guestbook/:path*`, // Guestbook API 경로
            },
            {
                source: "/members/:path*",
                destination: `${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL}/members/:path*`, // Members API 경로
            },
        ];
    }
};

export default nextConfig;