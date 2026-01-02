import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">BICAP System</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/farm" className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h2 className="text-2xl font-semibold mb-2">Farm Management &rarr;</h2>
                    <p>Dành cho Trang trại</p>
                </Link>

                <Link href="/retailer" className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h2 className="text-2xl font-semibold mb-2">Retailer &rarr;</h2>
                    <p>Dành cho Nhà bán lẻ</p>
                </Link>

                <Link href="/shipping" className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h2 className="text-2xl font-semibold mb-2">Shipping &rarr;</h2>
                    <p>Dành cho Vận chuyển</p>
                </Link>

                <Link href="/admin" className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h2 className="text-2xl font-semibold mb-2">Admin &rarr;</h2>
                    <p>Quản trị hệ thống</p>
                </Link>

                <Link href="/guest" className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <h2 className="text-2xl font-semibold mb-2">Guest &rarr;</h2>
                    <p>Khách truy cập</p>
                </Link>
            </div>
        </main>
    )
}
