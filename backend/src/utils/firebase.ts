import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET
  ? process.env.FIREBASE_STORAGE_BUCKET.replace(/^gs:\/\//, '').trim()
  : undefined;

const isFirebaseConfigured = !!(projectId && clientEmail && privateKey && storageBucket);
let isInitialized = false;

if (isFirebaseConfigured) {
  try {
    // Prevent duplicate initializations
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    }
    isInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
  }
} else {
  console.warn('⚠️ Firebase Storage is not fully configured in env variables.');
}

// Lazy getter for the bucket to prevent module-load crashes if configuration fails or is incomplete
export const getBucket = () => {
  if (isFirebaseConfigured && isInitialized) {
    try {
      return getStorage().bucket();
    } catch (e) {
      console.error('Failed to get Firebase storage bucket:', e);
      return null;
    }
  }
  return null;
};

export { isFirebaseConfigured };
