"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext'; // Import useAuth
// import { auth } from '@/lib/firebase'; // Không cần import trực tiếp nữa nếu dùng Context (hoặc giữ lại nếu cần)

// Định nghĩa kiểu dữ liệu Tài xế (Cập nhật để khớp với Backend mới)
interface Driver {
  id: string | number;
  realId?: number;
  type?: 'driver' | 'unassigned_vehicle';
  name: string;
  vehicle: string;
  plate: string;
  status: string;
  phone?: string;
  current_job?: string | number; // ID đơn hàng đang chạy (nếu có)
}

export default function DriversPage() {
  const { getAccessToken, loading: authLoading } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const [processing, setProcessing] = useState(false);

  const fetchDrivers = async () => {
    try {
      const token = await getAccessToken();
      const response = await fetch("http://localhost:5001/api/drivers", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        setDrivers([]);
        return;
      }
      const rawData = await response.json();
      setDrivers(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Lỗi tải danh sách tài xế:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchDrivers();
  }, [authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const token = await getAccessToken();
      const url = editingDriver
        ? `http://localhost:5001/api/drivers/${editingDriver.realId}`
        : "http://localhost:5001/api/drivers";

      const res = await fetch(url, {
        method: editingDriver ? "PUT" : "POST",
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

      alert(editingDriver ? "Cập nhật thành công!" : "Tạo tài xế thành công!");
      handleCloseModal();
      fetchDrivers();
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (realId: number | undefined) => {
    if (!realId || !confirm("Bạn có chắc muốn xóa tài xế này?")) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`http://localhost:5001/api/drivers/${realId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Đã xóa tài xế");
        fetchDrivers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      fullName: driver.name,
      email: "", // Không sửa email hoặc lấy từ backend nếu cần
      phone: driver.phone || "",
      address: "",
      password: ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
    setFormData({ fullName: "", email: "", phone: "", address: "", password: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🚚 Đội xe & Tài xế
          </h2>
          <p className="text-sm text-gray-500 mt-1">Giám sát và quản lý nhân sự vận chuyển</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
        >
          ➕ Thêm tài xế
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-inner
                ${driver.type === 'unassigned_vehicle' ? 'bg-orange-50' : 'bg-gray-100'}`}>
                {driver.type === 'unassigned_vehicle' ? '🚛' : '🧑‍✈️'}
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg ${driver.type === 'unassigned_vehicle' ? 'text-orange-700' : 'text-gray-800'}`}>
                  {driver.name}
                </h3>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>🚛 <span className="font-medium text-gray-700">{driver.vehicle}</span></p>
                  <p>🔢 <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono font-bold">{driver.plate}</span></p>
                  {driver.phone && driver.phone !== "---" && <p>📞 {driver.phone}</p>}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold
                ${driver.status === 'Bận' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {driver.type === 'unassigned_vehicle' ? 'Chờ gán' : driver.status}
              </span>

              {driver.type === 'driver' && (
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(driver)} className="text-blue-500 hover:text-blue-700 text-sm">Sửa</button>
                  <button onClick={() => handleDelete(driver.realId)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CRUD DRIVER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingDriver ? "Cập nhật tài xế" : "Thêm tài xế mới"}</h3>
              <button onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ tên *</label>
                <input required className="w-full border rounded-lg p-2" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              {!editingDriver && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" required className="w-full border rounded-lg p-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu (mặc định: 123456)</label>
                    <input type="password" placeholder="123456" className="w-full border rounded-lg p-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input className="w-full border rounded-lg p-2" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                <input className="w-full border rounded-lg p-2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                  {processing ? "Đang xử lý..." : "Lưu thông tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}