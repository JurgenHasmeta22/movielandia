const baseUrl =
    process.env.NODE_ENV !== "development" ? process.env.NEXT_PUBLIC_PROJECT_URL : process.env.NEXT_PUBLIC_LOCAL_URL;

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
