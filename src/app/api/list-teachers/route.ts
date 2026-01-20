import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.search;
  const res = await fetch(`${BACKEND.replace(/\/$/, '')}/api/list-teachers${query}`, { method: 'GET' });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}
