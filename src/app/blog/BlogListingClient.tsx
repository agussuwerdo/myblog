// src/app/blog/BlogListingClient.tsx
"use client"; // This is a client component

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/interfaces/Post";

const BlogListingClient = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch posts using useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts(); // Call fetchPosts when the component mounts
  }, []); // Empty dependency array ensures this effect runs only on mount

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading blog posts.</p>;
  if (!posts || posts.length === 0) return <p>No blog posts available.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>
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
    </div>
  );
};

export default BlogListingClient;
