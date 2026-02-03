'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useState } from 'react';
import { usePathname } from 'next/navigation';


export default function FarmHeader() {
    const pathname = usePathname();

    return (
        <nav className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white px-2 py-2 sticky top-0 z-50 shadow-xl border-b border-green-700/30">
            <div className="w-full flex justify-between items-center gap-1 max-w-7xl mx-auto">
                <Link href="/farm" className="text-lg font-extrabold whitespace-nowrap flex items-center gap-1 hover:opacity-90 transition-opacity">
                    <span className="text-xl">🌾</span>
                    <span className="hidden sm:inline">BICAP Farm</span>
                </Link>
                <div className="flex-grow"></div>

                <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-0.5">
                    <NavLink href="/farm" label="Tổng quan" currentPath={pathname || ''} exact />
                    <NavLink href="/farm/seasons" label="Mùa vụ" currentPath={pathname} />
                    <NavLink href="/farm/products" label="Sản phẩm" currentPath={pathname} />
                    <NavLink href="/farm/orders" label="Đơn hàng" currentPath={pathname} />
                    <NavLink href="/farm/reports" label="Hỗ trợ" currentPath={pathname} exact />
                    <NavLink href="/farm/reports/shipping" label="Vận chuyển" currentPath={pathname} />
                    <NavLink href="/farm/monitoring" label="Giám sát" currentPath={pathname} />
                    <NavLink href="/farm/services" label="Dịch vụ" currentPath={pathname} />
                    <NavLink href="/farm/notifications" label="Thông báo" currentPath={pathname} highlight />

                    <div className="border-l border-white/20 pl-1 ml-1 flex gap-0.5">
                        <NavLink href="/farm/info" label="Trang trại" currentPath={pathname} />
                        <NavLink href="/farm/profile" label="Hồ sơ" currentPath={pathname} />
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, highlight, target, currentPath, exact }: { href: string, label: string, icon?: string, highlight?: boolean, target?: string, currentPath: string, exact?: boolean }) {
    const isActive = exact
        ? currentPath === href
        : currentPath.startsWith(href);

    return (
        <Link
            href={href}
            target={target}
            className={`flex flex-col items-center px-1.5 py-1 rounded-md transition-all duration-200 group relative ${isActive
                ? 'bg-white/20 backdrop-blur-sm shadow-sm'
                : highlight
                    ? 'hover:bg-yellow-500/20 text-yellow-200'
                    : 'hover:bg-white/10 text-white'
                }`}
        >
            <span className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap flex items-center gap-0.5 ${highlight ? 'text-yellow-200' : 'text-white'
                }`}>
                {icon && <span className="text-xs">{icon}</span>}
                {label}
            </span>
            {isActive && (
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-white rounded-full"></div>
            )}
        </Link>
    );
}
