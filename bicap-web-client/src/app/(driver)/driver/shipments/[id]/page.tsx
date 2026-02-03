"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DriverShipmentDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { getAccessToken, loading: authLoading } = useAuth();

    const [shipment, setShipment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // QR Scan Simulation State
    const [isScanning, setIsScanning] = useState(false);
    const [scanType, setScanType] = useState<"PICKUP" | "DELIVERY" | null>(null);
    const [qrInput, setQrInput] = useState("");

    const fetchShipment = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken();
            const res = await fetch(`http://localhost:5001/api/driver/shipments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setShipment(data.shipment);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) fetchShipment();
    }, [authLoading, id]);

    const handleScanAction = (type: "PICKUP" | "DELIVERY") => {
        setScanType(type);
        setIsScanning(true);
        // Auto-fill logic for easier testing
        if (shipment) {
            if (type === "PICKUP") {
                setQrInput(`SHIPMENT_${shipment.id}`);
            } else {
                setQrInput(`SHIPMENT_${shipment.id}`);
            }
        }
    };

    const performConfirm = async (type: "PICKUP" | "DELIVERY", qrValue: string) => {
        if (!shipment) return;
        try {
            setProcessing(true);
            const token = await getAccessToken();
            const endpoint = type === "PICKUP" ? "confirm-pickup" : "confirm-delivery";

            const payload: any = {
                shipmentId: shipment.id,
                qrCode: qrValue,
                latitude: 10.7769, // Mock GPS
                longitude: 106.7009
            };

            if (type === "DELIVERY") {
                payload.deliveryImage = "https://via.placeholder.com/300x200?text=Pod+Proof+Image";
            }

            const res = await fetch(`http://localhost:5001/api/driver/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Lỗi xác nhận");
                return;
            }

            alert(`✅ ${type === "PICKUP" ? "Nhận hàng" : "Giao hàng"} thành công!`);
            setIsScanning(false);
            setQrInput("");
            fetchShipment(); // Reload

            if (type === "DELIVERY") {
                router.push("/driver/dashboard");
            }

        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối");
        } finally {
            setProcessing(false);
        }
    };

    const submitScan = () => {
        if (!scanType) return;
        performConfirm(scanType, qrInput);
    };

    const handleQuickConfirm = (type: "PICKUP" | "DELIVERY") => {
        if (!shipment) return;
        const quickQr = `SHIPMENT_${shipment.id}`;
        if (confirm(`Bạn muốn xác nhận nhanh ${type === "PICKUP" ? "nhận hàng" : "giao hàng"}?`)) {
            performConfirm(type, quickQr);
        }
    };

    const handleStartDelivery = async () => {
        if (!shipment) return;
        try {
            setProcessing(true);
            const token = await getAccessToken();
            const res = await fetch(`http://localhost:5001/api/driver/shipments/${shipment.id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: "delivering" })
            });

            if (res.ok) {
                alert("🚀 Bắt đầu vận chuyển!");
                fetchShipment();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center">⏳ Đang tải chi tiết...</div>;
    if (!shipment) return <div className="p-10 text-center text-red-500">❌ Không tìm thấy đơn hàng</div>;

    // Simulated Product Detection from QR
    const detectedProduct = qrInput.includes(`ORDER_${shipment.orderId}`) || qrInput.includes(`SHIPMENT_${shipment.id}`)
        ? shipment.order?.product
        : null;

    return (
        <div className="pb-24">
            {/* HEADER NAV */}
            <div className="flex items-center gap-2 mb-4">
                <Link href="/driver/dashboard" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-gray-600">
                    ←
                </Link>
                <span className="font-bold text-lg">Chi tiết đơn #{shipment.id}</span>
            </div>

            {/* STATUS CARD */}
            <div className="bg-white p-5 rounded-xl shadow-md border-h-4 border-blue-500 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">Trạng thái</span>
                    <span className={`px-3 py-1 font-bold rounded-lg uppercase text-xs 
                        ${shipment.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {shipment.status === 'assigned' ? 'Mới gán' :
                            shipment.status === 'picked_up' ? 'Đã lấy hàng' :
                                shipment.status === 'delivering' ? 'Đang giao' :
                                    shipment.status === 'delivered' ? 'Hoàn thành' : shipment.status}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full z-10 ${['assigned', 'picked_up', 'delivering', 'delivered'].includes(shipment.status) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex-1 h-1 ${['picked_up', 'delivering', 'delivered'].includes(shipment.status) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-3 h-3 rounded-full z-10 ${['picked_up', 'delivering', 'delivered'].includes(shipment.status) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex-1 h-1 ${['delivered'].includes(shipment.status) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-3 h-3 rounded-full z-10 ${shipment.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Đã gán</span>
                    <span>Đã lấy</span>
                    <span>Đã giao</span>
                </div>
            </div>

            {/* INFO DETAILS */}
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">📍 Lộ trình</h3>
                    <div className="space-y-4 relative">
                        {/* Line connector */}
                        <div className="absolute left-[7px] top-6 bottom-6 w-0.5 bg-gray-100"></div>

                        <div className="flex gap-3 relative">
                            <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 mt-1 z-10"></div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Điểm lấy hàng (Farm)</p>
                                <p className="text-gray-800 font-bold text-sm">{shipment.pickupLocation || shipment.order?.product?.farm?.name}</p>
                                <p className="text-xs text-gray-500">{shipment.order?.product?.farm?.address}</p>
                                <p className="text-xs text-blue-600 mt-1 font-medium">📞 {shipment.order?.product?.farm?.phone || "Liên hệ chủ trại"}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative">
                            <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 mt-1 z-10"></div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Điểm giao hàng (Store)</p>
                                <p className="text-gray-800 font-bold text-sm">{shipment.deliveryLocation || shipment.order?.retailer?.fullName}</p>
                                <p className="text-xs text-gray-500">{shipment.order?.retailer?.address}</p>
                                <p className="text-xs text-blue-600 mt-1 font-medium">📞 {shipment.order?.retailer?.phone || "Liên hệ khách"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">📦 Thông tin hàng</h3>
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl shadow-inner">🍎</div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">{shipment.order?.product?.name}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-500">Khối lượng:</span>
                                <span className="font-bold text-blue-600">{shipment.order?.quantity} kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Mã lô:</span>
                                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{shipment.order?.product?.batchCode}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link href="/driver/reports" className="block p-4 bg-red-50 text-red-600 rounded-xl font-bold text-center border border-red-100 shadow-sm active:scale-95 transition">
                    🚩 Gửi báo cáo sự cố ngay
                </Link>
            </div>

            {/* ACTION BUTTONS (STICKY BOTTOM) */}
            <div className="fixed bottom-16 left-0 right-0 p-4 max-w-md mx-auto z-40 space-y-3">
                {shipment.status === 'assigned' && (
                    <>
                        <button
                            onClick={() => handleScanAction("PICKUP")}
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-lg active:scale-95 transition"
                        >
                            📷 Quét QR Nhận Hàng
                        </button>
                        <button
                            onClick={() => handleQuickConfirm("PICKUP")}
                            disabled={processing}
                            className="w-full text-blue-600 font-bold py-2 text-sm text-center active:opacity-60 transition"
                        >
                            ⚡ Xác nhận nhanh (Không cần quét)
                        </button>
                    </>
                )}

                {shipment.status === 'picked_up' && (
                    <button
                        onClick={handleStartDelivery}
                        disabled={processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 text-lg active:scale-95 transition"
                    >
                        🚚 Bắt đầu vận chuyển
                    </button>
                )}

                {shipment.status === 'delivering' && (
                    <>
                        <button
                            onClick={() => handleScanAction("DELIVERY")}
                            disabled={processing}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-2 text-lg active:scale-95 transition"
                        >
                            📷 Quét QR Giao Hàng
                        </button>
                        <button
                            onClick={() => handleQuickConfirm("DELIVERY")}
                            disabled={processing}
                            className="w-full text-orange-600 font-bold py-2 text-sm text-center active:opacity-60 transition"
                        >
                            ⚡ Xác nhận nhanh (Giao hàng)
                        </button>
                    </>
                )}

                {shipment.status === 'delivered' && (
                    <div className="bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-lg">
                        ✅ Hoàn thành vận chuyển
                    </div>
                )}
            </div>

            {/* SCAN MODAL */}
            {isScanning && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">📸 Quét mã {scanType === 'PICKUP' ? 'từ trang trại' : 'đối soát'}</h3>
                            <button onClick={() => { setIsScanning(false); setQrInput(""); }} className="bg-gray-100 p-2 rounded-full">✕</button>
                        </div>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-56 h-56 border-4 border-blue-500/30 rounded-3xl flex items-center justify-center bg-gray-900 mb-6 relative overflow-hidden shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-20 animate-scan"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-scan-line"></div>
                                <span className="text-[10px] text-gray-500 font-mono">SIMULATION MODE ACTIVE</span>
                            </div>

                            <div className="w-full space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Mã quét được:</label>
                                    <input
                                        type="text"
                                        value={qrInput}
                                        onChange={(e) => setQrInput(e.target.value)}
                                        className="w-full border-2 border-gray-100 p-3 rounded-xl text-center font-mono font-bold bg-gray-50 text-blue-600 focus:border-blue-500 outline-none"
                                        placeholder="SHIPMENT_ID..."
                                    />
                                </div>

                                {/* INFO DISPLAY FROM QR */}
                                {detectedProduct && (
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-2xl animate-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="text-2xl">🔍</div>
                                            <div>
                                                <p className="text-[10px] font-bold text-green-600 uppercase">Thông tin sản phẩm đối soát:</p>
                                                <p className="font-bold text-gray-800 text-sm leading-tight">{detectedProduct.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Xuất xứ: {detectedProduct.farm?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={submitScan}
                                    disabled={processing || !qrInput}
                                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${scanType === 'PICKUP' ? 'bg-blue-600' : 'bg-green-600'
                                        } disabled:opacity-50`}
                                >
                                    {processing ? "Đang xử lý..." : `Xác nhận & Hoàn tất`}
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-white/60 text-xs text-center font-medium max-w-[250px]">
                        Vui lòng nhắm camera vào mã QR dán trên thùng hàng để truy xuất nguồn gốc sản phẩm.
                    </p>
                </div>
            )}
        </div>
    );
}
