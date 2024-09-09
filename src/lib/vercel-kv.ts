// src/lib/vercel-kv.ts
import { kv } from '@vercel/kv';
import { Post } from '@/interfaces/Post';

const kvUrl = process.env.KV_URL;

if (!kvUrl) {
  throw new Error('Missing KV_URL environment variable');
}

// Time-to-live for cache (e.g., 24 hours)
const TTL = 60 * 60 * 24;

// Set data in Vercel KV (for caching a blog post)
export async function cacheBlogPost(slug: string, data: Post): Promise<void> {
  try {
    await kv.set(`blog:${slug}`, data, { ex: TTL });  // Cache with TTL
    console.log(`Cached blog post with slug: ${slug}`);
  } catch (error) {
    console.error('Error caching blog post:', error);
  }
}

// Get data from Vercel KV (retrieving cached blog post)
export async function getCachedBlogPost(slug: string): Promise<Post | null> {
  try {
    const data = await kv.get(`blog:${slug}`);

    // Ensure that the retrieved data is of type Post
    if (data && typeof data === 'object' && 'title' in data && 'slug' in data) {
      return data as Post;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog post from cache:', error);
    return null;
  }
}

// Invalidate the cache (when updating/deleting a blog post)
export async function invalidateBlogPostCache(slug: string): Promise<void> {
  try {
    await kv.del(`blog:${slug}`);
    console.log(`Invalidated cache for blog post with slug: ${slug}`);
  } catch (error) {
    console.error('Error invalidating cache for blog post:', error);
  }
}
