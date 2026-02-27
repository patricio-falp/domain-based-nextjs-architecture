import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/* ─── Schemas ────────────────────────────────────────────────────── */

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  company: z.object({ name: z.string() }),
});

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type DemoUser = z.infer<typeof userSchema>;
export type DemoPost = z.infer<typeof postSchema>;

/* ─── Fetchers ───────────────────────────────────────────────────── */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function fetchUsers(): Promise<DemoUser[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return z.array(userSchema).parse(data);
}

async function fetchPosts(userId: number): Promise<DemoPost[]> {
  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return z.array(postSchema).parse(data);
}

/* ─── Hooks ──────────────────────────────────────────────────────── */

export function useDemoUsers() {
  return useQuery({
    queryKey: ['demo', 'users'],
    queryFn: fetchUsers,
  });
}

export function useDemoPosts(userId: number | null) {
  return useQuery({
    queryKey: ['demo', 'posts', userId],
    queryFn: () => fetchPosts(userId!),
    enabled: userId !== null,
  });
}
