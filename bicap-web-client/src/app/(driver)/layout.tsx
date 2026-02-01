"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Việc hôm nay", href: "/driver/dashboard", icon: "📋" },
        // { name: "Lịch sử", href: "/driver/history", icon: "🕒" },
        { name: "Báo cáo", href: "/driver/reports", icon: "⚠️" },
        // { name: "Tài khoản", href: "/driver/profile", icon: "👤" },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-10 pb-5">
            {/* Header Mobile First Design */}
            <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
                <div className="max-w-md mx-auto px-4 h-16 flex justify-between items-center">

                    {/* Brand */}
                    <Link href="/driver/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        🚛 BICAP Driver
                    </Link>

                    {/* User & Menu */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium hidden sm:block">{user?.fullName || "Tài xế"}</span>
                        <button
                            onClick={handleLogout}
                            className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            {/* SUB-NAVBAR (Bottom Fixed for Mobile Feel) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
                <div className="flex justify-around items-center max-w-md mx-auto h-16">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <span className="text-2xl">{link.icon}</span>
                                <span className="text-[10px] uppercase">{link.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-md mx-auto w-full p-4 mb-20 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
