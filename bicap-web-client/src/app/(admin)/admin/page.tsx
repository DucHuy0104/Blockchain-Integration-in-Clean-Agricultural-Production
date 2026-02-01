"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
    const { getAccessToken } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessToken();
            if (!token) {
                setError("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.");
                return;
            }
            const res = await axios.get('http://localhost:5001/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err: any) {
            console.error("Lỗi tải thống kê:", err);
            setError(err.response?.data?.message || err.message || "Lỗi kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return (
        <div className="p-20 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">Đang tải dữ liệu hệ thống...</p>
        </div>
    );

    if (error) return (
        <div className="p-20 text-center bg-red-50 rounded-[2.5rem] border border-red-100">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-bold text-red-800 mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
                onClick={fetchStats}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
                Thử lại
            </button>
        </div>
    );

    const cards = [
        { title: 'Người dùng', count: stats?.overview?.totalUsers || 0, icon: '👥', color: 'blue' },
        { title: 'Trang trại', count: stats?.overview?.totalFarms || 0, icon: '🚜', color: 'green' },
        { title: 'Sản phẩm', count: stats?.overview?.totalProducts || 0, icon: 'purple', color: 'purple' },
        { title: 'Đơn hàng', count: stats?.overview?.totalOrders || 0, icon: '🛒', color: 'orange' },
        { title: 'Doanh thu', count: `${(stats?.overview?.totalRevenue || 0).toLocaleString()}đ`, icon: '💰', color: 'emerald' },
        { title: 'Báo cáo chờ', count: stats?.overview?.pendingReports || 0, icon: '🚩', color: 'red' },
    ];

    const getColorClass = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-100 dark:bg-blue-900/30';
            case 'green': return 'bg-green-100 dark:bg-green-900/30';
            case 'purple': return 'bg-purple-100 dark:bg-purple-900/30';
            case 'orange': return 'bg-orange-100 dark:bg-orange-900/30';
            case 'emerald': return 'bg-emerald-100 dark:bg-emerald-900/30';
            case 'red': return 'bg-red-100 dark:bg-red-900/30';
            default: return 'bg-gray-100 dark:bg-gray-900/30';
        }
    }

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform ${getColorClass(card.color)}`}>
                                {card.icon}
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tháng này</span>
                        </div>
                        <h3 className="text-gray-500 font-bold mb-1">{card.title}</h3>
                        <p className={`text-3xl font-black text-gray-800 dark:text-white`}>
                            {card.count}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Users Role Distribution */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-2">
                        <span>📊</span> Phân bổ Vai trò
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(stats?.usersByRole || {}).map(([role, count]: any) => (
                            <div key={role} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="capitalize text-gray-600">{role}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(count / stats?.overview?.totalUsers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Logs / Activity (Placeholder) */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-2">
                        <span>🔔</span> Hoạt động Hệ thống
                    </h3>
                    <div className="space-y-6">
                        {[
                            { text: 'Trang trại "Đà Lạt Xanh" vừa đăng ký', time: '10 phút trước', type: 'farm' },
                            { text: 'Tài khoản "admin@test.com" đã đăng nhập', time: '25 phút trước', type: 'auth' },
                            { text: 'Hệ thống Blockchain đã xác thực 15 giao dịch', time: '1 giờ trước', type: 'blockchain' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                    {log.type === 'farm' ? '🚜' : log.type === 'auth' ? '🔑' : '⛓️'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.text}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
