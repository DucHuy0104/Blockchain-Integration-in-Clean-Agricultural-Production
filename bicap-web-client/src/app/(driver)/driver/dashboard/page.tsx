"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DriverDashboard() {
    const { getAccessToken, loading: authLoading, user } = useAuth();
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            // Use the endpoint that gets assigned shipments for the logged-in driver
            const res = await fetch("http://localhost:5001/api/driver/shipments", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (data && Array.isArray(data.shipments)) {
                setShipments(data.shipments);
            } else {
                setShipments([]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) fetchShipments();
    }, [authLoading]);

    // Filter Active vs Completed (Simple Logic)
    const activeShipments = shipments.filter(s => ['assigned', 'picked_up', 'delivering'].includes(s.status));
    // const completedShipments = shipments.filter(s => s.status === 'delivered');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'assigned': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">MỚI GÁN</span>;
            case 'picked_up': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">ĐÃ LẤY HÀNG</span>;
            case 'delivering': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">ĐANG GIAO</span>;
            case 'delivered': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">HOÀN THÀNH</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{status}</span>;
        }
    };

    if (loading) return <div className="p-10 text-center">⏳ Đang tải công việc...</div>;

    return (
        <div>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800">👋 Chào, {user?.fullName || "Bác tài"}!</h2>
                <p className="text-sm text-gray-500">Bạn có <strong className="text-blue-600">{activeShipments.length}</strong> đơn hàng cần xử lý hôm nay.</p>
            </div>

            <h3 className="font-bold text-gray-700 mb-3 px-1">Đơn hàng hiện tại</h3>

            {activeShipments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
                    <span className="text-4xl block mb-2">😴</span>
                    Hiện chưa có đơn hàng nào.
                </div>
            ) : (
                <div className="space-y-4">
                    {activeShipments.map(shipment => (
                        <Link href={`/driver/shipments/${shipment.id}`} key={shipment.id} className="block">
                            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition relative">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-blue-800 text-lg">#{shipment.id}</span>
                                    {getStatusBadge(shipment.status)}
                                </div>

                                <div className="space-y-3">
                                    {/* FROM */}
                                    <div className="flex gap-3 items-start">
                                        <div className="w-6 flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <div className="w-0.5 h-full bg-gray-200 min-h-[20px]"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Điểm lấy hàng</p>
                                            <p className="text-sm text-gray-800 font-medium line-clamp-2">{shipment.pickupLocation || shipment.order?.product?.farm?.address}</p>
                                        </div>
                                    </div>

                                    {/* TO */}
                                    <div className="flex gap-3 items-start">
                                        <div className="w-6 flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Điểm giao hàng</p>
                                            <p className="text-sm text-gray-800 font-medium line-clamp-2">{shipment.deliveryLocation || shipment.order?.retailer?.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{new Date(shipment.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span className="text-blue-600 font-bold">Chi tiết &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
