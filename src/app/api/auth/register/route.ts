
import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    const body = await request.text();
    const res = await fetch(`${BACKEND.replace(/\/$/, '')}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') || 'application/json' }, body });
    const text = await res.text();
    return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}
