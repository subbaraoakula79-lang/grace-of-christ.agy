import * as admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

const isFirebaseConfigured = !!(projectId && clientEmail && privateKey && storageBucket);

if (isFirebaseConfigured) {
  try {
    // Prevent duplicate initializations
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
  }
} else {
  console.warn('⚠️ Firebase Storage is not fully configured in env variables.');
}

export const bucket = isFirebaseConfigured ? admin.storage().bucket() : null;
export { isFirebaseConfigured };
