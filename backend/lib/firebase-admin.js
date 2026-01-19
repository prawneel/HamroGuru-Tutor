const admin = require('firebase-admin');

const rawKey = (process.env.FIREBASE_PRIVATE_KEY || '').trim();
const base64 = rawKey
  .replace(/^"|"$/g, '')
  .replace(/---*BEGIN PRIVATE KEY---*/g, '')
  .replace(/---*END PRIVATE KEY---*/g, '')
  .replace(/\\n/g, '')
  .replace(/\s+/g, '');

const privateKey = `-----BEGIN PRIVATE KEY-----\n${(base64.match(/.{1,64}/g) || []).join('\n')}\n-----END PRIVATE KEY-----\n`;

if (!admin.apps.length) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.error('Firebase Admin environment variables are missing.');
    } else {
      console.log('Initializing Firebase Admin with Project:', process.env.FIREBASE_PROJECT_ID);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      console.log('Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
const adminStorage = admin.apps.length > 0 ? admin.storage() : null;

module.exports = { adminAuth, adminDb, adminStorage };
