import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if keys are actually provided and not empty
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    const isNewApp = getApps().length === 0;
    app = isNewApp ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);

    if (isNewApp && typeof window !== 'undefined') {
      // Enable offline persistence with multi-tab support for browser environments
      try {
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        });
      } catch (persistenceError) {
        // Fall back to standard Firestore if persistence fails
        console.warn('Firestore persistence not available, using standard mode:', persistenceError.message);
        db = getFirestore(app);
      }
    } else {
      db = getFirestore(app);
    }
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
}

export { app, auth, db };
