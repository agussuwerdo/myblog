// src/app/blog/page.tsx
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Post } from '@/interfaces/Post';

export const metadata = {
  title: 'All Blog Posts',
};

const BlogListingPage = async () => {
  const posts: Post[] = await getAllPosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-4">
              <Link legacyBehavior href={`/blog/${post.slug}`}>
                <a className="text-xl font-semibold text-blue-600 hover:underline">
                  {post.title}
                </a>
              </Link>
              <p>{post.content.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogListingPage;
