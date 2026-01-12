'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';

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

    const part1Features = [
        {
            icon: '🌱',
            title: 'Quản Lý Mùa Vụ Thông Minh',
            description: 'Hệ thống quản lý mùa vụ toàn diện với nhật ký canh tác chi tiết, theo dõi quy trình từ gieo trồng đến thu hoạch. Tự động hóa công việc và tối ưu năng suất.',
            color: 'from-green-400 to-emerald-600',
            gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
            image: '🌾'
        },
        {
            icon: '🔗',
            title: 'Blockchain Minh Bạch',
            description: 'Mọi hoạt động được ghi lại trên blockchain, đảm bảo tính minh bạch tuyệt đối và không thể thay đổi. Người tiêu dùng có thể truy xuất toàn bộ lịch sử sản phẩm.',
            color: 'from-blue-400 to-cyan-600',
            gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
            image: '⛓️'
        },
        {
            icon: '📱',
            title: 'IoT Giám Sát Thời Gian Thực',
            description: 'Theo dõi nhiệt độ, độ ẩm, pH và các chỉ số môi trường trong thời gian thực. Cảnh báo tự động khi có bất thường, đảm bảo điều kiện canh tác tối ưu.',
            color: 'from-purple-400 to-pink-600',
            gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
            image: '📡'
        }
    ];

    const part2Features = [
        {
            icon: '📦',
            title: 'Chuỗi Cung Ứng Thông Minh',
            description: 'Kết nối trực tiếp từ nông trại đến nhà bán lẻ, loại bỏ trung gian. Quản lý đơn hàng, vận chuyển và thanh toán một cách hiệu quả và minh bạch.',
            color: 'from-orange-400 to-red-600',
            gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
            image: '🚚'
        },
        {
            icon: '🔍',
            title: 'Truy Xuất Nguồn Gốc Tức Thì',
            description: 'Quét QR code để xem toàn bộ lịch sử canh tác, vận chuyển và chứng nhận chất lượng. Thông tin minh bạch, đáng tin cậy và dễ dàng truy cập.',
            color: 'from-teal-400 to-green-600',
            gradient: 'bg-gradient-to-br from-teal-50 to-green-50',
            image: '📱'
        },
        {
            icon: '💳',
            title: 'Thanh Toán An Toàn',
            description: 'Tích hợp VNPay và các phương thức thanh toán hiện đại. Giao dịch an toàn, nhanh chóng với mã hóa bảo mật cao.',
            color: 'from-yellow-400 to-orange-600',
            gradient: 'bg-gradient-to-br from-yellow-50 to-orange-50',
            image: '💵'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Trang Trại', icon: '🌾', color: 'text-green-600' },
        { number: '5000+', label: 'Sản Phẩm', icon: '🥬', color: 'text-emerald-600' },
        { number: '99.9%', label: 'Độ Tin Cậy', icon: '✅', color: 'text-blue-600' },
        { number: '24/7', label: 'Hỗ Trợ', icon: '💬', color: 'text-purple-600' }
    ];

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            {/* ============================================
                PART 1: HERO SECTION - First Impression
                ============================================ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
                    <ScrollAnimation direction="fade" delay={0}>
                        <div className="inline-block mb-8 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border-2 border-white/50 shadow-xl">
                            <span className="text-sm font-bold bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent flex items-center gap-2">
                                <span className="text-xl">🌾</span>
                                Nông Nghiệp Sạch & Minh Bạch
                            </span>
                        </div>
                    </ScrollAnimation>

                    {/* Main Heading */}
                    <ScrollAnimation direction="up" delay={100}>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-8">
                            <span className="block bg-gradient-to-r from-[#388E3C] via-[#7CB342] to-[#00C853] bg-clip-text text-transparent animate-gradient">
                                BICAP
                            </span>
                            <span className="block text-4xl md:text-5xl lg:text-6xl text-gray-700 mt-4 font-light">
                                Blockchain Integration in Clean Agricultural Production
                            </span>
                        </h1>
                    </ScrollAnimation>

                    {/* Description */}
                    <ScrollAnimation direction="up" delay={200}>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Hệ thống quản lý chuỗi cung ứng nông sản sạch minh bạch, an toàn và hiệu quả. 
                            <span className="block mt-2 text-[#388E3C] font-semibold">
                                Kết nối trực tiếp từ nông trại đến bàn ăn
                            </span>
                        </p>
                    </ScrollAnimation>

                    {/* CTA Buttons */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
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
                    </ScrollAnimation>

                    {/* Stats */}
                    <ScrollAnimation direction="up" delay={400}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div 
                                    key={index}
                                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 card-hover"
                                >
                                    <div className="text-4xl mb-2">{stat.icon}</div>
                                    <div className={`text-3xl font-extrabold ${stat.color}`}>
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-600 font-semibold mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimation>
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
            </section>

            {/* ============================================
                PART 1: FEATURES SECTION - Giới thiệu Part 1
                ============================================ */}
            <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-20">
                            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white rounded-full text-sm font-bold">
                                PHẦN 1
                            </div>
                            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
                                <span className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">
                                    Quản Lý & Sản Xuất
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Hệ thống quản lý nông trại thông minh với công nghệ Blockchain và IoT, 
                                đảm bảo quy trình sản xuất minh bạch và hiệu quả
                            </p>
                        </div>
                    </ScrollAnimation>

                    {/* Features Grid */}
                    <div className="space-y-32">
                        {part1Features.map((feature, index) => (
                            <ScrollAnimation 
                                key={index} 
                                direction={index % 2 === 0 ? 'left' : 'right'} 
                                delay={index * 100}
                            >
                                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                                    {/* Image/Icon Section */}
                                    <div className="flex-1">
                                        <div className={`${feature.gradient} rounded-3xl p-12 shadow-2xl relative overflow-hidden group`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                            <div className="relative z-10 text-center">
                                                <div className={`text-9xl mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                                                    {feature.image}
                                                </div>
                                                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center text-5xl shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                                                    {feature.icon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <h3 className="text-4xl font-extrabold text-gray-800 mb-6">
                                            {feature.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                            {feature.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-[#388E3C] font-bold group cursor-pointer">
                                            <span>Tìm hiểu thêm</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                TRANSITION SECTION - Visual Break
                ============================================ */}
            <section className="relative py-20 bg-gradient-to-r from-[#388E3C] via-[#7CB342] to-[#00C853] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.svg')] bg-repeat"></div>
                </div>
                <ScrollAnimation direction="fade">
                    <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                            Từ Nông Trại Đến Bàn Ăn
                        </h2>
                        <p className="text-xl text-green-50 leading-relaxed">
                            Một hệ thống hoàn chỉnh kết nối mọi khâu trong chuỗi cung ứng nông sản sạch
                        </p>
                    </div>
                </ScrollAnimation>
            </section>

            {/* ============================================
                PART 2: FEATURES SECTION - Giới thiệu Part 2
                ============================================ */}
            <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-20">
                            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold">
                                PHẦN 2
                            </div>
                            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                    Phân Phối & Tiêu Dùng
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Hệ thống phân phối thông minh và minh bạch, đảm bảo người tiêu dùng 
                                luôn có thông tin đầy đủ về nguồn gốc sản phẩm
                            </p>
                        </div>
                    </ScrollAnimation>

                    {/* Features Grid */}
                    <div className="space-y-32">
                        {part2Features.map((feature, index) => (
                            <ScrollAnimation 
                                key={index} 
                                direction={index % 2 === 0 ? 'right' : 'left'} 
                                delay={index * 100}
                            >
                                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                                    {/* Image/Icon Section */}
                                    <div className="flex-1">
                                        <div className={`${feature.gradient} rounded-3xl p-12 shadow-2xl relative overflow-hidden group`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                            <div className="relative z-10 text-center">
                                                <div className={`text-9xl mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                                                    {feature.image}
                                                </div>
                                                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center text-5xl shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                                                    {feature.icon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <h3 className="text-4xl font-extrabold text-gray-800 mb-6">
                                            {feature.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                            {feature.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-orange-600 font-bold group cursor-pointer">
                                            <span>Tìm hiểu thêm</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                PORTAL SELECTION SECTION
                ============================================ */}
            <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation direction="up">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
                                <span className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">
                                    Bắt Đầu Hành Trình
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Chọn vai trò của bạn để truy cập vào hệ thống BICAP
                            </p>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { href: '/login?role=farm', icon: '🌱', title: 'Farm Management', color: 'from-green-400 to-emerald-600', desc: 'Quản lý mùa vụ và sản xuất' },
                            { href: '/login?role=retailer', icon: '🛒', title: 'Retailer Portal', color: 'from-blue-400 to-cyan-600', desc: 'Quản lý đơn hàng và phân phối' },
                            { href: '/login?role=shipping', icon: '🚚', title: 'Shipping Partner', color: 'from-orange-400 to-red-600', desc: 'Quản lý vận chuyển' },
                            { href: '/login?role=admin', icon: '🛡️', title: 'System Admin', color: 'from-purple-400 to-pink-600', desc: 'Quản trị hệ thống' },
                            { href: '/login?role=guest', icon: '👤', title: 'Guest Access', color: 'from-teal-400 to-green-600', desc: 'Truy cập công khai' }
                        ].map((portal, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <Link 
                                    href={portal.href} 
                                    className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-gray-200"
                                >
                                    <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${portal.color}`}></div>
                                    <div className="p-8 relative z-10">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${portal.color} rounded-3xl flex items-center justify-center text-5xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                            {portal.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#388E3C] transition-colors">
                                            {portal.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {portal.desc}
                                        </p>
                                        <div className="flex items-center text-[#388E3C] font-bold group-hover:gap-3 transition-all">
                                            <span>Truy cập ngay</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                </Link>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                FOOTER
                ============================================ */}
            <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
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
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Hỗ Trợ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Pháp Lý</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
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
