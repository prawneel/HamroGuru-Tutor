import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        console.log("Fetching all teachers from Firestore...");

        // Get all teacher profiles
        const teachersSnapshot = await adminDb.collection('teacherProfiles').get();
        const teachers = [];

        for (const doc of teachersSnapshot.docs) {
            const teacherData = doc.data();

            // Get corresponding user data
            let userData = null;
            try {
                const userDoc = await adminDb.collection('users').doc(doc.id).get();
                if (userDoc.exists) {
                    userData = userDoc.data();
                }
            } catch (e) {
                console.error(`Error fetching user for ${doc.id}:`, e);
            }

            teachers.push({
                id: doc.id,
                teacherProfile: teacherData,
                userData: userData
            });
        }

        console.log(`Found ${teachers.length} teachers`);

        return NextResponse.json({
            success: true,
            count: teachers.length,
            teachers: teachers
        });
    } catch (error: any) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
