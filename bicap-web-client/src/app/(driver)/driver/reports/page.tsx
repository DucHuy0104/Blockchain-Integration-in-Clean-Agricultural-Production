"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DriverReportPage() {
    const { getAccessToken, loading: authLoading } = useAuth();
    const router = useRouter();

    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "incident", // incident, traffic, other
    });
    const [processing, setProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await fetch("http://localhost:5001/api/reports", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) fetchReports();
    }, [authLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProcessing(true);
            const token = await getAccessToken();
            const res = await fetch("http://localhost:5001/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    receiverRole: "shipping" // Driver reports to Shipping Manager
                })
            });

            if (!res.ok) throw new Error("Gửi báo cáo thất bại");

            alert("Đã gửi báo cáo thành công!");
            setFormData({ title: "", content: "", type: "incident" });
            setShowForm(false);
            fetchReports();

        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi báo cáo");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-extrabold text-gray-800">🚩 Báo cáo & Sự cố</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all ${showForm ? 'bg-gray-200 text-gray-700' : 'bg-red-600 text-white shadow-red-200'
                        }`}
                >
                    {showForm ? 'Đóng' : '➕ Gửi mới'}
                </button>
            </div>

            {/* FORM GỬI MỚI */}
            {showForm && (
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-red-50 mb-8 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Loại sự cố</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'incident', label: 'Hàng/Xe', emoji: '⚠️' },
                                    { id: 'traffic', label: 'Đường xá', emoji: '🛣️' },
                                    { id: 'other', label: 'Khác', emoji: '💬' }
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: item.id })}
                                        className={`py-3 px-2 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${formData.type === item.id
                                            ? 'bg-red-50 text-red-600 border-red-500 shadow-inner'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <span className="text-lg">{item.emoji}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tiêu đề ngắn gọn</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white outline-none focus:border-red-500 transition-all font-medium"
                                placeholder="VD: Xe hỏng, Tắc đường..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white outline-none focus:border-red-500 transition-all font-medium"
                                placeholder="Mô tả cụ thể để Manager dễ xử lý..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all text-lg"
                        >
                            {processing ? "⏳ Đang gửi..." : "🚀 Gửi báo cáo ngay"}
                        </button>
                    </form>
                </div>
            )}

            {/* LỊCH SỬ BÁO CÁO */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">Lịch sử báo cáo của bạn</h3>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Đang tải lịch sử...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
                        Bạn chưa gửi báo cáo nào.
                    </div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${report.type === 'incident' ? 'bg-orange-100 text-orange-600' :
                                        report.type === 'traffic' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {report.type === 'incident' ? 'Sự cố' : report.type === 'traffic' ? 'Giao thông' : 'Khác'}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1 font-bold">{new Date(report.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {report.status === 'pending' ? 'Đang chờ' : report.status === 'resolved' ? 'Đã xử lý' : 'Từ chối'}
                                </span>
                            </div>

                            <h4 className="font-extrabold text-gray-800 mb-1">{report.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{report.content}</p>

                            {report.adminNote && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Phản hồi từ quản lý:</p>
                                    <p className="text-xs text-blue-800 font-medium italic">"{report.adminNote}"</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-10 px-8 text-center text-[10px] text-gray-400 leading-relaxed font-medium">
                🛡️ Mọi thông tin báo cáo đều được bảo mật và gửi trực tiếp đến Shipping Manager & Admin để hỗ trợ bạn kịp thời.
            </div>
        </div>
    );
}
