"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ShipmentsPage() {
  const { getAccessToken, loading: authLoading } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // For QR Modal

  // States for Assign Driver Modal
  const [assigningShipment, setAssigningShipment] = useState<any>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [processing, setProcessing] = useState(false);

  // States for Cancel
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        console.error("Không có token, vui lòng đăng nhập lại");
        throw new Error("Không có token xác thực");
      }

      // 1. Fetch Shipments
      const resShipments = await fetch("http://localhost:5001/api/shipments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!resShipments.ok) {
        const errorData = await resShipments.json().catch(() => ({ message: 'Lỗi không xác định' }));
        console.error("API Error:", resShipments.status, errorData);
        throw new Error(errorData.message || "Lỗi tải vận đơn");
      }
      const data = await resShipments.json();

      // 2. Fetch Drivers
      const resDrivers = await fetch("http://localhost:5001/api/drivers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataDrivers = await resDrivers.json();
      if (Array.isArray(dataDrivers)) setDrivers(dataDrivers);

      // --- MAPPING QUAN TRỌNG: Chuyển đổi dữ liệu Backend -> Frontend ---
      const mappedData = data.map((item: any) => ({
        id: item.id || item.trackingNumber,
        diemDi: item.diemDi || item.pickupLocation || "Kho không xác định",
        diemDen: item.diemDen || item.deliveryLocation || "Khách không xác định",
        taiXe: item.taiXe || item.driver?.fullName || "Chưa phân công",
        status: item.status === 'assigned' ? 'Đã gán tài xế'
          : item.status === 'shipping' ? 'Đang vận chuyển'
            : item.status === 'delivered' ? 'Hoàn thành'
              : item.status === 'created' ? 'Chờ lấy hàng'
                : item.status === 'pending_pickup' ? 'Chờ lấy hàng'
                  : item.status === 'cancelled' ? 'Đã hủy'
                    : item.status,
        rawStatus: item.status,
        details: {
          qrCode: item.pickupQRCode || `SHIPMENT_${item.id}`,
          vehicle: item.vehicleInfo || "Xe tải",
          type: "Hàng hóa"
        }
      }));

      setShipments(mappedData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
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
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống");
    } finally {
      setProcessing(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!assigningShipment || !selectedDriverId) return;

    try {
      setProcessing(true);
      const token = await getAccessToken();

      const res = await fetch(`http://localhost:5001/api/shipments/${assigningShipment.id}/assign-driver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          driverId: selectedDriverId,
          vehicleInfo: vehicleInfo || "Xe tải tiêu chuẩn"
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Lỗi gán tài xế");
        return;
      }

      alert("🎉 Đã gán tài xế thành công!");
      setAssigningShipment(null);
      setSelectedDriverId("");
      setVehicleInfo("");
      fetchData(); // Reload list

    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("đang") || s.includes("shipping") || s.includes("gán")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("chờ") || s.includes("created")) return "bg-orange-100 text-orange-700 border-orange-200";
    if (s.includes("hoàn") || s.includes("delivered")) return "bg-green-100 text-green-700 border-green-200";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) return <div className="p-10 text-center">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📦 Quản lý Đội Xe & Vận Đơn
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-xs font-bold uppercase border-b bg-gray-50">
                <th className="py-4 px-4">Mã vận đơn</th>
                <th className="py-4 px-4">Điểm đi</th>
                <th className="py-4 px-4">Điểm đến</th>
                <th className="py-4 px-4">Tài xế</th>
                <th className="py-4 px-4 text-center">Trạng thái</th>
                <th className="py-4 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shipments.map((order, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition">
                  <td className="py-4 px-4 font-bold text-blue-600">#{order.id}</td>
                  <td className="py-4 px-4 text-gray-700">{order.diemDi}</td>
                  <td className="py-4 px-4 text-gray-700">{order.diemDen}</td>
                  <td className="py-4 px-4 font-medium text-gray-800">
                    {order.taiXe === "Chưa phân công" ? (
                      <span className="text-red-500 italic">Chưa phân công</span>
                    ) : order.taiXe}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center flex items-center justify-center gap-2">
                    {order.rawStatus === 'created' || order.rawStatus === 'pending_pickup' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAssigningShipment(order)}
                          className="bg-orange-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-orange-600 shadow-sm transition"
                        >
                          🚚 Gán tài xế
                        </button>
                        <button
                          onClick={() => setCancelTarget(order)}
                          className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-100 border border-red-200 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : null}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 shadow-sm transition"
                    >
                      Xem & Quét QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && (
            <div className="text-center py-10 text-gray-400">Chưa có đơn hàng nào</div>
          )}
        </div>
      </div>

      {/* MODAL GÁN TÀI XẾ */}
      {assigningShipment && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Gán tài xế cho vận đơn #{assigningShipment.id}</h3>
              <button onClick={() => setAssigningShipment(null)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Tài xế</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">-- Chọn tài xế --</option>
                  {drivers
                    .filter(d => d.type === 'driver')
                    .map(d => (
                      <option key={d.id} value={d.realId || d.id}>
                        {d.fullName || d.name} - {d.status === 'Bận' ? '(Đang bận)' : '(Sẵn sàng)'}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin phương tiện</label>
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
                onClick={() => setAssigningShipment(null)}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAssignDriver}
                disabled={processing || !selectedDriverId}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {processing ? <span className="animate-spin">⏳</span> : "✅ Xác nhận Gán"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QR CODE */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center text-white">
              <h3 className="font-bold text-lg">Mã Vận Đơn: #{selectedOrder.id}</h3>
              <p className="text-blue-100 text-sm opacity-90">Quét mã để cập nhật trạng thái</p>
            </div>

            <div className="p-8 flex flex-col items-center gap-6">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedOrder.details?.qrCode}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-500">Tài xế:</span>
                  <span className="font-bold text-gray-800">{selectedOrder.taiXe}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-500">Xe vận chuyển:</span>
                  <span className="font-bold text-gray-800">{selectedOrder.details?.vehicle}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={() => setSelectedOrder(null)} className="py-3 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Đóng</button>
                <button className="py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                  📸 Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HỦY ĐƠN */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
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