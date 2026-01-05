'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useState } from 'react';

export default function FarmHeader() {
    return (
        <nav className="bg-green-600 text-white px-4 py-2 sticky top-0 z-50 shadow-md">
            <div className="w-full flex justify-between items-center gap-2">
                <Link href="/farm" className="text-lg font-bold whitespace-nowrap hidden lg:block">BICAP Farm</Link>
                <div className="flex items-center gap-1 justify-end w-full lg:w-auto">
                    <NavLink href="/farm" label="Tổng quan" />
                    <NavLink href="/farm/seasons" label="Mùa vụ" />
                    <NavLink href="/farm/products" label="Sản phẩm" />
                    <NavLink href="/farm/orders" label="Đơn hàng" />

                    {/* <NavLink href="/farm/shipments" label="Vận chuyển" /> - Moved to Orders Page */}
                    <NavLink href="/farm/reports/shipping" label="Báo cáo vận chuyển" />
                    <NavLink href="/farm/monitoring" label="Giám sát" icon="🌡️" />
                    <NavLink href="/farm/services" label="Dịch vụ" />
                    <NavLink href="/farm/notifications" label="Thông báo" icon="🔔" highlight />

                    <div className="border-l border-green-400 pl-1 ml-1 flex gap-1">
                        <NavLink href="/farm/info" label="Trang trại" />
                        <NavLink href="/farm/profile" label="Hồ sơ" />
                        <NavLink href="/farm/reports" label="Báo cáo" />
                    </div>



                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, highlight, target }: { href: string, label: string, icon?: string, highlight?: boolean, target?: string }) {
    return (
        <Link href={href} target={target} className={`flex flex-col items-center hover:bg-green-700 px-2 py-1.5 rounded transition-colors group ${highlight ? 'text-yellow-300' : 'text-white'}`}>
            <span className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap ${highlight ? 'text-yellow-300' : 'text-white'}`}>
                {icon && <span className="mr-1">{icon}</span>}
                {label}
            </span>
        </Link>
    );
}
