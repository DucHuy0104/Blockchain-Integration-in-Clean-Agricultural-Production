"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from "axios";

// Cấu hình URL Backend
const API_URL = "http://localhost:5001/api";

interface Shipment {
    id: string;
    code: string;
    sender_address: string;
    receiver_address: string;
    status: "assigned" | "picked_up" | "delivering" | "delivered";
    product_name: string;
    quantity: string;
    note?: string;
    createdAt?: string;
}

export default function DriverDashboard() {
    const { user, getAccessToken, loading: authLoading } = useAuth();
    const router = useRouter();

    // State dữ liệu
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    // State profile
    const [localName, setLocalName] = useState("");

    // ================= 1. LOGIC TÊN THÔNG MINH =================
    useEffect(() => {
        if (user) {
            if (!user.fullName || user.fullName === "New User") {
                const emailName = user.email?.split('@')[0] || "Tài xế";
                setLocalName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
            } else {
                setLocalName(user.fullName);
            }
        }
    }, [user]);

    // ================= 2. GỌI API LẤY DỮ LIỆU =================
    const fetchShipments = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            if (!token) return;

            const res = await axios.get(`${API_URL}/driver/shipments`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && (res.data.success || Array.isArray(res.data.shipments))) {
                // Handle both API response formats found in the two versions
                const items = res.data.data || res.data.shipments || [];
                setShipments(items);
            }
        } catch (error) {
            console.error("Lỗi data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login?role=driver");
            } else {
                fetchShipments();
            }
        }
    }, [user, authLoading]);

    // ================= 3. CÁC HÀM XỬ LÝ =================
    const updateShipmentStatus = async (id: string, newStatus: string) => {
        try {
            const token = await getAccessToken();
            await axios.put(`${API_URL}/driver/shipments/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShipments(prev => prev.map(item =>
                item.id === id ? { ...item, status: newStatus as any } : item
            ));
            return true;
        } catch (error) {
            alert("⚠️ Không thể cập nhật trạng thái đơn hàng.");
            return false;
        }
    };

    const handleScan = async (results: any) => {
        if (results && results.length > 0) {
            const scannedCode = results[0].rawValue;
            if (selectedShipment) {
                if (scannedCode === selectedShipment.code || scannedCode === selectedShipment.id || scannedCode === String(selectedShipment.id)) {
                    setIsScanning(false);
                    const success = await updateShipmentStatus(selectedShipment.id, "picked_up");
                    if (success) {
                        alert(`✅ Đã nhận đơn: ${scannedCode}`);
                        setSelectedShipment(null);
                    }
                } else {
                    alert(`⚠️ Sai mã đơn!\nĐơn cần lấy: ${selectedShipment.code || selectedShipment.id}`);
                }
            }
        }
    };

    const handleConfirmDelivery = async (shipment: Shipment) => {
        if (confirm(`✅ Xác nhận đã giao xong đơn ${shipment.code || shipment.id}?`)) {
            const success = await updateShipmentStatus(shipment.id, "delivered");
            if (success) setSelectedShipment(null);
        }
    };

    const handleOpenMap = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    };

    // Helper UI
    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'assigned') return "bg-blue-100 text-blue-700 border-blue-200";
        if (['picked_up', 'delivering'].includes(s)) return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-green-100 text-green-700 border-green-200";
    };

    const getStatusLabel = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'assigned') return "Mới gán";
        if (['picked_up', 'delivering'].includes(s)) return "Đang giao";
        return "Đã giao hàng";
    };

    if (authLoading || (loading && shipments.length === 0)) {
        return <div className="py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div><p className="text-gray-400">Đang tải dashboard...</p></div>;
    }

    return (
        <div className="space-y-6">

            {/* Welcome Header (Integrated into Layout) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h2 className="text-xl font-bold text-gray-800">👋 Chào, {localName}!</h2>
                <p className="text-sm text-gray-500">
                    Hôm nay bạn có <strong className="text-blue-600">{shipments.filter(s => s.status.toLowerCase() !== 'delivered').length}</strong> đơn hàng cần xử lý.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Chờ lấy</p>
                    <p className="text-2xl font-black text-blue-700">{shipments.filter(s => s.status.toLowerCase() === 'assigned').length}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Đang giao</p>
                    <p className="text-2xl font-black text-orange-700">{shipments.filter(s => ['picked_up', 'delivering'].includes(s.status.toLowerCase())).length}</p>
                </div>
            </div>

            {/* Shipment List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">📦 Đơn hàng của bạn</h3>
                    <button onClick={fetchShipments} className="text-xs text-blue-600 font-bold">Làm mới</button>
                </div>

                <div className="space-y-4">
                    {shipments.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-200">
                            <p className="text-gray-400 italic">Chưa có đơn hàng nào được gán cho bạn.</p>
                        </div>
                    ) : (
                        shipments.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => { setSelectedShipment(item); setIsScanning(false); }}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-blue-900">#{item.code || item.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase ${getStatusColor(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <p className="font-bold text-gray-800 text-sm">{item.product_name || "Sản phẩm nông sản"}</p>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-start gap-2">
                                            <span className="text-blue-500">📍</span>
                                            <p className="text-gray-600 line-clamp-1"><strong>Từ:</strong> {item.sender_address}</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-orange-500">🏁</span>
                                            <p className="text-gray-600 line-clamp-1"><strong>Đến:</strong> {item.receiver_address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Mới'}</span>
                                    <span className="text-blue-600 text-xs font-bold">Xem chi tiết &rarr;</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL CHI TIẾT & SCANNER */}
            {selectedShipment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Chi tiết vận đơn</h3>
                                <button onClick={() => setSelectedShipment(null)} className="text-gray-300 hover:text-gray-600 text-xl">✕</button>
                            </div>

                            {isScanning ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-center text-gray-600">Quét mã QR trên kiện hàng để xác nhận nhận hàng</p>
                                    <div className="aspect-square bg-black rounded-2xl overflow-hidden border-4 border-blue-500 relative">
                                        <Scanner onScan={handleScan} />
                                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/50 shadow-[0_0_10px_red]"></div>
                                    </div>
                                    <button onClick={() => setIsScanning(false)} className="w-full py-3 text-red-500 font-bold text-sm">Hủy quét</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-blue-900 mb-1">{selectedShipment.code || selectedShipment.id}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColor(selectedShipment.status)}`}>
                                            {getStatusLabel(selectedShipment.status)}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Sản phẩm</p>
                                        <p className="font-bold text-gray-800">{selectedShipment.product_name}</p>
                                        <p className="text-sm text-gray-600 italic">Số lượng: {selectedShipment.quantity}</p>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <div className="w-0.5 flex-1 bg-gray-200"></div>
                                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Điểm lấy hàng</p>
                                                    <p className="text-xs font-semibold text-gray-700">{selectedShipment.sender_address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Điểm giao hàng</p>
                                                    <p className="text-xs font-semibold text-gray-700">{selectedShipment.receiver_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        {['assigned'].includes(selectedShipment.status.toLowerCase()) && (
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => setIsScanning(true)}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-transform active:scale-95"
                                                >
                                                    📷 Quét mã lấy hàng
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm("⚡ Bạn muốn xác nhận lấy hàng nhanh?")) {
                                                            const success = await updateShipmentStatus(selectedShipment.id, "picked_up");
                                                            if (success) {
                                                                alert("✅ Đã lấy hàng thành công!");
                                                                setSelectedShipment(null);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full text-blue-600 font-bold py-2 text-xs text-center active:opacity-60 transition"
                                                >
                                                    ⚡ Xác nhận nhanh (Không cần quét)
                                                </button>
                                            </div>
                                        )}
                                        {['picked_up', 'delivering'].includes(selectedShipment.status.toLowerCase()) && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenMap(selectedShipment.receiver_address)} className="flex-1 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl text-sm">📍 Bản đồ</button>
                                                <button
                                                    onClick={() => handleConfirmDelivery(selectedShipment)}
                                                    className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100"
                                                >
                                                    ✅ Đã giao xong
                                                </button>
                                            </div>
                                        )}
                                        <button onClick={() => setSelectedShipment(null)} className="w-full py-3 text-gray-400 font-bold text-xs uppercase tracking-widest">Đóng</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
