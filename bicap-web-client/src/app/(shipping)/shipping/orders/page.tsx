"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ShippingOrdersPage() {
    const { getAccessToken, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    // States for Assign Modal
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [selectedDriverId, setSelectedDriverId] = useState<string>("");
    const [vehicleInfo, setVehicleInfo] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();

            // 1. Fetch Orders Waiting for Shipping
            const resOrders = await fetch("http://localhost:5001/api/shipments/orders-ready", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const dataOrders = await resOrders.json();

            // 2. Fetch Active Drivers
            const resDrivers = await fetch("http://localhost:5001/api/drivers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const dataDrivers = await resDrivers.json();

            if (Array.isArray(dataOrders)) setOrders(dataOrders);
            if (Array.isArray(dataDrivers)) setDrivers(dataDrivers);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [authLoading]);

    const handleAssignDriver = async () => {
        if (!selectedOrder) return;

        try {
            setProcessing(selectedOrder.id);
            const token = await getAccessToken();

            const payload = {
                orderId: selectedOrder.id,
                driverId: selectedDriverId || null, // Optional (request pickup without driver initially)
                vehicleInfo: vehicleInfo || "Xe tải tiêu chuẩn",
                pickupTime: new Date().toISOString()
            };

            const res = await fetch("http://localhost:5001/api/shipments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Lỗi tạo vận đơn");
                return;
            }

            alert("🎉 Đã tạo vận đơn thành công!");
            setSelectedOrder(null);
            setSelectedDriverId("");
            fetchData(); // Reload list

        } catch (error) {
            console.error("Lỗi tạo vận đơn:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="p-10 text-center">⏳ Đang tải danh sách đơn hàng...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">📦 Đơn hàng cần vận chuyển</h1>
                    <p className="text-gray-500">Danh sách các đơn hàng đã được xác nhận và chờ giao cho tài xế.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                    🔄 Làm mới
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">Hiện tại không có đơn hàng nào cần vận chuyển.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">

                            {/* Product Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
                                        #{order.id}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {order.product?.name || "Sản phẩm không tên"}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    <span className="font-medium">Nông trại:</span> {order.product?.farm?.name} <br />
                                    <span className="font-medium">Khách hàng:</span> {order.retailer?.fullName}
                                </p>

                                <div className="flex gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span>📍 Lấy hàng:</span>
                                        <span className="truncate max-w-[150px] font-medium text-gray-700" title={order.product?.farm?.address}>
                                            {order.product?.farm?.address || "---"}
                                        </span>
                                    </div>
                                    <div className="arrow text-gray-300">➝</div>
                                    <div className="flex items-center gap-2">
                                        <span>🏁 Giao tới:</span>
                                        <span className="truncate max-w-[150px] font-medium text-gray-700" title={order.retailer?.address}>
                                            {order.retailer?.address || "---"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="w-full md:w-64 flex flex-col items-end justify-center min-h-full">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    disabled={!!processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    🚀 Tạo vận đơn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Assign Driver */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Điều phối vận chuyển</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500">✕</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800 font-medium">Đơn hàng #{selectedOrder.id}: {selectedOrder.product?.name}</p>
                                <p className="text-xs text-blue-600 mt-1">Từ {selectedOrder.product?.farm?.name} đến {selectedOrder.retailer?.fullName}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Tài xế</label>
                                <select
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="">-- Chọn tài xế (Để trống nếu chưa có) --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.fullName || d.name} - {d.status === 'Bận' ? '(Đang bận)' : '(Sẵn sàng)'} - {d.vehicleType || 'Xe tải'}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    * Nếu chọn tài xế đang bận, họ sẽ nhận đơn sau khi hoàn thành chuyến hiện tại.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin phương tiện (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={vehicleInfo}
                                    onChange={(e) => setVehicleInfo(e.target.value)}
                                    placeholder="VD: Xe lạnh 2 tấn, 29C-12345"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleAssignDriver}
                                disabled={!!processing}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-bold flex items-center gap-2"
                            >
                                {processing ? <span className="animate-spin">⏳</span> : "✅ Xác nhận Tạo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
