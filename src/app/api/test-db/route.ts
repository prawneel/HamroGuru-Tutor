import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        console.log("Testing Firestore connectivity...");

        const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
        const status = {
            adminApps: admin.apps.length,
            hasAdminAuth: !!adminAuth,
            hasAdminDb: !!adminDb,
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKeyLength: rawKey.length,
            privateKeyStart: rawKey.substring(0, 50),
            privateKeyEnd: rawKey.substring(rawKey.length - 50),
        };

        if (!adminDb) {
            return NextResponse.json({
                success: false,
                error: "Firebase Admin Database not initialized",
                status
            }, { status: 500 });
        }

        const testRef = adminDb.collection('test_connection').doc('ping');

        await testRef.set({
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            message: "Connectivity test from HamroGuru API"
        });

        const doc = await testRef.get();
        if (!doc.exists) {
            throw new Error("Document was not created properly");
        }

        return NextResponse.json({
            success: true,
            message: "Firestore connection established and verified!",
            data: doc.data()
        });
    } catch (error: any) {
        console.error("Firestore test error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
