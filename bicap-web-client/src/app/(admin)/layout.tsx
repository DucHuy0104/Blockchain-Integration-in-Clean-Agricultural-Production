"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

const menuItems = [
    { name: 'Tổng quan', href: '/admin', icon: '📊' },
    { name: 'Người dùng', href: '/admin/users', icon: '👥' },
    { name: 'Trang trại', href: '/admin/farms', icon: '🚜' },
    { name: 'Sản phẩm', href: '/admin/products', icon: '📦' },
    { name: 'Báo cáo', href: '/admin/reports', icon: '🚩' },
    { name: 'Blockchain', href: '/admin/blockchain', icon: '⛓️' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl sticky top-0 h-screen z-20">
                <div className="p-8 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🛡️</span>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter">BICAP ADMIN</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hệ thống quản trị</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className={`text-xl ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                                <span>{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-800 space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                        <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-tighter">Đang đăng nhập</p>
                        <p className="text-sm font-bold truncate">Quản trị viên Hệ thống</p>
                    </div>
                    <LogoutButton className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border border-red-500/20" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                            {menuItems.find(item => item.href === pathname)?.name || 'Hệ thống'}
                        </h2>
                        <p className="text-gray-500 font-medium">Chào mừng trở lại, Admin!</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                            🔔
                        </button>
                    </div>
                </header>
                <div className="animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
}
