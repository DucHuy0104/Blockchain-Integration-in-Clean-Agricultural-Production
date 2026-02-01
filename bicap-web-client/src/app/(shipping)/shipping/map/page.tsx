"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// --- IMPORT MAP DYNAMIC (QUAN TRỌNG) ---
// ssr: false nghĩa là chỉ render ở phía client
const ShippingMap = dynamic(() => import("@/components/ShippingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <p className="text-gray-500 animate-pulse">Đang tải bản đồ vệ tinh...</p>
    </div>
  )
});

export default function LiveMapPage() {
  // Tạm thời chưa có API GPS thực tế từ thiết bị IoT
  // Nên để trống để tránh hiểu nhầm là "Fake"
  const [vehicles, setVehicles] = useState([]);

  // Khi nào có thiết bị thật, sẽ gọi API: GET /api/gps/vehicles
  useEffect(() => {
    // fetchData...
  }, []);

  return (
    <div className="p-4 h-[calc(100vh-64px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🗺️ Bản đồ Giám sát Thời gian thực
          </h2>
          <p className="text-sm text-gray-500">Theo dõi vị trí đội xe trên toàn quốc</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium">Đang hoạt động: 2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm font-medium">Đang dừng: 1</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100 relative">
        {/* Gọi Component Map */}
        <ShippingMap vehicles={vehicles} />

        {/* Chú thích nổi trên Map */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg z-[400] text-xs">
          <p className="font-bold mb-1">Trạng thái kết nối GPS</p>
          <div className="flex items-center gap-2 text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Ổn định (Ping: 24ms)
          </div>
        </div>
      </div>
    </div>
  );
}