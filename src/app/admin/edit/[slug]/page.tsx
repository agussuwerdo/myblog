// src/app/admin/edit/[slug]/page.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the form data interface
interface PostFormData {
  title: string;
  slug: string;
  content: string;
}

const EditPost = ({ params }: { params: { slug: string } }) => {
  const { register, handleSubmit, reset } = useForm<PostFormData>();
  const [post, setPost] = useState<PostFormData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${params.slug}`);
      if (res.ok) {
        const data: PostFormData = await res.json();
        setPost(data);
        reset(data); // Pre-fill form with existing post data
      } else {
        alert('Post not found');
      }
    };

    fetchPost();
  }, [params.slug, reset]);

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    const res = await fetch(`/api/posts/${params.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/admin'); // Redirect back to admin dashboard after successful update
    } else {
      alert('Error updating post');
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register('title', { required: true })}
            type="text"
            className="input input-bordered w-full"
            placeholder="Post Title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            {...register('slug', { required: true })}
            type="text"
            className="input input-bordered w-full"
            placeholder="post-title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register('content', { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Write your content here"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
