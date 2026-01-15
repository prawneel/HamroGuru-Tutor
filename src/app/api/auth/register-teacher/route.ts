import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            email,
            password,
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

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        // Create user and teacher profile in a transaction
        const user = await db.user.create({
            data: {
                email,
                password, // In a real app, hash this!
                name,
                role: "teacher",
                teacherProfile: {
                    create: {
                        phone,
                        age,
                        gender,
                        address,
                        district,
                        city,
                        highestQualification,
                        subjects: subjects.join(", "),
                        teachingMode,
                        experience,
                        rateType,
                        rateAmount,
                        availability,
                        whatsappNumber,
                        whatsappConsent,
                        additionalInfo,
                    },
                },
            } as any,
            include: {
                teacherProfile: true,
            } as any,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user as any;

        return NextResponse.json(
            { message: "Teacher registered successfully", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Teacher registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
