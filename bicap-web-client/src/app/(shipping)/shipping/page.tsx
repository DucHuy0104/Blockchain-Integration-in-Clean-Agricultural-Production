"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ShipmentsPage() {
  const { getAccessToken, loading: authLoading } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // For QR
  const [cancelTarget, setCancelTarget] = useState<any>(null); // For Cancel
  const [cancelReason, setCancelReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      
      if (!token) {
        console.error("Không có token, vui lòng đăng nhập lại");
        throw new Error("Không có token xác thực");
      }

      const res = await fetch("http://localhost:5001/api/shipments", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Lỗi không xác định' }));
        console.error("API Error:", res.status, errorData);
        throw new Error(errorData.message || "Kết nối API thất bại");
      }

      const data = await res.json();
      setShipments(data || []);
    } catch (err: any) {
      console.error("Lỗi API:", err);
      setShipments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      // Wait a bit for token to be available
      const timer = setTimeout(() => {
        fetchShipments();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const handleCancelShipment = async () => {
    if (!cancelTarget) return;
    try {
      setProcessing(true);
      const token = await getAccessToken();
      const res = await fetch(`http://localhost:5001/api/shipments/${cancelTarget.id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Lỗi khi hủy đơn");
        return;
      }

      alert("Hủy vận đơn thành công!");
      setCancelTarget(null);
      setCancelReason("");
      fetchShipments();
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === 'assigned' || s.includes("đang")) return "bg-blue-100 text-blue-600 border-blue-200";
    if (s === 'shipping' || s.includes("vận chuyển")) return "bg-indigo-100 text-indigo-600 border-indigo-200";
    if (s === 'picked_up') return "bg-purple-100 text-purple-600 border-purple-200";
    if (s === 'created' || s === 'pending_pickup') return "bg-orange-100 text-orange-600 border-orange-200";
    if (s === 'delivered' || s.includes("hoàn")) return "bg-green-100 text-green-600 border-green-200";
    if (s === 'cancelled' || s === 'failed') return "bg-red-100 text-red-600 border-red-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const statusTranslation: any = {
    created: 'Mới tạo',
    pending_pickup: 'Chờ lấy hàng',
    assigned: 'Đã gán xe',
    picked_up: 'Đã lấy hàng',
    shipping: 'Đang giao', // Legacy
    delivering: 'Đang giao',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy',
    failed: 'Thất bại'
  };

  // Filter Logic
  const filteredShipments = shipments.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['created', 'pending_pickup', 'assigned', 'picked_up', 'delivering'].includes(s.status);
    if (filter === 'completed') return s.status === 'delivered';
    if (filter === 'cancelled') return ['cancelled', 'failed'].includes(s.status);
    return s.status === filter;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-[500px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📦 Quản lý Vận chuyển ({filteredShipments.length})
          </h2>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'active', label: 'Đang chạy' },
              { id: 'completed', label: 'Hoàn thành' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-xs font-bold uppercase border-b bg-gray-50">
                <th className="py-4 px-4">Mã Vận Đơn</th>
                <th className="py-4 px-4">Điểm đi / Đến</th>
                <th className="py-4 px-4">Tài xế</th>
                <th className="py-4 px-4 text-center">Trạng thái</th>
                <th className="py-4 px-4 text-center">QR Code</th>
                <th className="py-4 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-blue-50/50 transition">
                  <td className="py-4 px-4">
                    <span className="font-bold text-blue-600">#{shipment.id}</span>
                    <div className="text-xs text-gray-400 mt-1">{new Date(shipment.createdAt).toLocaleDateString("vi-VN")}</div>
                  </td>
                  <td className="py-4 px-4 max-w-[250px]">
                    <div className="text-sm font-medium truncate" title={shipment.diemDi}>{shipment.diemDi}</div>
                    <div className="text-xs text-gray-400 text-center my-0.5">⬇</div>
                    <div className="text-sm font-medium truncate" title={shipment.diemDen}>{shipment.diemDen}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-700">
                    {shipment.taiXe}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(shipment.status)} whitespace-nowrap`}>
                      {statusTranslation[shipment.status] || shipment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(shipment)}
                      className="text-gray-500 hover:text-blue-600 text-2xl"
                    >
                      🔳
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {['created', 'pending_pickup', 'assigned'].includes(shipment.status) && (
                      <button
                        onClick={() => setCancelTarget(shipment)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL QUÉT QR --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Mã QR Vận Đơn #{selectedOrder.id}</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SHIPMENT_${selectedOrder.id}`}
              alt="QR Code"
              className="w-48 h-48 mx-auto border"
            />
            <p className="text-sm text-gray-500 mt-2">Dùng App Tài xế để quét mã này</p>
          </div>
        </div>
      )}

      {/* --- MODAL HỦY ĐƠN --- */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 font-bold flex justify-between">
              <span>Hủy Vận Đơn #{cancelTarget.id}</span>
              <button onClick={() => setCancelTarget(null)}>✕</button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn hủy chuyến vận chuyển này không? Hành động này không thể hoàn tác.</p>
              <label className="block text-sm font-bold text-gray-700 mb-1">Lý do hủy:</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                rows={3}
                placeholder="Nhập lý do hủy..."
              ></textarea>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setCancelTarget(null)} className="px-4 py-2 bg-white border rounded-lg text-gray-700">Đóng</button>
              <button
                onClick={handleCancelShipment}
                disabled={!cancelReason.trim() || processing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow font-bold disabled:opacity-50"
              >
                {processing ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}