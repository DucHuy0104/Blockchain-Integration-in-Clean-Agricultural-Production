'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserData {
    id: number;
    firebaseUid: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    loginWithGoogle: (role?: string) => Promise<void>;
    registerWithEmail: (email: string, password: string, role?: string, fullName?: string) => Promise<void>;
    loginWithEmail: (email: string, password: string, role?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    registerWithEmail: async () => { },
    loginWithEmail: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Handle Firebase Auth State Changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get freshly generated ID token
                    const token = await firebaseUser.getIdToken();

                    // Sync with backend to get role and full user data
                    // Note: We might not have the desired role here if it's an auto-login
                    // So for auto-login we assume the role is already set or we accept what's in DB
                    syncUserWithBackend(token);
                } catch (error) {
                    console.error("Error syncing user:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const syncUserWithBackend = async (token: string, desiredRole?: string, fullName?: string) => {
        try {
            // Assuming backend is running on port 5001 as seen in server.js
            // In production/dev we should use an env var
            const backendUrl = 'http://localhost:5001/api/auth/sync-user';

            const payload: any = {};
            if (desiredRole) payload.role = desiredRole;
            if (fullName) payload.fullName = fullName;

            const response = await axios.post(backendUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.user) {
                setUser(response.data.user);

                // Redirect logic based on role (optional here, usually done in Login page or Protected Route)
                // But for auto-login it's handled by the page or middleware
            }
        } catch (error: any) {
            console.error("Backend sync error:", error);
            // Propagate error to let the caller handle UI feedback
            throw new Error(error.response?.data?.message || error.message || "Failed to sync with backend");
        }
    };

    const loginWithGoogle = async (role?: string) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            // Explicitly sync with the selected role
            await syncUserWithBackend(token, role);

        } catch (error) {
            console.error("Google login error:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string, role?: string, fullName?: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();

            await syncUserWithBackend(token, role, fullName);
        } catch (error) {
            console.error("Email register error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string, role?: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();

            await syncUserWithBackend(token, role);
        } catch (error) {
            console.error("Email login error:", error);
            throw error;
        }
    };


    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, registerWithEmail, loginWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
