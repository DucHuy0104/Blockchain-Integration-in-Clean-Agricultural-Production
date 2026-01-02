'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { loginWithGoogle, registerWithEmail, loginWithEmail, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [isRegistering, setIsRegistering] = useState(false);
    // Get role from URL or default to 'retailer'
    const roleParam = searchParams.get('role');
    const [selectedRole, setSelectedRole] = useState(roleParam || 'retailer');

    // Force login mode for admin
    useEffect(() => {
        if (selectedRole === 'admin') {
            setIsRegistering(false);
        }
    }, [selectedRole]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // Auto redirect if already logged in
    useEffect(() => {
        if (user) {
            if (user.role === 'farm') router.push('/farm');
            else if (user.role === 'retailer') router.push('/retailer');
            else if (user.role === 'shipping') router.push('/shipping');
            else if (user.role === 'admin') router.push('/admin');
            else router.push('/guest');
        }
    }, [user, router]);

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle(selectedRole);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Đăng nhập Google thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegistering) {
                // Register
                await registerWithEmail(email, password, selectedRole, fullName);
            } else {
                // Login
                // Note: For login, backend might ignore selectedRole and use existing role in DB
                // but we pass it anyway just in case backend logic allows role update on login (rare)
                // or simply to maintain consistency.
                await loginWithEmail(email, password, selectedRole);
            }
        } catch (err: any) {
            console.error(err);
            let msg = err.message || 'Authentication failed.';
            if (err.code === 'auth/email-already-in-use') msg = 'Email này đã được sử dụng.';
            if (err.code === 'auth/wrong-password') msg = 'Sai mật khẩu.';
            if (err.code === 'auth/user-not-found') msg = 'Không tìm thấy tài khoản với email này.';
            if (err.code === 'auth/invalid-email') msg = 'Email không hợp lệ.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'farm', name: 'Trang Trại (Farmer)' },
        { id: 'retailer', name: 'Nhà Bán Lẻ (Retailer)' },
        { id: 'shipping', name: 'Vận Chuyển (Shipping)' },
        { id: 'admin', name: 'Quản Trị Viên (Admin)' },
        { id: 'guest', name: 'Khách (Guest)' },
    ];

    return (
        <div className="w-full">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {isRegistering ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập'}
            </h2>

            {/* Role Selector (More needed for Register, but useful for test login to update role if backend allows) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn Vai Trò {isRegistering ? '(Bắt buộc)' : '(Test Mode)'}
                </label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                {isRegistering && (
                    <div>
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            required={isRegistering}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                )}

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : (isRegistering ? 'Đăng Ký' : 'Đăng Nhập')}
                </button>
            </form>

            {selectedRole !== 'admin' && (
                <>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="flex w-full justify-center items-center gap-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 20.4504C16.6661 20.4504 20.6062 17.2625 21.9882 12.9375H12.0003V10.7416H22.3739C22.4497 11.4583 22.4936 12.2166 22.4936 13.0125C22.4936 19.0625 18.2574 23.3625 12.0003 23.3625C5.74323 23.3625 1.50696 19.0625 1.50696 13.0125C1.50696 6.9625 5.74323 2.6625 12.0003 2.6625C15.0294 2.6625 17.5753 3.65417 19.5397 5.25417L17.2897 7.42083C16.2053 6.46667 14.4753 5.70833 12.0003 5.70833C8.25621 5.70833 5.17621 8.79167 5.17621 12.5625C5.17621 16.3333 8.25621 19.4167 12.0003 19.4167V20.4504Z"
                                fill="currentColor"
                            />
                            <path
                                d="M21.9882 12.9375C20.6062 17.2625 16.6661 20.4504 12.0003 20.4504V19.4167C15.1182 19.4167 17.8282 17.0625 18.9953 14.15H21.9882V12.9375Z"
                                fill="#34A853"
                            />
                            <path
                                d="M1.50696 13.0125C1.50696 19.0625 5.74323 23.3625 12.0003 23.3625V19.4167C8.25621 19.4167 5.17621 16.3333 5.17621 12.5625H1.50696V13.0125Z"
                                fill="#EA4335"
                            />
                            <path
                                d="M12.0003 2.6625C5.74323 2.6625 1.50696 6.9625 1.50696 13.0125H5.17621C5.17621 8.79167 8.25621 5.70833 12.0003 5.70833V2.6625Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12.0003 2.6625C15.0294 2.6625 17.5753 3.65417 19.5397 5.25417L17.2897 7.42083C16.2053 6.46667 14.4753 5.70833 12.0003 5.70833V2.6625Z"
                                fill="#4285F4"
                            />
                        </svg>
                        Google
                    </button>
                </>
            )}

            {selectedRole !== 'admin' && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                        <button
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                            }}
                            className="ml-2 font-medium text-green-600 hover:text-green-500"
                        >
                            {isRegistering ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}
