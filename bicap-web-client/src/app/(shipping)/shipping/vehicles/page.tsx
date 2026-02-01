"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function VehiclesPage() {
    const { getAccessToken, loading: authLoading } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<any>(null);
    const [formData, setFormData] = useState({
        licensePlate: "",
        vehicleType: "Xe tải",
        capacity: "",
        notes: ""
    });
    const [processing, setProcessing] = useState(false);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await fetch("http://localhost:5001/api/vehicles", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) fetchVehicles();
    }, [authLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProcessing(true);
            const token = await getAccessToken();
            const url = editingVehicle
                ? `http://localhost:5001/api/vehicles/${editingVehicle.id}`
                : "http://localhost:5001/api/vehicles";

            const res = await fetch(url, {
                method: editingVehicle ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Lỗi xử lý");
                return;
            }

            alert(editingVehicle ? "Cập nhật thành công!" : "Thêm phương tiện thành công!");
            handleCloseModal();
            fetchVehicles();

        } catch (error) {
            console.error(error);
            alert("Lỗi hệ thống");
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa phương tiện này?")) return;
        try {
            const token = await getAccessToken();
            await fetch(`http://localhost:5001/api/vehicles/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchVehicles();
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenEdit = (v: any) => {
        setEditingVehicle(v);
        setFormData({
            licensePlate: v.licensePlate,
            vehicleType: v.vehicleType,
            capacity: v.capacity || "",
            notes: v.notes || ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        setFormData({ licensePlate: "", vehicleType: "Xe tải", capacity: "", notes: "" });
    };

    if (loading) return <div className="p-10 text-center">⏳ Đang tải danh sách phương tiện...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🚛 Quản lý Đội xe</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
                >
                    ➕ Thêm xe mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                    <div key={v.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{v.vehicleType}</h3>
                                <p className="text-sm font-mono bg-gray-100 px-2 rounded inline-block mt-1">{v.licensePlate}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${v.status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {v.status === 'available' ? 'Sẵn sàng' : v.status}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-2 mb-4">
                            <p>📦 Tải trọng: <span className="font-medium">{v.capacity || "Chưa cập nhật"}</span></p>
                            <p>👤 Tài xế: <span className="font-medium text-blue-600">{v.driver?.fullName || "Chưa gán"}</span></p>
                            {v.notes && <p className="italic text-gray-400 text-xs">"{v.notes}"</p>}
                        </div>

                        <div className="flex justify-end pt-3 border-t gap-3">
                            <button
                                onClick={() => handleOpenEdit(v)}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(v.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}

                {vehicles.length === 0 && (
                    <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-400">Chưa có phương tiện nào.</p>
                    </div>
                )}
            </div>

            {/* MODAL VEHICLE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingVehicle ? "Sửa phương tiện" : "Thêm phương tiện mới"}</h3>
                            <button onClick={handleCloseModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full border rounded-lg p-2.5 outline-none uppercase"
                                    placeholder="VD: 29H-12345"
                                    disabled={!!editingVehicle}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                                    <select
                                        value={formData.vehicleType}
                                        onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 outline-none"
                                    >
                                        <option value="Xe tải">Xe tải</option>
                                        <option value="Xe bán tải">Xe bán tải</option>
                                        <option value="Xe máy">Xe máy</option>
                                        <option value="Container">Container</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tải trọng</label>
                                    <input
                                        type="text"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full border rounded-lg p-2.5 outline-none"
                                        placeholder="VD: 2.5 Tấn"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full border rounded-lg p-2.5 outline-none"
                                    rows={2}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">Hủy</button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? "Đang lưu..." : "Lưu phương tiện"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
