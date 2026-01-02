import type { Metadata } from 'next'
import RetailerHeader from '@/components/RetailerHeader';

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
            <RetailerHeader />
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
        </div>
    )
}
