import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            BICAP System
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto font-light">
                            Blockchain Integration in Clean Agricultural Production
                        </p>
                        <p className="mt-4 text-green-50 max-w-2xl mx-auto text-sm md:text-base opacity-90">
                            Hệ thống quản lý chuỗi cung ứng nông sản sạch minh bạch, an toàn và hiệu quả ứng dụng công nghệ Blockchain.
                        </p>
                    </div>
                </div>
                {/* Decorative curve */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
                    <svg className="relative block w-[calc(114%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50 dark:fill-slate-900"></path>
                    </svg>
                </div>
            </div>

            {/* Portal Selection Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cổng Truy Cập</h2>
                    <p className="text-gray-500 dark:text-gray-400">Vui lòng chọn vai trò của bạn để đăng nhập vào hệ thống</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Farm */}
                    <Link href="/login?role=farm" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-green-500"></div>
                        <div className="p-8">
                            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">Farm Management</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Quản lý mùa vụ, quy trình canh tác và nhật ký sản xuất cho trang trại.
                            </p>
                            <div className="mt-6 flex items-center text-green-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Retailer */}
                    <Link href="/login?role=retailer" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-blue-500"></div>
                        <div className="p-8">
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🛒</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Retailer Portal</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Dành cho nhà bán lẻ, quản lý đặt hàng và phân phối sản phẩm.
                            </p>
                            <div className="mt-6 flex items-center text-blue-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Shipping */}
                    <Link href="/login?role=shipping" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-orange-500"></div>
                        <div className="p-8">
                            <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🚚</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">Shipping Partner</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Quản lý vận chuyển, cập nhật lộ trình và trạng thái đơn hàng.
                            </p>
                            <div className="mt-6 flex items-center text-orange-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Admin */}
                    <Link href="/login?role=admin" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-purple-500"></div>
                        <div className="p-8">
                            <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🛡️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">System Admin</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Trung tâm quản trị hệ thống, quản lý người dùng và cấu hình.
                            </p>
                            <div className="mt-6 flex items-center text-purple-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Guest */}
                    <Link href="/login?role=guest" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-2">
                        <div className="absolute top-0 w-full h-2 bg-teal-500"></div>
                        <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="bg-teal-100 dark:bg-teal-900/30 w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center">
                                <span className="text-3xl">👤</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">Guest Access (Khách)</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Tra cứu thông tin, quét mã QR truy xuất nguồn gốc sản phẩm mà không cần đăng nhập.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                                    Truy cập ngay
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center bg-slate-100">
                    <div className="mb-4 md:mb-0">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">BICAP © 2024</span>
                        <p className="text-sm text-gray-500">Hệ thống Nông nghiệp Sạch</p>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-white">Về chúng tôi</Link>
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-white">Chính sách bảo mật</Link>
                        <Link href="#" className="hover:text-gray-900 dark:hover:text-white">Liên hệ</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
