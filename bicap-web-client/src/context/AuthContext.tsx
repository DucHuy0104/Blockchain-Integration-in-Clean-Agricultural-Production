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
    getAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    registerWithEmail: async () => { },
    loginWithEmail: async () => { },
    logout: async () => { },
    getAccessToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [customToken, setCustomToken] = useState<string | null>(null);
    const router = useRouter();

    // Handle Firebase Auth State Changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get freshly generated ID token
                    const token = await firebaseUser.getIdToken();
                    await syncUserWithBackend(token);
                } catch (error) {
                    console.error("Error syncing user:", error);
                    setUser(null);
                }
            } else {
                // If not firebase user, check if we have a custom mock session
                // Check localStorage as well for persistence
                const storedToken = localStorage.getItem('mockToken');
                const storedUser = localStorage.getItem('mockUser');

                if (storedToken && storedUser) {
                    console.log('🔄 Restoring session from localStorage');
                    setCustomToken(storedToken);
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (parseErr) {
                        console.error('Error parsing stored user:', parseErr);
                        setUser(null);
                    }
                } else if (!customToken) {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [customToken]); // Add customToken dependency

    const getAccessToken = async (): Promise<string | null> => {
        try {
            if (auth.currentUser) {
                return await auth.currentUser.getIdToken();
            }
            // Try customToken first, then localStorage
            const token = customToken || localStorage.getItem('mockToken');
            if (!token) {
                console.warn('⚠️ No access token available. User may need to login again.');
            }
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            // Fallback to localStorage
            return localStorage.getItem('mockToken');
        }
    };

    const syncUserWithBackend = async (token: string, desiredRole?: string, fullName?: string) => {
        try {
            // Use environment variable or fallback to localhost
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
            const backendUrl = `${apiUrl}/auth/sync-user`;

            const payload: any = {};
            if (desiredRole) payload.role = desiredRole;
            if (fullName) payload.fullName = fullName;

            const response = await axios.post(backendUrl, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 10000 // 10 second timeout
            });

            if (response.data && response.data.user) {
                setUser(response.data.user);
            } else {
                throw new Error("Backend did not return user data");
            }
        } catch (error: any) {
            console.error("Backend sync error:", error);

            // Better error messages
            if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.");
            }
            if (error.response?.status === 404) {
                throw new Error("API endpoint không tồn tại. Vui lòng kiểm tra cấu hình backend.");
            }
            if (error.response?.status === 401) {
                throw new Error("Token không hợp lệ. Vui lòng đăng nhập lại.");
            }

            // Propagate error to let the caller handle UI feedback
            throw new Error(error.response?.data?.message || error.message || "Không thể đồng bộ với server. Vui lòng thử lại.");
        }
    };

    const loginWithGoogle = async (role?: string) => {
        try {
            // Check if Firebase is properly configured
            if (!auth) {
                throw new Error("Firebase chưa được cấu hình. Vui lòng kiểm tra cấu hình Firebase.");
            }

            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            // Explicitly sync with the selected role
            await syncUserWithBackend(token, role, result.user.displayName || undefined);

        } catch (error: any) {
            console.error("Google login error:", error);

            // FALLBACK TO MOCK LOGIN (If backend rejects Google Token)
            try {
                if (auth.currentUser?.email) {
                    console.log("⚠️ Google Sync failed, trying Mock Login with Google Email...");
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                    const res = await axios.post(`${apiUrl}/auth/login`, { email: auth.currentUser.email });

                    if (res.data.success && res.data.token && res.data.user) {
                        setCustomToken(res.data.token);
                        setUser(res.data.user);
                        localStorage.setItem('mockToken', res.data.token);
                        localStorage.setItem('mockUser', JSON.stringify(res.data.user));
                        return;
                    }
                }
            } catch (fallbackErr) {
                console.error("Mock Login Fallback failed:", fallbackErr);
            }

            // Better error messages
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error("Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.");
            }
            if (error.code === 'auth/popup-blocked') {
                throw new Error("Trình duyệt đã chặn popup. Vui lòng cho phép popup và thử lại.");
            }
            if (error.code === 'auth/invalid-api-key') {
                throw new Error("Firebase API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
            }

            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string, role?: string, fullName?: string) => {
        try {
            // Check if Firebase is properly configured
            if (!auth) {
                throw new Error("Firebase chưa được cấu hình. Vui lòng kiểm tra cấu hình Firebase.");
            }

            if (!fullName && role !== 'guest') {
                throw new Error("Vui lòng nhập họ và tên.");
            }

            const result = await createUserWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();

            await syncUserWithBackend(token, role, fullName);
        } catch (error: any) {
            console.error("Email register error:", error);

            // FALLBACK TO MOCK LOGIN
            try {
                if (email) {
                    console.log("⚠️ Register Sync failed, trying Mock Login/Register...");
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                    // Using login endpoint for mock register is fine as my backend handles it
                    const res = await axios.post(`${apiUrl}/auth/login`, { email });

                    if (res.data.success && res.data.token && res.data.user) {
                        setCustomToken(res.data.token);
                        setUser(res.data.user);
                        localStorage.setItem('mockToken', res.data.token);
                        localStorage.setItem('mockUser', JSON.stringify(res.data.user));
                        return;
                    }
                }
            } catch (fallbackErr) {
                console.error("Register Fallback failed:", fallbackErr);
            }

            // Better error messages
            if (error.code === 'auth/email-already-in-use') {
                throw new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.");
            }
            if (error.code === 'auth/invalid-email') {
                throw new Error("Email không hợp lệ. Vui lòng kiểm tra lại.");
            }
            if (error.code === 'auth/weak-password') {
                throw new Error("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn (ít nhất 6 ký tự).");
            }
            if (error.code === 'auth/invalid-api-key') {
                throw new Error("Firebase API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
            }

            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string, role?: string) => {
        try {
            if (!auth) throw new Error("Firebase not config");

            // 1. Try Firebase Login
            const result = await signInWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();
            setCustomToken(null);
            await syncUserWithBackend(token, role);

        } catch (error: any) {
            // Log as info since we are using Mock Data intentionally in development
            console.info("ℹ️ Firebase Login bypassed or failed (Normal for Mock Accounts). Error Code:", error.code);

            // 2. If Firebase/Sync fails, try Backend Mock Login
            // ANY error from the primary login flow should trigger a fallback attempt
            console.log("🔄 Chuyển sang chế độ Đăng nhập giả lập (Mock Login)...");

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                const res = await axios.post(`${apiUrl}/auth/login`, { email, password });

                if (res.data.success && res.data.token && res.data.user) {
                    console.log("✅ Mock Login Successful!");
                    console.log("💾 Saving token to localStorage:", res.data.token.substring(0, 20) + "...");
                    
                    setCustomToken(res.data.token);
                    setUser(res.data.user);

                    // Persist to localStorage
                    localStorage.setItem('mockToken', res.data.token);
                    localStorage.setItem('mockUser', JSON.stringify(res.data.user));

                    // Verify token was saved
                    const savedToken = localStorage.getItem('mockToken');
                    if (savedToken) {
                        console.log("✅ Token saved successfully to localStorage");
                    } else {
                        console.error("❌ Failed to save token to localStorage");
                    }

                    return; // Success!
                }
            } catch (backendErr) {
                console.error("Mock Login also failed:", backendErr);
            }

            const isAuthError = true; // Force true to show "Invalid Credentials" message at end

            // Better error messages
            if (error.code === 'auth/user-not-found') {
                throw new Error("Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.");
            }
            if (error.code === 'auth/wrong-password') {
                throw new Error("Sai mật khẩu. Vui lòng kiểm tra lại.");
            }
            if (error.code === 'auth/invalid-email') {
                throw new Error("Email không hợp lệ. Vui lòng kiểm tra lại.");
            }
            if (error.code === 'auth/invalid-credential') {
                throw new Error("Thông tin đăng nhập không chính xác (Firebase & Mock).");
            }
            if (error.code === 'auth/invalid-api-key') {
                throw new Error("Firebase API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
            }
            if (error.code === 'auth/too-many-requests') {
                throw new Error("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau vài phút.");
            }

            // Fallback error for any handled auth error
            if (isAuthError) {
                throw new Error("Thông tin đăng nhập không chính xác (Kiểm tra lại Email/Pass hoặc thử Mock Account).");
            }

            throw error;
        }
    };


    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setCustomToken(null);
            setUser(null);

            // Clear localStorage
            localStorage.removeItem('mockToken');
            localStorage.removeItem('mockUser');

            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, registerWithEmail, loginWithEmail, logout, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
