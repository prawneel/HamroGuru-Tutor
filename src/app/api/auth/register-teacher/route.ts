import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: 'This API has moved to the backend service. Call the backend at NEXT_PUBLIC_API_URL.' }, { status: 410 });
}

