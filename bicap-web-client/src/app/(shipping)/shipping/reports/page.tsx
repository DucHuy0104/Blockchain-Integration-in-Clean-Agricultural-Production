"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ReportsPage() {
    const { getAccessToken, loading: authLoading } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State - View/Responde
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [processing, setProcessing] = useState(false);

    // Modal State - Create
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newReport, setNewReport] = useState({ title: "", content: "" });

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

    const handleCreateReport = async (e: React.FormEvent) => {
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
                body: JSON.stringify(newReport)
            });

            if (res.ok) {
                alert("Gửi báo cáo thành công!");
                setIsCreateModalOpen(false);
                setNewReport({ title: "", content: "" });
                fetchReports();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedReport) return;
        try {
            setProcessing(true);
            const token = await getAccessToken();
            const res = await fetch(`http://localhost:5001/api/reports/${selectedReport.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    adminNote: adminNote
                })
            });

            if (!res.ok) throw new Error("Lỗi cập nhật");

            alert("Cập nhật trạng thái thành công!");
            setSelectedReport(null);
            setAdminNote("");
            fetchReports();

        } catch (error) {
            console.error(error);
            alert("Lỗi hệ thống");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center">⏳ Đang tải danh sách báo cáo...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⚠️ Báo cáo & Sự cố</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
                >
                    🚩 Gửi báo cáo sự cố
                </button>
            </div>

            <div className="space-y-4">
                {reports.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-400">Không có báo cáo nào.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${report.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                        report.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {report.status}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                                    <span className="text-xs font-bold text-blue-600">Từ: {report.sender?.fullName || "Ẩn danh"}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">{report.title}</h3>
                                <p className="text-gray-600 mt-1 line-clamp-2">{report.content}</p>
                            </div>
                            <button
                                onClick={() => { setSelectedReport(report); setAdminNote(report.adminNote || ""); }}
                                className="px-4 py-2 bg-gray-100 font-medium text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* CREATE REPORT MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">💡 Gửi báo cáo sự cố mới</h3>
                            <button onClick={() => setIsCreateModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleCreateReport} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                <input
                                    required
                                    className="w-full border rounded-lg p-2.5 outline-none"
                                    value={newReport.title}
                                    onChange={e => setNewReport({ ...newReport, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết *</label>
                                <textarea
                                    required
                                    className="w-full border rounded-lg p-2.5 outline-none"
                                    rows={4}
                                    value={newReport.content}
                                    onChange={e => setNewReport({ ...newReport, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold">
                                    {processing ? "Đang gửi..." : "Gửi ngay"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">{selectedReport.title}</h3>
                                <p className="text-sm text-gray-500">Gửi bởi {selectedReport.sender?.fullName} • {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-black">✕</button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase">Nội dung báo cáo:</h4>
                                <p className="text-gray-800 whitespace-pre-wrap">{selectedReport.content}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú xử lý (Admin Note):</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    placeholder="Nhập ghi chú hoặc hướng giải quyết..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                            <span className="text-xs text-gray-500">ID: {selectedReport.id}</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 disabled:opacity-50"
                                >
                                    Từ chối / Hủy
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('resolved')}
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow disabled:opacity-50"
                                >
                                    {processing ? "Đang xử lý..." : "✅ Đánh dấu Đã xử lý"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
