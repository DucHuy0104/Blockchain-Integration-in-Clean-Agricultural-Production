import type { Metadata } from 'next'
import FarmHeader from '@/components/FarmHeader';

export const metadata: Metadata = {
    title: 'Farm Dashboard | BICAP',
    description: 'Farm Management Dashboard',
}

export default function FarmLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-green-50 dark:bg-green-950">
            <FarmHeader />
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
        </div>
    )
}
