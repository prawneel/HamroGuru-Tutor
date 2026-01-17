import * as admin from "firebase-admin";

const rawKey = (process.env.FIREBASE_PRIVATE_KEY || "").trim();
const base64 = rawKey
    .replace(/^"|"$/g, "")
    .replace(/---*BEGIN PRIVATE KEY---*/, "")
    .replace(/---*END PRIVATE KEY---*/, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "");

const privateKey = `-----BEGIN PRIVATE KEY-----\n${base64.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----\n`;

if (!admin.apps.length) {
    try {
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
            console.error("Firebase Admin environment variables are missing.");
        } else {
            console.log("Initializing Firebase Admin with Project:", process.env.FIREBASE_PROJECT_ID);
            console.log("Sanitized PKey (first 35):", JSON.stringify(privateKey.substring(0, 35)));
            console.log("Sanitized PKey (last 35):", JSON.stringify(privateKey.substring(privateKey.length - 35)));
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
                databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
            });
            console.log("Firebase Admin initialized successfully");
        }
    } catch (error: any) {
        console.error("Firebase admin initialization error:", error);
    }
}

// Use getters to prevent top-level initialization errors from crashing the app
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null as any;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null as any;
export const adminStorage = admin.apps.length > 0 ? admin.storage() : null as any;
