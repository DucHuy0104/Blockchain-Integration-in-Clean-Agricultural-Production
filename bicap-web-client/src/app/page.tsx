'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
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

    const features = [
        {
            icon: '🌱',
            title: 'Quản Lý Mùa Vụ',
            description: 'Theo dõi và quản lý toàn bộ quy trình canh tác từ gieo trồng đến thu hoạch',
            color: 'from-green-400 to-emerald-600',
            delay: '0.1s'
        },
        {
            icon: '🔗',
            title: 'Blockchain Minh Bạch',
            description: 'Mọi hoạt động được ghi lại trên blockchain, đảm bảo tính minh bạch và không thể thay đổi',
            color: 'from-blue-400 to-cyan-600',
            delay: '0.2s'
        },
        {
            icon: '📱',
            title: 'IoT Giám Sát',
            description: 'Theo dõi thời gian thực nhiệt độ, độ ẩm, pH với cảnh báo tự động',
            color: 'from-purple-400 to-pink-600',
            delay: '0.3s'
        },
        {
            icon: '📦',
            title: 'Chuỗi Cung Ứng',
            description: 'Kết nối trực tiếp từ nông trại đến nhà bán lẻ, đảm bảo chất lượng sản phẩm',
            color: 'from-orange-400 to-red-600',
            delay: '0.4s'
        },
        {
            icon: '🔍',
            title: 'Truy Xuất Nguồn Gốc',
            description: 'Quét QR code để xem toàn bộ lịch sử canh tác và vận chuyển',
            color: 'from-teal-400 to-green-600',
            delay: '0.5s'
        },
        {
            icon: '💳',
            title: 'Thanh Toán An Toàn',
            description: 'Hệ thống thanh toán tích hợp VNPay, đảm bảo giao dịch an toàn',
            color: 'from-yellow-400 to-orange-600',
            delay: '0.6s'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Trang Trại', icon: '🌾' },
        { number: '5000+', label: 'Sản Phẩm', icon: '🥬' },
        { number: '99.9%', label: 'Độ Tin Cậy', icon: '✅' },
        { number: '24/7', label: 'Hỗ Trợ', icon: '💬' }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-sans overflow-x-hidden">
            {/* Hero Section - Ultra Enhanced */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background with Parallax */}
                <div className="absolute inset-0">
                    <div 
                        className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#7CB342]/30 to-[#388E3C]/30 rounded-full blur-3xl animate-float"
                        style={{
                            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    ></div>
                    <div 
                        className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#00C853]/30 to-[#7CB342]/30 rounded-full blur-3xl animate-float"
                        style={{
                            animationDelay: '1s',
                            transform: `translate(${-mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    ></div>
                    <div 
                        className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-[#FFB300]/20 to-[#F57C00]/20 rounded-full blur-3xl animate-float"
                        style={{
                            animationDelay: '2s',
                            transform: `translate(${mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    ></div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-9xl opacity-20 animate-float animate-rotate-slow">🌱</div>
                    <div className="absolute top-40 right-20 text-8xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🥬</div>
                    <div className="absolute bottom-20 left-1/4 text-9xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌾</div>
                    <div className="absolute top-1/2 right-1/4 text-7xl opacity-20 animate-float animate-wave">🍅</div>
                    <div className="absolute bottom-1/3 right-10 text-8xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🥕</div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-block mb-8 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border-2 border-white/50 shadow-xl animate-zoom-in">
                        <span className="text-sm font-bold bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent flex items-center gap-2">
                            <span className="text-xl">🌾</span>
                            Nông Nghiệp Sạch & Minh Bạch
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-8 animate-fadeInUp">
                        <span className="block bg-gradient-to-r from-[#388E3C] via-[#7CB342] to-[#00C853] bg-clip-text text-transparent animate-gradient">
                            BICAP
                        </span>
                        <span className="block text-4xl md:text-5xl lg:text-6xl text-gray-700 mt-4 font-light">
                            Blockchain Integration in Clean Agricultural Production
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Hệ thống quản lý chuỗi cung ứng nông sản sạch minh bạch, an toàn và hiệu quả. 
                        <span className="block mt-2 text-[#388E3C] font-semibold">
                            Kết nối trực tiếp từ nông trại đến bàn ăn
                        </span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <Link 
                            href="/market" 
                            className="group relative px-10 py-5 bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[#388E3C]/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 btn-glow overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <span className="text-3xl">🏪</span>
                                <span>Tham quan Sàn Nông Sản</span>
                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                        <Link 
                            href="/login?role=guest" 
                            className="group px-10 py-5 bg-white/90 backdrop-blur-md border-3 border-[#388E3C] text-[#388E3C] font-bold text-lg rounded-2xl shadow-2xl hover:bg-[#388E3C] hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <span className="text-3xl">🔍</span>
                            <span>Truy Xuất Nguồn Gốc</span>
                            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover"
                                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                            >
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-extrabold bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 font-semibold mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
                    <div className="w-6 h-10 border-2 border-[#388E3C] rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-[#388E3C] rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-24 md:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="white">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
                            <span className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">
                                Tính Năng Nổi Bật
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hệ thống toàn diện cho nông nghiệp sạch và minh bạch
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 card-hover animate-fadeInUp"
                                style={{ animationDelay: feature.delay }}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                                
                                <div className="relative z-10">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#388E3C] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-100/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portal Selection Section - Enhanced */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
                            <span className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">
                                Cổng Truy Cập
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Chọn vai trò của bạn để bắt đầu hành trình với BICAP
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Farm */}
                        <Link 
                            href="/login?role=farm" 
                            className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-[#7CB342]/30 transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#7CB342] animate-fadeInUp"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#7CB342] to-[#388E3C]"></div>
                            <div className="p-8 relative z-10">
                                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    🌱
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#388E3C] transition-colors">
                                    Farm Management
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Quản lý mùa vụ, quy trình canh tác và nhật ký sản xuất cho trang trại.
                                </p>
                                <div className="flex items-center text-[#388E3C] font-bold group-hover:gap-3 transition-all">
                                    <span>Truy cập ngay</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#7CB342]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* Retailer */}
                        <Link 
                            href="/login?role=retailer" 
                            className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-blue-300/30 transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-blue-500 animate-fadeInUp"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <div className="p-8 relative z-10">
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    🛒
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                    Retailer Portal
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Dành cho nhà bán lẻ, quản lý đặt hàng và phân phối sản phẩm.
                                </p>
                                <div className="flex items-center text-blue-600 font-bold group-hover:gap-3 transition-all">
                                    <span>Truy cập ngay</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* Shipping */}
                        <Link 
                            href="/login?role=shipping" 
                            className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-orange-300/30 transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-orange-500 animate-fadeInUp"
                            style={{ animationDelay: '0.3s' }}
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                            <div className="p-8 relative z-10">
                                <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    🚚
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                                    Shipping Partner
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Quản lý vận chuyển, cập nhật lộ trình và trạng thái đơn hàng.
                                </p>
                                <div className="flex items-center text-orange-600 font-bold group-hover:gap-3 transition-all">
                                    <span>Truy cập ngay</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* Admin */}
                        <Link 
                            href="/login?role=admin" 
                            className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-purple-300/30 transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-purple-500 animate-fadeInUp"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                            <div className="p-8 relative z-10">
                                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    🛡️
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                    System Admin
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Trung tâm quản trị hệ thống, quản lý người dùng và cấu hình.
                                </p>
                                <div className="flex items-center text-purple-600 font-bold group-hover:gap-3 transition-all">
                                    <span>Truy cập ngay</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        {/* Guest - Full Width */}
                        <Link 
                            href="/login?role=guest" 
                            className="group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl shadow-2xl overflow-hidden hover:shadow-teal-300/30 transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-teal-500 md:col-span-2 lg:col-span-2 animate-fadeInUp"
                            style={{ animationDelay: '0.5s' }}
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-600"></div>
                            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="bg-gradient-to-br from-teal-200 to-cyan-200 w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0">
                                    👤
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                                        Guest Access (Khách)
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        Tra cứu thông tin, quét mã QR truy xuất nguồn gốc sản phẩm mà không cần đăng nhập. 
                                        Khám phá chợ nông sản và tìm hiểu về nông nghiệp sạch.
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start text-teal-600 font-bold group-hover:gap-3 transition-all">
                                        <span>Truy cập ngay</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer - Enhanced */}
            <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#7CB342] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#388E3C] rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#7CB342] to-[#388E3C] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                                    🌾
                                </div>
                                <span className="text-2xl font-extrabold">BICAP</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Hệ thống quản lý chuỗi cung ứng nông sản sạch với công nghệ Blockchain.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Về Chúng Tôi</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Giới thiệu</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Đội ngũ</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Tin tức</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Hỗ Trợ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Báo lỗi</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Pháp Lý</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-gray-400">
                                © 2024 BICAP. All rights reserved.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#388E3C] rounded-full flex items-center justify-center transition-colors">
                                <span className="text-xl">📘</span>
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#388E3C] rounded-full flex items-center justify-center transition-colors">
                                <span className="text-xl">📷</span>
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-gray-700 hover:bg-[#388E3C] rounded-full flex items-center justify-center transition-colors">
                                <span className="text-xl">🐦</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
