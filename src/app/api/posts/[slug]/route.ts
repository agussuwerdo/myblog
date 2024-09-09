// src/app/api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/posts';

// GET a post by slug
export async function GET(
  req: Request, 
  { params }: { params: { slug: string } }
) {
  const post = await getPostBySlug(params.slug);
  if (post) {
    return NextResponse.json(post);
  } else {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }
}

// UPDATE a post by slug (PUT)
export async function PUT(
  req: Request, 
  { params }: { params: { slug: string } }
) {
  try {
    const data = await req.json();
    const updatedPost = await updatePost(params.slug, data);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post by slug
export async function DELETE(
  req: Request, 
  { params }: { params: { slug: string } }
) {
  try {
    await deletePost(params.slug);
    return NextResponse.json({ message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
