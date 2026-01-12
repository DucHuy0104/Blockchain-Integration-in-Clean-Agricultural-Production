'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Danh sách các link điều hướng
  const navLinks = [
    { name: 'Tổng quan', href: '/shipping', icon: '📊' }, // Dashboard
    { name: 'Quản lý Đơn hàng', href: '/shipping/shipments', icon: '📦' },
    { name: 'Tài xế & Đội xe', href: '/shipping/drivers', icon: '🚚' },
    { name: 'Bản đồ Trực tiếp', href: '/shipping/map', icon: '🗺️' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- HEADER CHUYÊN NGHIỆP --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* 1. Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-lg">
                B
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                BICAP <span className="text-blue-600">Logistics</span>
              </span>
            </Link>

            {/* 2. Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                        : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                  >
                    <span>{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* 3. User & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-700">{user?.email || 'Quản lý Vận chuyển'}</p>
                <p className="text-xs text-slate-400">Admin Kho vận</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"
              >
                <span>🚪</span> <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH (PAGE) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
