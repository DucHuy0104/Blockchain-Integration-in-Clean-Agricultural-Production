import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Validate Firebase Configuration
const requiredEnvVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if any required env vars are missing or still have placeholder values
const missingVars: string[] = [];
const placeholderPatterns = ['your_', 'placeholder', 'example', 'change_this'];

Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || placeholderPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
        missingVars.push(`NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
    }
});

// Only show warning in development mode if missing vars but we have fallback values
// Set to false to completely silence this warning
const SHOW_FIREBASE_WARNING = false; // Set to true if you want to see warnings

if (missingVars.length > 0 && typeof window !== 'undefined' && SHOW_FIREBASE_WARNING) {
    // Only log once to avoid console spam
    if (!(window as any).__FIREBASE_WARNING_SHOWN) {
        console.warn('⚠️ Firebase Environment Variables:', {
            message: 'Some Firebase environment variables are missing. Using fallback values for development.',
            missing: missingVars,
            note: 'For production, please configure Firebase in your .env.local file. See FIREBASE_ENV_TEMPLATE.txt for instructions.',
        });
        (window as any).__FIREBASE_WARNING_SHOWN = true;
    }
}

// Helper function to check if value is a placeholder
const isPlaceholder = (value: string | undefined): boolean => {
    if (!value) return true;
    const placeholderPatterns = ['your_', 'placeholder', 'example', 'change_this'];
    return placeholderPatterns.some(pattern => value.toLowerCase().includes(pattern));
};

// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Use fallback values if env vars are missing or contain placeholders
const firebaseConfig = {
    apiKey: (!isPlaceholder(requiredEnvVars.apiKey) && requiredEnvVars.apiKey) || "AIzaSyB_TQhMlq-AK0K17NBJJ-y5RW0ayS2qCOo",
    authDomain: (!isPlaceholder(requiredEnvVars.authDomain) && requiredEnvVars.authDomain) || "bicap-bc2da.firebaseapp.com",
    projectId: (!isPlaceholder(requiredEnvVars.projectId) && requiredEnvVars.projectId) || "bicap-bc2da",
    storageBucket: (!isPlaceholder(requiredEnvVars.storageBucket) && requiredEnvVars.storageBucket) || "bicap-bc2da.firebasestorage.app",
    messagingSenderId: (!isPlaceholder(requiredEnvVars.messagingSenderId) && requiredEnvVars.messagingSenderId) || "434741285818",
    appId: (!isPlaceholder(requiredEnvVars.appId) && requiredEnvVars.appId) || "1:434741285818:web:f29609bb153ed7e78c4383",
    measurementId: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) || "G-N2JNRLSV95"
};

// Initialize Firebase (prevent multiple initializations)
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
} catch (error: any) {
    console.error('❌ Firebase Initialization Error:', error);
    if (typeof window !== 'undefined') {
        console.error('Firebase config:', {
            apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
            authDomain: firebaseConfig.authDomain || 'MISSING',
            projectId: firebaseConfig.projectId || 'MISSING',
        });
    }
    // Re-throw to prevent silent failures
    throw new Error(`Firebase initialization failed: ${error.message}. Please check your Firebase configuration in .env file.`);
}

export { auth, storage, googleProvider };
