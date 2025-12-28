"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, role, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div className="p-10">Loading...</div>;

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-green-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold">BICAP Admin</div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                        Tổng quan
                    </Link>

                    {role === 'farm' && (
                        <>
                            <div className="text-xs uppercase text-green-200 mt-4 mb-2 font-bold">Nông Trại</div>
                            <Link href="/dashboard/farm" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                                Quản lý Trại
                            </Link>
                            <Link href="/dashboard/farm/seasons" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                                Mùa Vụ & Nhật Ký
                            </Link>
                            <Link href="/dashboard/farm/products" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                                Sản Phẩm (Export)
                            </Link>
                        </>
                    )}

                    {role === 'retailer' && (
                        <>
                            <div className="text-xs uppercase text-green-200 mt-4 mb-2 font-bold">Nhà Bán Lẻ</div>
                            <Link href="/dashboard/retailer/market" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                                Sàn Giao Dịch
                            </Link>
                            <Link href="/dashboard/retailer/orders" className="block py-2 px-4 rounded hover:bg-green-700 transition-colors">
                                Đơn Hàng
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-green-700">
                    <div className="mb-2 text-sm text-green-100">{user.email}</div>
                    <div className="mb-4 text-xs bg-green-900 text-white inline-block px-2 py-1 rounded capitalize">{role || 'User'}</div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                    >
                        Đăng Xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
                {children}
            </main>
        </div>
    );
}
