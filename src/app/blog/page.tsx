// src/app/blog/page.tsx
import BlogListingClient from './BlogListingClient'; // Client-side component

const BlogListingPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Render the client component to fetch and display blog posts */}
      <BlogListingClient />
    </div>
  );
};

export default BlogListingPage;
