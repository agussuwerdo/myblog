// src/lib/posts.ts
import { Post } from "@/interfaces/Post";
import {
  cacheAllPosts,
  cacheBlogPost,
  getCachedBlogPost,
  getCachedBlogPosts,
  invalidateAllPostsCache,
  invalidateBlogPostCache,
} from "@/lib/vercel-kv";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";

// Create a new blog post
export async function createPost(data: Post): Promise<Post> {
  await connectToDatabase(); // Ensure database is connected

  const newPost = new PostModel(data);
  await newPost.save();

  // Invalidate the cache for all posts to ensure fresh data
  await invalidateAllPostsCache();

  // Cache the newly created post in Vercel KV
  await cacheBlogPost(newPost.slug, newPost);

  return newPost;
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const decodedSlug = decodeURIComponent(slug);

  // Check if the blog post is cached in Vercel KV
  const cachedPost: Post | null = await getCachedBlogPost(decodedSlug);

  if (cachedPost) {
    return cachedPost;
  }

  await connectToDatabase(); // Ensure database is connected

  // Fetch the blog post from MongoDB
  const post: Post | null = await PostModel.findOne({
    slug: new RegExp(`^${slug}$`, "i"),
  }).lean<Post | null>();

  // Cache the fetched post in Vercel KV for future requests
  if (post) {
    await cacheBlogPost(slug, post);
  }

  return post;
}

// Update an existing blog post by slug
export async function updatePost(
  slug: string,
  updatedData: Post
): Promise<Post | null> {
  await connectToDatabase(); // Ensure database is connected

  // Update the blog post in MongoDB
  const updatedPost: Post | null = await PostModel.findOneAndUpdate(
    { slug },
    updatedData,
    {
      new: true,
    }
  ).lean<Post | null>();

  if (updatedPost) {
    // Invalidate the cache for the updated post and all posts list
    await invalidateBlogPostCache(slug);
    await cacheBlogPost(slug, updatedPost);

    // Invalidate all posts cache to ensure it's refreshed
    await invalidateAllPostsCache();
  }

  return updatedPost;
}

// Delete a blog post by slug
export async function deletePost(slug: string): Promise<Post | null> {
  await connectToDatabase(); // Ensure database is connected

  // Delete the blog post from MongoDB
  const deletedPost: Post | null = await PostModel.findOneAndDelete({
    slug,
  }).lean<Post | null>();

  if (deletedPost) {
    // Invalidate the cache for the deleted post and all posts list
    await invalidateBlogPostCache(slug);
    await invalidateAllPostsCache();
  }

  return deletedPost;
}

// Get all blog posts
export async function getAllPosts(): Promise<Post[]> {
  // Check if the posts are cached in Vercel KV
  const cachedPosts = await getCachedBlogPosts();
  if (cachedPosts) {
    return cachedPosts;
  }

  const posts = await getAllPostsFromDb();

  return posts;
}

// Fetch all posts directly from MongoDB (for cache invalidation purposes)
export async function getAllPostsFromDb(): Promise<Post[]> {
  await connectToDatabase(); // Ensure database is connected

  const posts: Post[] = await PostModel.find({}).lean<Post[]>();

  // Cache all fetched posts
  await cacheAllPosts(posts);

  return posts;
}
