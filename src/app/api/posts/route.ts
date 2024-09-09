// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { createPost, getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const post = await createPost(data);
  return NextResponse.json(post, { status: 201 });
}
