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
            setReports(res.data.reports);
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
        const note = prompt("Nhập phản hồi cho báo cáo/sự cố này:");
        if (note === null) return;

        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/reports/${id}/status`, { status, adminNote: note }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Đã cập nhật báo cáo!");
            fetchReports();
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Người gửi / Loại</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Nội dung báo cáo</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Ngày gửi</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold animate-pulse">Đang tải dữ liệu...</td></tr>
                        ) : reports.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400">Không có báo cáo nào hiện có.</td></tr>
                        ) : reports.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                                <td className="px-8 py-6">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{r.sender?.fullName}</p>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{r.sender?.role}</p>
                                    </div>
                                    <span className="mt-2 inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">{r.type}</span>
                                </td>
                                <td className="px-8 py-6 max-w-xs">
                                    <p className="text-sm font-medium line-clamp-2">{r.description}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-gray-400 font-bold">{new Date(r.createdAt).toLocaleString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                            r.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(r.id, 'resolved')}
                                            className="bg-green-50 text-green-600 p-2 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                                            title="Đánh dấu đã giải quyết"
                                        >
                                            ✅
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(r.id, 'dismissed')}
                                            className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            title="Hủy bỏ/Từ chối"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
