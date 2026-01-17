
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { userId, name, email, role } = await req.json();

        if (!userId || !name || !email || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Set custom claims for role
        await adminAuth.setCustomUserClaims(userId, { role });

        // Store additional user data in Firestore
        await adminDb.collection('users').doc(userId).set({
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        const user = {
            id: userId,
            name,
            email,
            role,
        };


        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (error: any) {
        console.error('Student registration full error:', error);
        return NextResponse.json({
            message: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

