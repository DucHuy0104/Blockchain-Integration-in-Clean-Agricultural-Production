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
    const { user } = useAuth();

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

    // Fetch Tasks Grouped by Season
    useEffect(() => {
        const fetchGroupedTasks = async () => {
            if (!selectedFarm) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                // 1. Fetch Active Seasons
                const seasonRes = await axios.get(`http://localhost:5001/api/seasons/farm/${selectedFarm.id}?status=active`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const activeSeasons = seasonRes.data || [];

                // 2. Fetch Tasks for ALL these seasons
                // Optimization: Backend could support include=tasks, but for now we parallel fetch or fetch all my tasks and group
                // Better: Fetch all tasks for this user, then filter/group by the active season IDs
                const taskRes = await axios.get(`http://localhost:5001/api/tasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const allTasks = taskRes.data.tasks as SeasonTask[];

                // 3. Group
                const grouped: SeasonWithTasks[] = activeSeasons.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    tasks: allTasks.filter(t => t.seasonId === s.id && !t.isCompleted) // Only show uncompleted for "To Do"
                })).filter((g: SeasonWithTasks) => g.tasks.length > 0); // Only show seasons with pending tasks? Or show all active? User said "list tasks of that season".

                // If user wants to see seasons even if empty tasks, remove filter. 
                // But "liệt kê công việc", implying if no work, maybe don't list? 
                // Let's keep filter to keep dashboard clean, or show "No tasks" under season.
                // Better to show Season Name -> No tasks.
                const groupedAll: SeasonWithTasks[] = activeSeasons.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    tasks: allTasks.filter(t => t.seasonId === s.id && !t.isCompleted)
                }));

                setSeasonTasks(groupedAll);

            } catch (error) {
                console.error("Fetch Grouped Tasks Error:", error);
            }
        };
        fetchGroupedTasks();
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
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Công Việc Đang Chờ</p>
                            <h3 className="text-4xl font-extrabold text-gray-800 dark:text-white mt-2"> {seasonTasks.reduce((acc, s) => acc + s.tasks.length, 0)}</h3>
                        </div>
                        <span className="bg-orange-100 text-orange-600 p-3 rounded-lg text-2xl">📋</span>
                    </div>
                    <div className="mt-4 text-sm text-orange-600 font-medium">
                        Cần thực hiện
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
                                                            const token = await auth.currentUser?.getIdToken();
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

            {/* 4. Monitoring Widget (Mini) */}
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
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-600 rounded-full opacity-30 blur-xl"></div>
            </div>
        </div>
    );
}
