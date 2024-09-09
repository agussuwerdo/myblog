// src/app/blog/[slug]/page.tsx
import { getPostBySlug } from "@/lib/posts";
import { Post } from "@/interfaces/Post";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 150), // Meta description from content
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 150),
    },
  };
};

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  const post: Post | null = await getPostBySlug(params.slug);

  if (!post) {
    notFound(); // Redirect to 404 page if post not found
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{post?.title}</h1>
      <div className="prose">
        <p>{post?.content}</p>
      </div>
    </div>
  );
};

export default BlogPostPage;
