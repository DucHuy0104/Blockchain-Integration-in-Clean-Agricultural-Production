'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const farmerStories = [
        {
            name: 'Anh Minh',
            farm: 'Nông Trại Xanh Tươi',
            location: 'Đà Lạt, Lâm Đồng',
            image: '👨‍🌾',
            quote: 'BICAP giúp tôi quản lý mùa vụ dễ dàng hơn bao giờ hết. Khách hàng tin tưởng vì họ thấy được quy trình canh tác minh bạch.',
            product: 'Rau xanh, cà chua',
            color: 'from-green-400 to-emerald-500'
        },
        {
            name: 'Chị Lan',
            farm: 'Vườn Rau Sạch Gia Đình',
            location: 'Hà Nội',
            image: '👩‍🌾',
            quote: 'Nhờ BICAP, sản phẩm của tôi được nhiều người biết đến hơn. Hệ thống truy xuất nguồn gốc giúp khách hàng yên tâm.',
            product: 'Rau cải, rau muống',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            name: 'Anh Đức',
            farm: 'Trang Trại Hữu Cơ',
            location: 'Cần Thơ',
            image: '👨‍🌾',
            quote: 'Blockchain giúp tôi chứng minh được chất lượng sản phẩm. Khách hàng quét mã QR là thấy ngay lịch sử canh tác.',
            product: 'Lúa, gạo hữu cơ',
            color: 'from-amber-400 to-orange-500'
        }
    ];

    const features = [
        {
            icon: '🌱',
            title: 'Quản Lý Mùa Vụ',
            description: 'Ghi chép nhật ký canh tác, theo dõi quy trình từ gieo trồng đến thu hoạch một cách khoa học và có hệ thống',
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50'
        },
        {
            icon: '🔗',
            title: 'Blockchain Minh Bạch',
            description: 'Mọi thông tin được lưu trữ trên blockchain, không thể thay đổi, đảm bảo tính minh bạch tuyệt đối',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: '📱',
            title: 'IoT Thông Minh',
            description: 'Cảm biến tự động theo dõi nhiệt độ, độ ẩm, pH. Cảnh báo ngay khi có bất thường',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50'
        },
        {
            icon: '📦',
            title: 'Kết Nối Trực Tiếp',
            description: 'Nông dân bán trực tiếp cho nhà bán lẻ, không qua trung gian, giá cả công bằng',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50'
        },
        {
            icon: '🔍',
            title: 'Truy Xuất Nguồn Gốc',
            description: 'Quét QR code là biết ngay sản phẩm từ đâu, ai trồng, quy trình như thế nào',
            color: 'from-teal-500 to-green-600',
            bgColor: 'bg-teal-50'
        },
        {
            icon: '💳',
            title: 'Thanh Toán Dễ Dàng',
            description: 'Thanh toán online an toàn, nhanh chóng. Hỗ trợ nhiều phương thức thanh toán',
            color: 'from-yellow-500 to-amber-600',
            bgColor: 'bg-yellow-50'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Nông Dân', icon: '👨‍🌾', color: 'text-green-600' },
        { number: '5000+', label: 'Sản Phẩm', icon: '🥬', color: 'text-emerald-600' },
        { number: '99.9%', label: 'Minh Bạch', icon: '✅', color: 'text-blue-600' },
        { number: '24/7', label: 'Hỗ Trợ', icon: '💬', color: 'text-purple-600' }
    ];

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            {/* ============================================
                HERO SECTION - First Impression
                ============================================ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute top-20 left-10 w-96 h-96 bg-green-200/40 rounded-full blur-3xl animate-float"
                        style={{
                            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                        }}
                    ></div>
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-float"
                        style={{
                            animationDelay: '1s',
                            transform: `translate(${-mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                        }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl animate-float"
                        style={{
                            animationDelay: '2s',
                        }}
                    ></div>
                </div>

                {/* Floating Farm Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-32 left-20 text-8xl opacity-20 animate-float">🌾</div>
                    <div className="absolute top-48 right-32 text-7xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🌽</div>
                    <div className="absolute bottom-32 left-1/4 text-9xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌱</div>
                    <div className="absolute top-1/2 right-1/4 text-6xl opacity-20 animate-float animate-wave">🍅</div>
                    <div className="absolute bottom-1/3 right-20 text-8xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🥕</div>
                    <div className="absolute top-1/3 left-1/3 text-7xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🥬</div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Welcome Badge */}
                    <ScrollAnimation direction="fade" delay={0}>
                        <div className="inline-block mb-8 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                            <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                                <span className="text-2xl animate-bounce">👋</span>
                                Chào mừng đến với BICAP
                            </span>
                        </div>
                    </ScrollAnimation>

                    {/* Main Heading */}
                    <ScrollAnimation direction="up" delay={100}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
                            <span className="block text-6xl md:text-8xl mb-4">🌾</span>
                            <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent animate-gradient">
                                Nông Nghiệp Sạch
                            </span>
                            <span className="block text-4xl md:text-5xl lg:text-6xl text-gray-700 mt-4 font-light">
                                Cho Tương Lai Tươi Sáng
                            </span>
                        </h1>
                    </ScrollAnimation>

                    {/* Subtitle */}
                    <ScrollAnimation direction="up" delay={200}>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
                            Kết nối <span className="font-bold text-green-600">nông dân</span> và <span className="font-bold text-emerald-600">người tiêu dùng</span>
                            <span className="block mt-2">với công nghệ Blockchain và IoT hiện đại</span>
                        </p>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                            Minh bạch • An toàn • Chất lượng • Gần gũi
                        </p>
                    </ScrollAnimation>

                    {/* CTA Buttons */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                            <Link
                                href="/market"
                                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <span className="text-2xl">🏪</span>
                                    <span>Khám Phá Chợ Nông Sản</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                            <Link
                                href="/guest"
                                className="group px-8 py-4 bg-white border-3 border-green-600 text-green-600 font-bold text-lg rounded-2xl shadow-xl hover:bg-green-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">🔍</span>
                                <span>Truy Xuất Nguồn Gốc</span>
                                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Decorative curve */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
                    <svg className="relative block w-[calc(114%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50 dark:fill-slate-900"></path>
                    </svg>
                </div>
            </section>

            {/* Portal Selection Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cổng Truy Cập</h2>
                    <p className="text-gray-500 dark:text-gray-400">Vui lòng chọn vai trò của bạn để đăng nhập vào hệ thống</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 1. Farm */}
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

                    {/* 2. Retailer */}
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

                    {/* 3. Shipping */}
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

                    {/* 4. DRIVER APP (MỚI THÊM) - Link thẳng tới /driver/login */}
                    <Link href="/login?role=driver" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-indigo-500"></div>
                        <div className="p-8">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🚛</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">Driver App (Tài Xế)</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Dành riêng cho tài xế: Nhận lộ trình, quét QR giao hàng nhanh chóng.
                            </p>
                            <div className="mt-6 flex items-center text-indigo-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* 5. Admin */}
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

                    {/* 6. Guest (Đã chỉnh lại cho cân grid 3 cột) */}
                    <Link href="/market" className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                        <div className="absolute top-0 w-full h-2 bg-teal-500"></div>
                        <div className="p-8">
                            <div className="bg-teal-100 dark:bg-teal-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">👤</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">Guest (Khách)</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Tra cứu thông tin, quét mã QR truy xuất nguồn gốc sản phẩm.
                            </p>
                            <div className="mt-6 flex items-center text-teal-600 text-sm font-medium">
                                Truy cập ngay <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats */}
                <ScrollAnimation direction="up" delay={400}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className={`text-3xl font-extrabold ${stat.color} mb-1`}>
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </ScrollAnimation>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Cuộn xuống</span>
                    <div className="w-6 h-10 border-2 border-green-600 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-green-600 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* ============================================
            STORY SECTION - Farmer Stories
            ============================================ */}
            <section className="py-24 bg-gradient-to-b from-white to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                Câu Chuyện Nông Dân
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Những Người Làm Nông Thật Sự
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Lắng nghe những câu chuyện từ những nông dân đang sử dụng BICAP
                            </p>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {farmerStories.map((story, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
                                    <div className="text-center mb-6">
                                        <div className="text-7xl mb-4">{story.image}</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{story.name}</h3>
                                        <p className="text-green-600 font-semibold mb-1">{story.farm}</p>
                                        <p className="text-sm text-gray-500">{story.location}</p>
                                    </div>
                                    <div className={`h-1 bg-gradient-to-r ${story.color} rounded-full mb-6`}></div>
                                    <p className="text-gray-600 italic mb-6 leading-relaxed">
                                        "{story.quote}"
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-semibold">Sản phẩm:</span>
                                        <span>{story.product}</span>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
            FEATURES SECTION - Main Features
            ============================================ */}
            <section className="py-24 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                                Tính Năng Nổi Bật
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    Công Nghệ Cho Nông Nghiệp
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Những công cụ mạnh mẽ giúp nông dân quản lý tốt hơn, người tiêu dùng yên tâm hơn
                            </p>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <div className={`${feature.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-green-200`}>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
            HOW IT WORKS SECTION
            ============================================ */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                Cách Thức Hoạt Động
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Đơn Giản & Hiệu Quả
                                </span>
                            </h2>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', icon: '🌱', title: 'Nông Dân Gieo Trồng', desc: 'Ghi chép quy trình canh tác trên hệ thống' },
                            { step: '2', icon: '📱', title: 'IoT Giám Sát', desc: 'Cảm biến tự động theo dõi điều kiện môi trường' },
                            { step: '3', icon: '🔗', title: 'Lưu Trữ Blockchain', desc: 'Mọi thông tin được ghi lại trên blockchain' },
                            { step: '4', icon: '🛒', title: 'Người Dùng Mua', desc: 'Quét QR code để xem nguồn gốc sản phẩm' }
                        ].map((item, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <div className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-xl">
                                            {item.icon}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transform translate-x-4"></div>
                                    )}
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
            CTA SECTION - Call to Action
            ============================================ */}
            <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.svg')] bg-repeat"></div>
                </div>
                <ScrollAnimation direction="fade">
                    <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                            Sẵn Sàng Bắt Đầu?
                        </h2>
                        <p className="text-xl text-green-50 mb-8 leading-relaxed">
                            Tham gia cùng hàng nghìn nông dân và người tiêu dùng đang sử dụng BICAP
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/login?role=farm"
                                className="px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-2xl shadow-2xl hover:bg-green-50 hover:scale-105 transition-all duration-300"
                            >
                                Tôi Là Nông Dân
                            </Link>
                            <Link
                                href="/login?role=retailer"
                                className="px-8 py-4 bg-green-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:bg-green-800 hover:scale-105 transition-all duration-300 border-2 border-white/30"
                            >
                                Tôi Là Nhà Bán Lẻ
                            </Link>
                        </div>
                    </div>
                </ScrollAnimation>
            </section>

            {/* ============================================
            PORTAL SELECTION SECTION
            ============================================ */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Chọn Vai Trò Của Bạn
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600">
                                Mỗi vai trò có những công cụ và tính năng riêng phù hợp với nhu cầu
                            </p>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { href: '/login?role=farm', icon: '🌱', title: 'Nông Dân', desc: 'Quản lý mùa vụ, sản phẩm', color: 'from-green-500 to-emerald-600' },
                            { href: '/login?role=retailer', icon: '🛒', title: 'Nhà Bán Lẻ', desc: 'Quản lý đơn hàng, kho', color: 'from-blue-500 to-cyan-600' },
                            { href: '/login?role=shipping', icon: '🚚', title: 'Vận Chuyển', desc: 'Quản lý giao hàng', color: 'from-orange-500 to-red-600' },
                            { href: '/login?role=admin', icon: '🛡️', title: 'Quản Trị', desc: 'Quản lý hệ thống', color: 'from-purple-500 to-pink-600' },
                            { href: '/market', icon: '👤', title: 'Khách', desc: 'Xem sản phẩm, truy xuất', color: 'from-teal-500 to-green-600' }
                        ].map((portal, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <Link
                                    href={portal.href}
                                    className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-200"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${portal.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                        {portal.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                                        {portal.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{portal.desc}</p>
                                </Link>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
            FOOTER
            ============================================ */}
            <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                                    🌾
                                </div>
                                <span className="text-2xl font-extrabold">BICAP</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Hệ thống quản lý nông nghiệp sạch với công nghệ Blockchain, gần gũi và thân thiện với nông dân.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Về Chúng Tôi</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Giới thiệu</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Đội ngũ</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Tin tức</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Hỗ Trợ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Pháp Lý</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2024 BICAP. Made with ❤️ for Vietnamese Farmers.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
