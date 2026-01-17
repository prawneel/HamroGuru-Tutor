import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            userId,
            email,
            name,
            phone,
            age,
            gender,
            address,
            district,
            city,
            highestQualification,
            subjects,
            teachingMode,
            experience,
            rateType,
            rateAmount,
            availability,
            whatsappNumber,
            whatsappConsent,
            additionalInfo
        } = body;

        console.log("Registering teacher with userId:", userId, "email:", email);

        if (!userId || !email) {
            console.error("Missing userId or email in registration body");
            return NextResponse.json(
                { error: "UserId and email are required" },
                { status: 400 }
            );
        }

        // Set custom claims for role
        await adminAuth.setCustomUserClaims(userId, { role: "teacher" });

        // Store user and teacher profile in Firestore
        const userRef = adminDb.collection('users').doc(userId);
        const teacherProfileRef = adminDb.collection('teacherProfiles').doc(userId);

        const batch = adminDb.batch();

        batch.set(userRef, {
            email,
            name,
            role: "teacher",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        batch.set(teacherProfileRef, {
            userId: userId,
            phone,
            age,
            gender,
            address,
            district,
            city,
            highestQualification,
            subjects: Array.isArray(subjects) ? subjects.join(", ") : subjects,
            teachingMode,
            experience,
            rateType,
            rateAmount,
            availability,
            whatsappNumber,
            whatsappConsent,
            additionalInfo,
            rating: 0,
            reviews: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await batch.commit();

        const user = {
            id: userId,
            email,
            name,
            role: "teacher",
            teacherProfile: {
                phone,
                age,
                gender,
                address,
                district,
                city,
                highestQualification,
                subjects,
                teachingMode,
                experience,
                rateType,
                rateAmount,
                availability,
                whatsappNumber,
                whatsappConsent,
                additionalInfo,
            }
        };

        return NextResponse.json(
            { message: "Teacher registered successfully", user },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Teacher registration full error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error", stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
            { status: 500 }
        );
    }
}

