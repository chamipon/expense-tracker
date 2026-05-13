import type { NextConfig } from "next";
import path from "path";

const apiOrigin = (process.env.API_SERVER_ORIGIN ?? "http://127.0.0.1:3001").replace(
	/\/$/,
	"",
);

const nextConfig: NextConfig = {
    turbopack: {
        root: path.join(__dirname, '..'),
    },
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${apiOrigin}/:path*`,
			},
		];
	},
};

export default nextConfig;
