// src/app/admin/page.tsx
import { getAllPosts } from '@/lib/posts';
import AdminDashboardClient from './AdminDashboardClient';
import { Post } from '@/interfaces/Post';

const AdminDashboard = async () => {
  const posts: Post[] = await getAllPosts(); // Fetch posts on the server side

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminDashboardClient posts={posts} /> {/* Pass the posts to the client-side component */}
    </div>
  );
};

export default AdminDashboard;
