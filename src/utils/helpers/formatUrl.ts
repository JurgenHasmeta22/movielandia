/**
 * Formats a string to be used in a URL by:
 * 1. Converting to lowercase
 * 2. Removing special characters
 * 3. Replacing spaces with hyphens
 *
 * @param text The text to format for a URL
 * @returns The formatted URL-friendly string
 */
export function formatForUrl(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

/**
 * Formats a title for use in a URL path
 *
 * @param id The ID to include in the URL
 * @param title The title to format
 * @returns Formatted URL path segment
 */
export function formatTitleForUrl(id: number, title: string): string {
    const formattedTitle = formatForUrl(title);
    return `${id}/${formattedTitle}`;
}
