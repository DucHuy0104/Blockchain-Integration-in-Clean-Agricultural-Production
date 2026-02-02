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
    status: 'pending' | 'active' | 'rejected';
}

interface SeasonTask {
    id: number;
    title: string;
    isCompleted: boolean;
    seasonId: number;
    season?: { name: string };
    priority: string;
}

interface SeasonWithTasks {
    id: number;
    name: string;
    tasks: SeasonTask[];
}

export default function FarmPage() {
    const { user, getAccessToken } = useAuth();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
    const [stats, setStats] = useState({ activeSeasons: 0, todayProcesses: 0, totalOutput: 0 });

    // Grouped Tasks State
    const [seasonTasks, setSeasonTasks] = useState<SeasonWithTasks[]>([]);

    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    // Fetch initial data (User & Farms list)
    useEffect(() => {
        const initData = async () => {
            if (!user) return;
            try {
                const token = await getAccessToken();
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

    // 2. Fetch Stats and Grouped Tasks when selectedFarm changes
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!selectedFarm) return;
            try {
                const token = await getAccessToken();
                const headers = { Authorization: `Bearer ${token}` };

                // Parallel fetch everything needed for the dashboard
                const [statsRes, seasonRes, taskRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/farms/stats?farmId=${selectedFarm.id}`, { headers }),
                    axios.get(`http://localhost:5001/api/seasons/farm/${selectedFarm.id}?status=active`, { headers }),
                    axios.get(`http://localhost:5001/api/tasks`, { headers })
                ]);

                // Update Stats
                if (statsRes.data) setStats(statsRes.data);

                // Update & Group Tasks
                const activeSeasons = seasonRes.data || [];
                const allTasks = taskRes.data.tasks || [];

                const groupedAll: SeasonWithTasks[] = activeSeasons.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    tasks: allTasks.filter((t: any) => t.seasonId === s.id && !t.isCompleted)
                }));

                setSeasonTasks(groupedAll);

            } catch (error) {
                console.error("Dashboard Data Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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
        <div className="max-w-6xl mx-auto p-4 space-y-8 flex flex-col">
            {/* 1. Hero / Welcome Section - Enhanced */}
            <div className="bg-gradient-to-br from-[#7CB342] via-[#388E3C] to-[#00C853] rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 flex-1">
                    <div className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <p className="text-white text-sm font-semibold">{getTimeGreeting()}</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                        {loading && !userName ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tải...
                            </span>
                        ) : (userName || user?.fullName || 'Chủ Trang Trại')}
                    </h1>

                    <div className="mt-3 text-lg font-medium text-white/90 flex items-center flex-wrap gap-2">
                        {farms.length > 0 ? (
                            <>
                                <span className="flex items-center gap-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Đang quản lý:
                                </span>
                                {farms.length > 1 ? (
                                    <div className="flex items-center gap-3">
                                        <select
                                            className="bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl px-4 py-2 font-bold text-[#388E3C] cursor-pointer focus:ring-2 focus:ring-white focus:outline-none shadow-lg hover:bg-white transition-all"
                                            value={selectedFarm?.id || ''}
                                            onChange={handleFarmChange}
                                        >
                                            {farms.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/30 whitespace-nowrap`}>
                                            {selectedFarm?.status === 'active' ? 'Đang hoạt động' :
                                                selectedFarm?.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-xl">{selectedFarm?.name}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/30 whitespace-nowrap`}>
                                            {selectedFarm?.status === 'active' ? 'Đang hoạt động' :
                                                selectedFarm?.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-white/80">Bạn chưa thiết lập trang trại.</span>
                        )}
                    </div>

                    {farms.length === 0 && !loading && (
                        <Link href="/farm/info" className="inline-block mt-4 bg-white text-[#388E3C] px-6 py-3 rounded-full font-bold shadow-xl hover:bg-green-50 hover:scale-105 transition-all btn-glow relative overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Đăng ký trang trại ngay
                            </span>
                        </Link>
                    )}
                </div>
                <div className="hidden md:block text-9xl text-white/30 relative z-10 animate-float">
                    🚜
                </div>
            </div>

            {/* 1.1 Pending Approval Banner */}
            {selectedFarm && selectedFarm.status === 'pending' && (
                <div className="bg-orange-50 border-l-8 border-orange-400 p-6 rounded-3xl shadow-lg animate-pulse flex items-center gap-4">
                    <div className="text-4xl">⏳</div>
                    <div>
                        <p className="text-lg text-orange-800 font-black">TRANG TRẠI ĐANG CHỜ PHÊ DUYỆT</p>
                        <p className="text-sm text-orange-700 font-medium">
                            Admin đang kiểm tra thông tin của "{selectedFarm.name}". Các chức năng kinh doanh sẽ được mở sau khi duyệt.
                        </p>
                    </div>
                </div>
            )}

            {selectedFarm && selectedFarm.status === 'rejected' && (
                <div className="bg-red-50 border-l-8 border-red-400 p-6 rounded-3xl shadow-lg flex items-center gap-4">
                    <div className="text-4xl">❌</div>
                    <div>
                        <p className="text-lg text-red-800 font-black">TRANG TRẠI BỊ TỪ CHỐI / TẠM KHÓA</p>
                        <p className="text-sm text-red-700 font-medium">
                            Có vấn đề với hồ sơ trang trại. Vui lòng vào mục <Link href="/farm/info" className="underline font-black">Thông Tin Trang Trại</Link> để xem lý do và cập nhật lại.
                        </p>
                    </div>
                </div>
            )}

            {/* 2. Overview Stats Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/farm/seasons" className="group">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer card-hover">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Vụ Mùa Hoạt Động</p>
                                <h3 className="text-5xl font-extrabold bg-gradient-to-r from-[#388E3C] to-[#7CB342] bg-clip-text text-transparent">{stats.activeSeasons}</h3>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 p-4 rounded-2xl text-3xl shadow-md group-hover:scale-110 transition-transform">
                                🌱
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-[#388E3C] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            <span>Đang canh tác</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Công Việc Đang Chờ</p>
                            <h3 className="text-5xl font-extrabold bg-gradient-to-r from-[#FFB300] to-[#F57C00] bg-clip-text text-transparent">{seasonTasks.reduce((acc, s) => acc + s.tasks.length, 0)}</h3>
                        </div>
                        <div className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 p-4 rounded-2xl text-3xl shadow-md">
                            📋
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-[#FFB300] font-bold">
                        Cần thực hiện
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Vụ Mùa Hoàn Thành</p>
                            <h3 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{stats.totalOutput}</h3>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 p-4 rounded-2xl text-3xl shadow-md">
                            🏆
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-blue-600 font-bold">
                        Tổng tích lũy
                    </div>
                </div>
            </div>

            {/* 3. Task List Section (New - Standard Layout) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        📋 Danh sách công việc theo mùa vụ
                    </h3>
                </div>
                <div className="p-6">
                    {seasonTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Không có công việc nào cần hoàn thành. Tuyệt vời!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {seasonTasks.map(season => (
                                <div key={season.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                                        <Link href={`/farm/seasons/${season.id}`} className="font-bold text-green-700 hover:text-green-800 flex items-center gap-2">
                                            🌱 {season.name}
                                        </Link>
                                        <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                                            {season.tasks.length} việc
                                        </span>
                                    </div>
                                    <ul className="space-y-3">
                                        {season.tasks.map(task => (
                                            <li key={task.id} className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                                    checked={false}
                                                    onChange={async () => {
                                                        setSeasonTasks(prev => prev.map(s =>
                                                            s.id === season.id ? { ...s, tasks: s.tasks.filter(t => t.id !== task.id) } : s
                                                        ));
                                                        try {
                                                            const token = await getAccessToken();
                                                            await axios.put(`http://localhost:5001/api/tasks/${task.id}/toggle`, {}, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            setStats(prev => ({ ...prev, todayProcesses: prev.todayProcesses + 1 }));
                                                        } catch (e) {
                                                            console.error(e);
                                                        }
                                                    }}
                                                />
                                                <div className="ml-3">
                                                    <span className={`block text-sm text-gray-700 font-medium ${task.priority === 'high' ? 'text-red-700' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                    {task.priority === 'high' && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded">Quan trọng</span>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Quick Actions Grid - Enhanced */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#388E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Truy Cập Nhanh
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map((action, idx) => {
                        const isDisabled = selectedFarm?.status !== 'active';
                        return isDisabled ? (
                            <div key={idx} className="block cursor-not-allowed opacity-50 grayscale">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 text-center h-full flex flex-col items-center justify-center">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${action.color} shadow-md`}>
                                        {action.icon}
                                    </div>
                                    <span className="font-bold text-gray-400">{action.title}</span>
                                </div>
                            </div>
                        ) : (
                            <Link href={action.href} key={idx} className="block group">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center h-full flex flex-col items-center justify-center card-hover">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${action.color} group-hover:scale-110 transition-transform shadow-md`}>
                                        {action.icon}
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-[#388E3C] transition-colors">{action.title}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 4. Monitoring Widget (Mini) - Enhanced */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold">Giám Sát Môi Trường</h2>
                        </div>
                        <p className="text-indigo-200 text-sm mb-6">
                            {selectedFarm ? `Dữ liệu từ ${selectedFarm.name}` : 'Dữ liệu thời gian thực'}
                        </p>
                        <Link
                            href={selectedFarm ? `/farm/monitoring?farmId=${selectedFarm.id}` : '/farm/monitoring'}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                        >
                            <span>Xem chi tiết</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <div className="text-3xl font-extrabold mb-1">28°C</div>
                            <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Nhiệt độ</div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <div className="text-3xl font-extrabold mb-1">65%</div>
                            <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Độ ẩm</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
