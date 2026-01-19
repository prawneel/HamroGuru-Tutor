import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const profile = await (db as any).teacherProfile.findUnique({
            where: { userId },
            include: { user: true }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ profile });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, ...profileData } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Clean subjects if it's an array
        if (Array.isArray(profileData.subjects)) {
            profileData.subjects = profileData.subjects.join(", ");
        }

        const updatedProfile = await (db as any).teacherProfile.update({
            where: { userId },
            data: {
                ...profileData,
                import { NextResponse } from "next/server";

                export async function GET() {
                  return NextResponse.json({ message: 'This API has moved to the backend service. Call the backend at NEXT_PUBLIC_API_URL.' }, { status: 410 });
                }

                export async function POST() {
                  return NextResponse.json({ message: 'This API has moved to the backend service. Call the backend at NEXT_PUBLIC_API_URL.' }, { status: 410 });
                }
}
