"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestDashboard() {
  const [lotCode, setLotCode] = useState("");
  const router = useRouter();

  const handleTrace = () => {
    if (!lotCode.trim()) return alert("Vui lòng nhập mã lô hàng!");
    // Chuyển hướng đến trang truy xuất (sẽ làm sau)
    alert(`Đang truy xuất mã: ${lotCode} (Chức năng này sẽ hiển thị nhật ký blockchain)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* BANNER */}
      <div className="bg-white py-16 text-center shadow-sm">
        <h1 className="text-4xl font-extrabold text-green-800 mb-4">Chào mừng đến với BICAP</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Hệ thống nông nghiệp sạch & minh bạch nguồn gốc hàng đầu Việt Nam. 
          Kết nối trực tiếp từ nông trại đến bàn ăn.
        </p>
      </div>

      {/* MAIN CONTENT - 3 CHỨC NĂNG CHÍNH */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* CARD 1: CHỢ NÔNG SẢN (Yêu cầu 6.2) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center border border-gray-100">
            <div className="text-5xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Chợ Nông Sản</h3>
            <p className="text-gray-500 mb-8">
              Tìm kiếm nông sản sạch, xem giá và thông tin nhà cung cấp uy tín.
              Hỗ trợ lọc theo tiêu chuẩn VietGAP, GlobalGAP.
            </p>
            <Link href="/market" className="text-green-600 font-bold hover:underline flex justify-center items-center gap-2">
              Truy cập ngay <span>→</span>
            </Link>
          </div>

          {/* CARD 2: TRUY XUẤT (Yêu cầu 6.3 - Blockchain) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center border border-gray-100">
            <div className="text-5xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Truy xuất nguồn gốc</h3>
            <p className="text-gray-500 mb-6">
              Nhập mã lô hàng để xem nhật ký gieo trồng, bón phân được lưu trên Blockchain.
            </p>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Ví dụ: LOHANG-001" 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
              />
              <button 
                onClick={handleTrace}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
              >
                Kiểm tra Blockchain
              </button>
            </div>
          </div>

          {/* CARD 3: KIẾN THỨC (Yêu cầu 6.1) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center border border-gray-100">
            <div className="text-5xl mb-6">📖</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Kiến thức nhà nông</h3>
            <p className="text-gray-500 mb-8">
              Bài viết, video hướng dẫn canh tác và tiêu chuẩn an toàn. 
              Cập nhật tin tức nông nghiệp mới nhất.
            </p>
            <Link href="/guest/education" className="text-green-600 font-bold hover:underline flex justify-center items-center gap-2">
              Xem thư viện <span>→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}