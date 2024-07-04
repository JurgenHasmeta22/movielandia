const baseUrl =
    process.env.NODE_ENV === "production" ? `${process.env.NEXT_PUBLIC_PROJECT_URL}` : "http://localhost:4000";

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
