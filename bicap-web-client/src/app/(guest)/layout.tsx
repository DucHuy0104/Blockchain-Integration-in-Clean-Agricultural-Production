import type { Metadata } from 'next'
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
    title: 'Guest Access | BICAP',
    description: 'Guest Access',
}

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black">
            <nav className="bg-teal-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">BICAP Guest Access</h1>
                    <div className="space-x-4 flex items-center">
                        <span>Traceability</span>
                        <span>About</span>
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
