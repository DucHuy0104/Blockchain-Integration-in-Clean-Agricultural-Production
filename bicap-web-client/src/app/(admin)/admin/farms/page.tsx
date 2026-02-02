"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function FarmManagementPage() {
    const { getAccessToken } = useAuth();
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [currentFarm, setCurrentFarm] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [actionType, setActionType] = useState<"active" | "rejected" | "pending">("active");

    const fetchFarms = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await axios.get(`http://localhost:5001/api/admin/farms?status=${filterStatus}&search=${search}`, {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFarms();
    };

    const openActionModal = (farm: any, type: "active" | "rejected" | "pending") => {
        setCurrentFarm(farm);
        setActionType(type);
        setAdminNote(farm.adminNote || "");
        setShowModal(true);
    };

    const handleActionSubmit = async () => {
        if (!adminNote && actionType === 'rejected') {
            alert("Vui lòng nhập lý do từ chối!");
            return;
        }

        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:5001/api/admin/farms/${currentFarm.id}/approve`,
                { status: actionType, note: adminNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Hành động thành công!`);
            setShowModal(false);
            fetchFarms();
        } catch (err) {
            alert("Lỗi khi xử lý!");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn trang trại này? Hành động này không thể hoàn tác.")) return;

        try {
            const token = await getAccessToken();
            await axios.delete(`http://localhost:5001/api/admin/farms/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Đã xóa trang trại thành công!");
            fetchFarms();
        } catch (err) {
            alert("Lỗi khi xóa trang trại!");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-8">Quản Lý Trang Trại</h1>

            {/* Filters & Search Bar */}
            <div className="flex flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <div className="flex flex-row flex-nowrap gap-2 min-w-max">
                    {[
                        { id: "", label: "Tất cả" },
                        { id: "pending", label: "Chờ duyệt" },
                        { id: "active", label: "Đang hoạt động" },
                        { id: "rejected", label: "Từ chối" }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setFilterStatus(s.id)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${filterStatus === s.id
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative min-w-[300px] flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Tìm kiếm trang trại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600">
                        🔍
                    </button>
                </form>
            </div>

            {/* Farm List - Refined Table Layout */}
            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Trang Trại</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Trạng Thái</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Chủ Sở Hữu</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Chứng Nhận</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center animate-pulse text-gray-400 font-bold">Đang tải danh sách trang trại...</td>
                                </tr>
                            ) : farms.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">Không có trang trại nào phù hợp.</td>
                                </tr>
                            ) : farms.map((f) => (
                                <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                🚜
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-100">{f.name}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                    📍 {f.address}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${f.status === 'active' ? 'bg-green-100 text-green-600' :
                                            f.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {f.status === 'active' ? 'Đang hoạt động' :
                                                f.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{f.owner?.fullName}</div>
                                        <div className="text-[10px] text-gray-400">{f.owner?.email}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">
                                            {f.certification || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 whitespace-nowrap">
                                            {f.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => openActionModal(f, 'active')}
                                                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm text-[10px] font-bold whitespace-nowrap"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => openActionModal(f, 'rejected')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm text-[10px] font-bold whitespace-nowrap"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                            {f.status === 'active' && (
                                                <button
                                                    onClick={() => handleDelete(f.id)}
                                                    className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm text-[10px] font-bold whitespace-nowrap"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                            {f.status === 'rejected' && (
                                                <button
                                                    onClick={() => openActionModal(f, 'pending')}
                                                    className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm text-[10px] font-bold whitespace-nowrap"
                                                >
                                                    Chờ duyệt
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                                    {actionType === 'active' ? 'Phê Duyệt Trang Trại' :
                                        actionType === 'rejected' ? 'Từ Chối Trang Trại' : 'Cập Nhật Trạng Thái'}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">Trang trại: <strong>{currentFarm?.name}</strong></p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-2xl text-gray-300 hover:text-gray-500 transition-colors">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Ghi chú từ quản trị viên</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder={actionType === 'rejected' ? "Vui lòng nhập lý do từ chối..." : "Ghi chú bổ sung (không bắt buộc)..."}
                                    className="w-full h-32 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all"
                                />
                            </div>

                            <button
                                onClick={handleActionSubmit}
                                className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-lg
                                    ${actionType === 'active' ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700' :
                                        actionType === 'rejected' ? 'bg-red-600 text-white shadow-red-200 hover:bg-red-700' : 'bg-orange-500 text-white'}`}
                            >
                                XÁC NHẬN {actionType.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
