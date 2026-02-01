"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function FarmManagementPage() {
    const { getAccessToken } = useAuth();
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    const fetchFarms = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/farms?status=${filterStatus}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFarms(res.data.farms);
        } catch (err) {
            console.error("Lỗi tải trang trại:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, [filterStatus]);

    const handleApprove = async (id: number, status: string) => {
        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/farms/${id}/approve`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Đã ${status === 'active' ? 'duyệt' : 'từ chối'} trang trại!`);
            fetchFarms();
        } catch (err) {
            alert("Lỗi khi xử lý!");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                    {["", "pending", "active", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                                ${filterStatus === s
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {s === "" ? "Tất cả" : s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse">Đang tải danh sách trang trại...</div>
                ) : farms.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold">Không có trang trại nào phù hợp.</div>
                ) : farms.map((f) => (
                    <div key={f.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col hover:shadow-2xl transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                🚜
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${f.status === 'active' ? 'bg-green-100 text-green-600' :
                                    f.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {f.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{f.name}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-6 flex items-center gap-2">
                            <span>📍</span> {f.address}
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl space-y-3 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400 font-bold uppercase">Chủ trại</span>
                                <span className="text-sm font-bold truncate ml-2">{f.owner?.fullName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400 font-bold uppercase">Chứng nhận</span>
                                <span className="text-xs font-black text-green-600">{f.certification || 'Chưa cập nhật'}</span>
                            </div>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-3">
                            {f.status !== 'active' && (
                                <button
                                    onClick={() => handleApprove(f.id, 'active')}
                                    className="bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all text-sm shadow-lg shadow-green-200"
                                >
                                    DUYỆT
                                </button>
                            )}
                            {f.status !== 'rejected' && (
                                <button
                                    onClick={() => handleApprove(f.id, 'rejected')}
                                    className="bg-red-50 text-red-600 font-black py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-sm"
                                >
                                    {f.status === 'pending' ? 'TỪ CHỐI' : 'KHÓA'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
