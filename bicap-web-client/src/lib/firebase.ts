import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDOD_IsX70EuYH3xRX0RimBNukEztm9DQ4",
    authDomain: "bicap-f8e2c.firebaseapp.com",
    projectId: "bicap-f8e2c",
    storageBucket: "bicap-f8e2c.firebasestorage.app",
    messagingSenderId: "249021389966",
    appId: "1:249021389966:web:62f85445948ac5807f3ddf",
    measurementId: "G-ZVDJEQN2Y4"
};

// Initialize Firebase (prevent multiple initializations)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
