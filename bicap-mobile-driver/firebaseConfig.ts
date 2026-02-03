import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration sourced from web client fallback
const firebaseConfig = {
    apiKey: "AIzaSyB_TQhMlq-AK0K17NBJJ-y5RW0ayS2qCOo",
    authDomain: "bicap-bc2da.firebaseapp.com",
    projectId: "bicap-bc2da",
    storageBucket: "bicap-bc2da.firebasestorage.app",
    messagingSenderId: "434741285818",
    appId: "1:434741285818:web:f29609bb153ed7e78c4383",
    measurementId: "G-N2JNRLSV95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
