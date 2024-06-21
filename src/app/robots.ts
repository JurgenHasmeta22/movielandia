// const baseUrl = process.env.NEXT_PUBLIC_PUBLIC_URL
//     ? `https://${process.env.NEXT_PUBLIC_PUBLIC_URL}`
//     : "http://localhost:4000";
const baseUrl = "http://localhost:4000";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
