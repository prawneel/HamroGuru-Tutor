import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    // Basic protective check: prefer environment variable, fallback to provided password
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pranil@admin123";
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    // Delete teacher profile doc
    try {
      await adminDb.collection("teacherProfiles").doc(String(id)).delete();
    } catch (e) {
      console.error("Failed to delete teacherProfiles doc:", e);
    }

    // Delete user doc
    try {
      await adminDb.collection("users").doc(String(id)).delete();
    } catch (e) {
      console.error("Failed to delete users doc:", e);
    }

    // Attempt to delete auth user if present
    try {
      await adminAuth.deleteUser(String(id));
    } catch (e) {
      // Not fatal; may not exist or adminAuth not configured
      console.warn("deleteUser failed or not configured:", e.message || e);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ ok: false, error: error.message || String(error) }, { status: 500 });
  }
}
