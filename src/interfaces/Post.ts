// src/interfaces/Post.ts

export interface Post {
  _id?: string; // MongoDB automatically assigns an _id field
  title: string;
  slug: string;
  content: string;
  createdAt?: Date; // Optional, since MongoDB will auto-create this
  updatedAt?: Date; // Optional, MongoDB updates this on edit
}
