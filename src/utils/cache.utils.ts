import { unstable_cache } from "next/cache";

export const CACHE_TAGS = {
    MOVIES: "movies",
    SERIES: "series",
    ACTORS: "actors",
    EPISODES: "episodes",
    SEASONS: "seasons",
    REVIEWS: "reviews",
    USERS: "users",
    CREWS: "crews",
    GENRES: "genres",
    PLAYLISTS: "playlists",
    FORUM: "forum",
} as const;

export const CACHE_TIMES = {
    MINUTE: 60, // 60 seconds
    HOUR: 3600, // 1 hour
    DAY: 86400, // 24 hours
    WEEK: 604800, // 7 days
    MONTH: 2592000, // 30 days
} as const;

/**
 * Creates a cache key by combining a base string with optional parameters
 * @param base - The base string for the cache key
 * @param params - Optional parameters to include in the cache key
 * @returns A string that can be used as a cache key
 */
export function createCacheKey(base: string, params?: Record<string, any>): string {
    if (!params) return base;
    return `${base}-${JSON.stringify(params)}`;
}

/**
 * Type for cache configuration options
 */
export interface CacheConfig {
    revalidate?: number;
    tags?: string[];
}

/**
 * Creates a cached version of a function with the specified configuration
 * @param fn - The function to cache
 * @param keyParts - Array of strings that form the cache key
 * @param config - Cache configuration options
 * @returns The cached function result
 */
export function createCache<T>(fn: () => Promise<T>, keyParts: string[], config: CacheConfig) {
    return unstable_cache(fn, keyParts, {
        revalidate: config.revalidate || CACHE_TIMES.HOUR,
        tags: config.tags || [],
    });
}

/**
 * Helper function to combine multiple cache tags
 * @param tags - Array of cache tags to combine
 * @returns Combined cache tags array
 */
export function combineCacheTags(...tags: (keyof typeof CACHE_TAGS)[]): string[] {
    return tags.map((tag) => CACHE_TAGS[tag]);
}

/**
 * Creates a cache key for paginated content
 * @param base - Base cache key
 * @param page - Page number
 * @param limit - Items per page
 * @returns Cache key string
 */
export function createPaginationCacheKey(base: string, page: number, limit: number): string {
    return createCacheKey(base, { page, limit });
}

/**
 * Creates a cache key for filtered content
 * @param base - Base cache key
 * @param filters - Filter parameters
 * @returns Cache key string
 */
export function createFilterCacheKey(base: string, filters: Record<string, any>): string {
    return createCacheKey(base, filters);
}
