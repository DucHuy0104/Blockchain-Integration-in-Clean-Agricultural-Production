"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut, getIdToken } from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    role: string | null; // 'farm', 'retailer', 'admin', 'shipping'
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    role: null,
    logout: async () => { },
    getToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);

                // After firebase login, sync with backend to get Role
                try {
                    const token = await currentUser.getIdToken();
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync-user`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Assuming backend returns user object with Role
                    if (res.data && res.data.user) {
                        setRole(res.data.user.role);
                    }
                } catch (error) {
                    console.error("Failed to sync user role:", error);
                    // Optionally force logout if sync fails?
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setRole(null);
    };

    const getToken = async () => {
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, loading, role, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};
