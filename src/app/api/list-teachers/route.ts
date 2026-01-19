import { NextResponse } from 'next/server';

// API moved to standalone backend. Use NEXT_PUBLIC_API_URL in the frontend to call the backend service.
export async function GET() {
  return NextResponse.json({
    message: 'This API has moved to the backend service. Call the backend at NEXT_PUBLIC_API_URL.',
  }, { status: 410 });
}
