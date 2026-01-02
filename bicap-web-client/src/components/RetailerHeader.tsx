'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { usePathname } from 'next/navigation';

export default function RetailerHeader() {
    const pathname = usePathname();

    return (
        <nav className="bg-blue-600 text-white px-4 py-2 sticky top-0 z-50 shadow-md">
            <div className="w-full flex justify-between items-center gap-2">
                <Link href="/retailer" className="text-lg font-bold whitespace-nowrap hidden lg:block">BICAP Retailer</Link>
                <div className="flex items-center gap-1 justify-end w-full lg:w-auto">
                    <NavLink href="/retailer/market" label="Sàn Nông Sản" icon="🏪" highlight currentPath={pathname} />
                    <NavLink href="/retailer/orders" label="Đơn hàng" icon="📦" currentPath={pathname} />
                    <NavLink href="/retailer/reports" label="Báo cáo" icon="📝" currentPath={pathname} />
                    <NavLink href="/retailer/notifications" label="Thông báo" icon="🔔" currentPath={pathname} />

                    <div className="border-l border-blue-400 pl-1 ml-1 flex gap-1">
                        <NavLink href="/retailer/profile" label="Hồ sơ" icon="👤" currentPath={pathname} />
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, label, icon, highlight, currentPath }: { href: string, label: string, icon?: string, highlight?: boolean, currentPath: string }) {
    const isActive = currentPath === href || (href !== '/retailer' && currentPath.startsWith(href));

    return (
        <Link href={href} className={`flex flex-col items-center hover:bg-blue-700 px-2 py-1.5 rounded transition-colors group ${highlight ? 'text-yellow-300' : 'text-white'} ${isActive ? 'bg-blue-700' : ''}`}>
            <span className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap ${highlight ? 'text-yellow-300' : 'text-white'}`}>
                {icon && <span className="mr-1">{icon}</span>}
                {label}
            </span>
        </Link>
    );
}
