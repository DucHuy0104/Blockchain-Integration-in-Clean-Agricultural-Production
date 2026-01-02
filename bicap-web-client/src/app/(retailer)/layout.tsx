import type { Metadata } from 'next'
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
    title: 'Retailer Portal | BICAP',
    description: 'Retailer Management Portal',
}

export default function RetailerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-blue-50 dark:bg-blue-950">
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Retailer Portal</h1>
                    <div className="space-x-4 flex items-center">
                        <span>Orders</span>
                        <span>Inventory</span>
                        <span>Suppliers</span>
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
