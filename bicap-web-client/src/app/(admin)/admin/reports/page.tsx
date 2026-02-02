"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function ReportManagementPage() {
    const { getAccessToken } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get('http://localhost:5001/api/admin/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data.reports || []);
        } catch (err) {
            console.error("Lỗi tải báo cáo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (id: number, status: string) => {
        const actionText = status === 'resolved' ? 'giải quyết' : 'từ chối';
        const note = prompt(`Nhập phản hồi ${actionText} cho báo cáo này:`);
        if (note === null) return;

        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/reports/${id}/status`, { status, adminNote: note }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Đã cập nhật báo cáo thành ${status}!`);
            fetchReports();
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white">Quản Lý Báo Cáo</h1>
                    <p className="text-sm text-gray-400 mt-1">Theo dõi và xử lý các phản hồi, sự cố từ hệ thống</p>
                </div>
                <button
                    onClick={fetchReports}
                    className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all text-xl"
                    title="Tải lại dữ liệu"
                >
                    🔄
                </button>
            </div>

            {/* Reports Table Container */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Người Gửi / Loại</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Nội Dung Chi Tiết</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thời Gian</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Trạng Thái</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="animate-pulse space-y-3">
                                        <div className="text-gray-400 font-bold">Đang tải báo cáo...</div>
                                        <div className="flex justify-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center text-gray-400">
                                    <div className="text-5xl mb-4">📭</div>
                                    <p className="font-bold">Hiện không có báo cáo nào cần xử lý</p>
                                </td>
                            </tr>
                        ) : reports.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="px-6 py-5 align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-sm font-black text-blue-600 flex-shrink-0">
                                            {r.sender?.fullName?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{r.sender?.fullName || "N/A"}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-md whitespace-nowrap">
                                                    {r.sender?.role || "GUEST"}
                                                </span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                    {r.type || "GENERAL"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 align-middle max-w-md">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-2">
                                        "{r.content}"
                                    </p>
                                </td>
                                <td className="px-6 py-5 align-middle whitespace-nowrap">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-300">
                                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="px-6 py-5 align-middle text-center">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm whitespace-nowrap ${r.status === 'resolved' ? 'bg-green-100 text-green-600 ring-1 ring-green-200' :
                                        r.status === 'pending' ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-200' :
                                            'bg-red-50 text-red-500 ring-1 ring-red-100'
                                        }`}>
                                        {r.status === 'resolved' ? 'Đã xử lý' : r.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <div className="flex justify-center gap-2">
                                        {r.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(r.id, 'resolved')}
                                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm whitespace-nowrap"
                                                >
                                                    Phê duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(r.id, 'dismissed')}
                                                    className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm whitespace-nowrap"
                                                >
                                                    Từ chối
                                                </button>
                                            </>
                                        )}
                                        {r.status !== 'pending' && (
                                            <span className="text-[10px] font-black text-gray-300 uppercase italic whitespace-nowrap">Hoàn tất</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend / Tip Area */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 flex items-start gap-4">
                <span className="text-2xl">💡</span>
                <div>
                    <h4 className="text-sm font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-1">Ghi chú cho Admin</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        Khi phê duyệt hoặc từ chối báo cáo, hệ thống sẽ yêu cầu nhập phản hồi. Phản hồi này sẽ được gửi đến người gửi báo cáo để minh bạch quá trình xử lý.
                    </p>
                </div>
            </div>
        </div>
    );
}
