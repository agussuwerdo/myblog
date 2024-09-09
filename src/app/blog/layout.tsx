// src/app/blog/layout.tsx
export const metadata = {
  title: 'All Blog Posts',
};

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default BlogLayout;
