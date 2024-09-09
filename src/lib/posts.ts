// src/lib/posts.ts
import { Post } from '@/interfaces/Post';
import { cacheBlogPost, getCachedBlogPost, invalidateBlogPostCache } from '@/lib/vercel-kv';
import connectToDatabase from '@/lib/db';
import PostModel from '@/models/Post';

// Create a new blog post
export async function createPost(data: Post): Promise<Post> {
  await connectToDatabase();  // Ensure database is connected

  const newPost = new PostModel(data);
  await newPost.save();

  // Cache the new post in Vercel KV
  await cacheBlogPost(newPost.slug, newPost);

  return newPost;
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Check if the blog post is cached in Vercel KV
  const decodedSlug = decodeURIComponent(slug);
  const cachedPost: Post | null = await getCachedBlogPost(decodedSlug);
  console.log('cachedPost', cachedPost)
  if (cachedPost) {
    return cachedPost;
  }

  await connectToDatabase();  // Ensure database is connected

  // Use .lean<Post | null>() to tell TypeScript the expected return type
  const post: Post | null = await PostModel.findOne({ slug: new RegExp(`^${slug}$`, 'i') }).lean<Post | null>();

  console.log('slug', slug)
console.log('post', post)
  if (post) {
    // Cache the post in Vercel KV for future requests
    await cacheBlogPost(slug, post);
  }

  return post;
}

// Update an existing blog post by slug
export async function updatePost(slug: string, updatedData: Post): Promise<Post | null> {
  await connectToDatabase();  // Ensure database is connected

  // Update the blog post in MongoDB
  const updatedPost: Post | null = await PostModel.findOneAndUpdate({ slug }, updatedData, {
    new: true,
  }).lean<Post | null>();

  // Invalidate the old cache and cache the updated post
  if (updatedPost) {
    await invalidateBlogPostCache(slug);
    await cacheBlogPost(slug, updatedPost);
  }

  return updatedPost;
}

// Delete a blog post by slug
export async function deletePost(slug: string): Promise<Post | null> {
  await connectToDatabase();  // Ensure database is connected

  // Delete the blog post from MongoDB
  const deletedPost: Post | null = await PostModel.findOneAndDelete({ slug }).lean<Post | null>();

  if (deletedPost) {
    // Invalidate the cache after deletion
    await invalidateBlogPostCache(slug);
  }

  return deletedPost;
}

// Get all blog posts
export async function getAllPosts(): Promise<Post[]> {
  await connectToDatabase();  // Ensure database is connected

  // Fetch all blog posts from MongoDB
  const posts: Post[] = await PostModel.find({}).lean<Post[]>();

  return posts;
}
