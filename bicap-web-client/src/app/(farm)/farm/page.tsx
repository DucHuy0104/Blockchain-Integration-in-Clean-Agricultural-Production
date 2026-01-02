'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Mock Quick Actions Data
const QUICK_ACTIONS = [
    { title: 'Tạo Vụ Mùa Mới', href: '/farm/seasons', icon: '🌱', color: 'bg-green-100 text-green-700' },
    { title: 'Đăng Sản Phẩm', href: '/farm/products', icon: '🛒', color: 'bg-blue-100 text-blue-700' },
    { title: 'Duyệt Đơn Hàng', href: '/farm/orders', icon: '📦', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Xem Báo Cáo', href: '/farm/reports', icon: '📢', color: 'bg-red-100 text-red-700' },
];

interface Farm {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

export default function FarmPage() {
    const { user } = useAuth();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [stats, setStats] = useState({ activeSeasons: 0, todayProcesses: 0, totalOutput: 0 });

    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    // Fetch initial data (User & Farms list)
    useEffect(() => {
        const initData = async () => {
            if (!user) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                const [farmRes, meRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/farms/my-farms', { headers }),
                    axios.get('http://localhost:5001/api/auth/me', { headers })
                ]);

                // Set User Name
                if (meRes.data && meRes.data.fullName) {
                    setUserName(meRes.data.fullName);
                }

                // Set Farms List & Default Selection
                if (farmRes.data.farms && farmRes.data.farms.length > 0) {
                    setFarms(farmRes.data.farms);
                    setSelectedFarm(farmRes.data.farms[0]); // Default to first farm
                } else {
                    setFarms([]);
                    setLoading(false); // No farms, stop loading
                }

            } catch (error) {
                console.error("Init Data Error:", error);
                setLoading(false);
            }
        };

        if (user) {
            initData();
        } else {
            const unsubscribe = auth.onAuthStateChanged((u) => {
                if (u) {
                    initData();
                }
            });
            return () => unsubscribe();
        }
    }, [user]);

    // Fetch stats when selectedFarm changes
    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedFarm) return;
            // Keep loading true while switching or initial load? 
            // Maybe not full page loading, but specific section. 
            // For simplicity, we won't toggle full page `loading` here to avoid flashing, 
            // but we could have a `statsLoading` state.

            try {
                const token = await auth.currentUser?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                // Pass farmId query param
                const res = await axios.get(`http://localhost:5001/api/farms/stats?farmId=${selectedFarm.id}`, { headers });

                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Fetch Stats Error:", error);
            } finally {
                setLoading(false); // Ensure loading is off after first stats fetch
            }
        };

        fetchStats();
    }, [selectedFarm]);


    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng ☀️';
        if (hour < 18) return 'Chào buổi chiều 🌤️';
        return 'Chào buổi tối 🌙';
    };

    const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const farmId = parseInt(e.target.value);
        const farm = farms.find(f => f.id === farmId);
        if (farm) setSelectedFarm(farm);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            {/* 1. Hero / Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-2xl p-8 shadow-lg flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div>
                    <p className="text-gray-900 text-lg font-medium mb-1">{getTimeGreeting()}</p>
                    <h1 className="text-4xl font-bold text-black border-none">
                        {loading && !userName ? 'Đang tải...' : (userName || user?.fullName || 'Chủ Trang Trại')}
                    </h1>

                    <div className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                        {farms.length > 0 ? (
                            <>
                                <span className="mr-2">🏡 Đang quản lý:</span>
                                {farms.length > 1 ? (
                                    <select
                                        className="bg-white/80 border-none rounded px-3 py-1 font-bold text-green-800 cursor-pointer focus:ring-2 focus:ring-green-400"
                                        value={selectedFarm?.id || ''}
                                        onChange={handleFarmChange}
                                    >
                                        {farms.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="font-bold">{selectedFarm?.name}</span>
                                )}
                            </>
                        ) : (
                            'Bạn chưa thiết lập trang trại.'
                        )}
                    </div>

                    {farms.length === 0 && !loading && (
                        <Link href="/farm/info" className="inline-block mt-4 bg-white text-green-800 px-5 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition">
                            + Đăng ký trang trại ngay
                        </Link>
                    )}
                </div>
                <div className="hidden md:block text-8xl text-black">
                    🚜
                </div>
            </div>

            {/* 2. Overview Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/farm/seasons">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Vụ Mùa Hoạt Động</p>
                                <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mt-2">{stats.activeSeasons}</h3>
                            </div>
                            <span className="bg-green-100 text-green-600 p-3 rounded-lg text-2xl">🌱</span>
                        </div>
                        <div className="mt-4 text-sm text-green-600 font-medium">
                            Đang canh tác &rarr;
                        </div>
                    </div>
                </Link>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Công Việc Hôm Nay</p>
                            <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mt-2">{stats.todayProcesses}</h3>
                        </div>
                        <span className="bg-green-100 text-green-600 p-3 rounded-lg text-2xl">✅</span>
                    </div>
                    <div className="mt-4 text-sm text-green-600 font-medium">
                        Đã hoàn thành
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Vụ Mùa Hoàn Thành</p>
                            <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mt-2">{stats.totalOutput}</h3>
                        </div>
                        <span className="bg-blue-100 text-blue-600 p-3 rounded-lg text-2xl">🏆</span>
                    </div>
                    <div className="mt-4 text-sm text-blue-600 font-medium">
                        Tổng tích lũy
                    </div>
                </div>
            </div>

            {/* 3. Quick Actions Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Truy Cập Nhanh</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map((action, idx) => (
                        <Link href={action.href} key={idx} className="block group">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition text-center h-full flex flex-col items-center justify-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 ${action.color} group-hover:scale-110 transition`}>
                                    {action.icon}
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{action.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 4. Monitoring Widget (Mini) - Could also depend on Selected Farm if we had farmId in context for it */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Giám Sát Môi Trường</h2>
                        <p className="text-indigo-200 text-sm mb-4">
                            {selectedFarm ? `Dữ liệu từ ${selectedFarm.name}` : 'Dữ liệu thời gian thực'}
                        </p>
                        <Link href={selectedFarm ? `/farm/monitoring?farmId=${selectedFarm.id}` : '/farm/monitoring'} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-bold transition">
                            Xem chi tiết &rarr;
                        </Link>
                    </div>
                    <div className="text-right">
                        {/* Mock Mini Values - Ideally this should also fetch per farm */}
                        <div className="flex space-x-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold">28°C</span>
                                <span className="text-xs text-indigo-300">Nhiệt độ</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold">65%</span>
                                <span className="text-xs text-indigo-300">Độ ẩm</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decoration Circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-600 rounded-full opacity-30 blur-xl"></div>
            </div>
        </div>
    );
}
