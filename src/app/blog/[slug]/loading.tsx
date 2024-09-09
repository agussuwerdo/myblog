// src/app/blog/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Loading...</h1>
      <p>Please wait while the blog post is loading.</p>
    </div>
  );
}
