import type { Metadata } from 'next'
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
    title: 'Shipping Portal | BICAP',
    description: 'Shipping Management Portal',
}

export default function ShippingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-orange-50 dark:bg-orange-950">
            <nav className="bg-orange-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Shipping Portal</h1>
                    <div className="space-x-4 flex items-center">
                        <span>Shipments</span>
                        <span>Drivers</span>
                        <span>Vehicles</span>
                        <LogoutButton />
                    </div>
                </div>
            </nav>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
        </div>
    )
}
