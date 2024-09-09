// src/app/admin/create/page.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Define the form data interface
interface PostFormData {
  title: string;
  slug: string;
  content: string;
}

const CreatePost = () => {
  const { register, handleSubmit, reset } = useForm<PostFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      reset(); // Reset the form after successful submission
      router.push('/admin'); // Redirect to admin dashboard
    } else {
      alert('Error creating post');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
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
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
