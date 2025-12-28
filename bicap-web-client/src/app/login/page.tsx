"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { user, role } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            // Logic to redirect based on role could go here, for now just dashboard
            if (role === 'farm') router.push('/dashboard/farm');
            else if (role === 'retailer') router.push('/dashboard/retailer');
            else router.push('/dashboard');
        }
    }, [user, role, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // AuthContext will detect change and sync role, then useEffect above redirects
        } catch (err: any) {
            console.error(err);
            setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email/password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-green-700">BICAP Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Chưa có tài khoản? Liên hệ Admin để cấp quyền.
                </p>
            </div>
        </div>
    );
}
