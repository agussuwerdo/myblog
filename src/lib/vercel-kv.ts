// src/lib/vercel-kv.ts
import { kv } from "@vercel/kv";
import { Post } from "@/interfaces/Post";
import { getAllPostsFromDb } from "@/lib/posts";

// Time-to-live for cache (e.g., 24 hours)
const TTL = 60 * 60 * 24;
// Cache key for allPosts
const CACHE_KEY = "allPosts";

// Get blog posts from Redis cache without querying MongoDB
export async function getCachedBlogPosts(): Promise<Post[] | null> {
  // Try to get cached posts from Redis (Vercel KV)
  const cachedPosts = await kv.get(CACHE_KEY);

  if (cachedPosts) {
    return cachedPosts as Post[];
  } else {
    return null;
  }
}

// Set all blog posts in Vercel KV
export async function cacheAllPosts(posts: Post[]): Promise<void> {
  try {
    await kv.set(CACHE_KEY, posts, { ex: TTL }); // Cache with TTL
  } catch (error) {
    console.error("Error caching all blog posts:", error);
  }
}

// Set data in Vercel KV (for caching a single blog post)
export async function cacheBlogPost(slug: string, data: Post): Promise<void> {
  try {
    await kv.set(`blog:${slug}`, data, { ex: TTL }); // Cache with TTL
  } catch (error) {
    console.error("Error caching blog post:", error);
  }
}

// Get data from Vercel KV (retrieving cached blog post)
export async function getCachedBlogPost(slug: string): Promise<Post | null> {
  try {
    const data = await kv.get(`blog:${slug}`);

    // Ensure that the retrieved data is of type Post
    if (data && typeof data === "object" && "title" in data && "slug" in data) {
      return data as Post;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog post from cache:", error);
    return null;
  }
}

// Invalidate the cache for a single blog post (when updating/deleting)
export async function invalidateBlogPostCache(slug: string): Promise<void> {
  try {
    await kv.del(`blog:${slug}`);
  } catch (error) {
    console.error("Error invalidating cache for blog post:", error);
  }
}

// Invalidate cache for all blog posts and re-add all posts
export async function invalidateAllPostsCache() {
  try {
    // 1. Delete the existing cache
    await kv.del(CACHE_KEY);

    // 2. Fetch all posts from the database directly
    const posts = await getAllPostsFromDb(); // Fetch directly from MongoDB

    // 3. Cache all posts again in Redis (Vercel KV)
    await cacheAllPosts(posts);
  } catch (error) {
    console.error(
      "Error invalidating and re-adding all blog posts cache:",
      error
    );
  }
}
