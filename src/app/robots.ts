const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

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
