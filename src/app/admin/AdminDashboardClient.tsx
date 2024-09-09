// src/app/admin/AdminDashboardClient.tsx
"use client";

import Link from "next/link";
import { Post } from "@/interfaces/Post";
import { useEffect, useState } from "react";

const AdminDashboardClient = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Post deleted successfully");
        window.location.reload(); // Refresh the page to show updated post list
      } else {
        alert("Failed to delete the post");
      }
    }
  };
  // Fetch posts using useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setIsError(true);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array to fetch posts on mount

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts.</p>;

  return (
    <>
      <Link href="/admin/create" className="btn btn-primary mb-4">
        Create New Post
      </Link>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post.slug}>
              <td className="border px-4 py-2">{post.title}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="btn btn-secondary mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminDashboardClient;
