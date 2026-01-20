import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  const res = await fetch(`${BACKEND.replace(/\/$/, '')}/api/teacher/${encodeURIComponent(userId)}`);
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${BACKEND.replace(/\/$/, '')}/api/auth/register-teacher`, { method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') || 'application/json' }, body });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}
