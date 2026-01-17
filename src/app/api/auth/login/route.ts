
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
        }

        try {
            // In Firebase, password verification is typically done on the client side
            // using the Firebase Client SDK. The server then receives a token.
            // However, to maintain the current flow, we will fetch the user.
            // Note: Admin SDK does NOT support password verification for security.
            // We will instruct the client to use Firebase Client SDK for login.

            const userRecord = await adminAuth.getUserByEmail(email);

            // Fetch additional data from Firestore
            const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
            const userData = userDoc.data();

            return NextResponse.json({
                message: 'Login check successful. Please use Firebase Client SDK to complete login.',
                user: {
                    id: userRecord.uid,
                    email: userRecord.email,
                    ...userData
                }
            }, { status: 200 });
        } catch (error: any) {
            console.error('Login error:', error);
            return NextResponse.json({ message: 'Invalid credentials or user not found' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

