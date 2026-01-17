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
  status: "ASSIGNED" | "IN_TRANSIT" | "DELIVERED";
  product_name: string;
  quantity: string;
  note?: string;
}

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State dữ liệu
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  
  // State giao diện & Profile
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'NONE' | 'SETTINGS' | 'SUPPORT'>('NONE');
  const profileRef = useRef<HTMLDivElement>(null);
  
  // State tên hiển thị (Để sửa xong là hiện ngay)
  const [localName, setLocalName] = useState("");
  const [inputName, setInputName] = useState(""); // Dùng cho input trong modal

  // ================= 1. LOGIC TÊN THÔNG MINH (FIX CÁI NEW USER) =================
  useEffect(() => {
    if (user) {
        // Nếu tên là "New User" hoặc rỗng -> Lấy phần đầu email (vd: nam)
        // Nếu có tên xịn (vd: Lượng) -> Dùng tên xịn
        if (!user.fullName || user.fullName === "New User") {
            const emailName = user.email?.split('@')[0] || "Tài xế";
            // Viết hoa chữ cái đầu cho đẹp (nam -> Nam)
            setLocalName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        } else {
            setLocalName(user.fullName);
        }
    }
  }, [user]);

  // ================= 2. GỌI API LẤY DỮ LIỆU =================
  const fetchShipments = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/driver/shipments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.success) {
        setShipments(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi data:", error);
      const cached = localStorage.getItem("shipments");
      if (cached) setShipments(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token && !user) {
       router.push("/login?role=driver");
       return;
    }
    fetchShipments();

    function handleClickOutside(event: any) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  // ================= 3. CÁC HÀM XỬ LÝ =================
  const updateShipmentStatus = async (id: string, newStatus: string) => {
    try {
      const token = Cookies.get("token");
      await axios.put(`${API_URL}/driver/shipments/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShipments(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus as any } : item
      ));
      return true;
    } catch (error) {
      alert("⚠️ Không thể đồng bộ với Server. Kiểm tra mạng!");
      return false;
    }
  };

  const handleLogout = async () => {
    if (confirm("🚪 Bạn chắc chắn muốn đăng xuất?")) {
      if (logout) await logout();
      Cookies.remove("token");
      Cookies.remove("role");
      window.location.href = "/";
    }
  };

  const handleScan = async (results: any) => {
    if (results && results.length > 0) {
      const scannedCode = results[0].rawValue;
      if (selectedShipment) {
        if (scannedCode === selectedShipment.code || scannedCode === selectedShipment.id) {
            setIsScanning(false);
            const success = await updateShipmentStatus(selectedShipment.id, "IN_TRANSIT");
            if (success) {
                alert(`✅ Đã nhận đơn: ${scannedCode}`);
                setSelectedShipment(null);
            }
        } else {
            alert(`⚠️ Sai mã đơn!\nĐang quét: ${scannedCode}\nĐơn cần lấy: ${selectedShipment.code}`);
        }
      }
    }
  };

  const handleConfirmDelivery = async (shipment: Shipment) => {
    if (confirm(`✅ Xác nhận đã giao xong đơn ${shipment.code}?`)) {
       const success = await updateShipmentStatus(shipment.id, "DELIVERED");
       if (success) setSelectedShipment(null);
    }
  };

  const handleOpenMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  // Hàm Lưu Tên Mới (Chạy ngay lập tức ở phía Client)
  const handleSaveProfile = () => {
     if(inputName.trim()) {
        setLocalName(inputName); // Cập nhật ngay lập tức
        // Ở đây bạn có thể gọi API update profile nếu muốn
        alert("✅ Đã cập nhật tên thành công!");
        setActiveModal('NONE');
     }
  };

  // Helper UI
  const getStatusColor = (status: string) => {
    if (status === 'ASSIGNED') return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === 'IN_TRANSIT') return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };
  const getStatusLabel = (status: string) => {
    if (status === 'ASSIGNED') return "Chờ lấy hàng";
    if (status === 'IN_TRANSIT') return "Đang giao";
    return "Đã giao hàng";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 pb-24 pt-6 px-6 shadow-lg rounded-b-[2.5rem] relative z-20">
        <div className="flex justify-between items-start text-white max-w-6xl mx-auto">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mt-2">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 text-xl font-bold">B</div>
             <div>
                <h1 className="text-xl font-bold tracking-tight">BICAP<span className="font-light opacity-80">Driver</span></h1>
             </div>
          </div>
          
          {/* PROFILE MENU */}
          <div className="relative" ref={profileRef}>
             <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all border border-white/10"
             >
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-green-100 opacity-80">Tài khoản</p>
                    {/* 👇 SỬ DỤNG localName ĐÃ ĐƯỢC XỬ LÝ */}
                    <p className="text-sm font-bold truncate max-w-[150px]">{localName || "Tài xế"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg border-2 border-green-200 shadow-sm uppercase">
                    {localName ? localName.charAt(0) : "T"}
                </div>
             </button>

             {/* MENU DROPDOWN */}
             {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-up origin-top-right z-50">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        {/* 👇 Tên trong Menu */}
                        <p className="text-base font-bold text-gray-800">{localName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                            {user?.role || "DRIVER"}
                        </span>
                    </div>
                    <div className="p-2 space-y-1">
                        <button 
                            onClick={() => { 
                                setShowProfileMenu(false); 
                                setInputName(localName); // Điền sẵn tên cũ vào input
                                setActiveModal('SETTINGS'); 
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-medium flex items-center gap-3 transition-colors"
                        >
                            ⚙️ Cài đặt tài khoản
                        </button>
                        <button 
                            onClick={() => { setShowProfileMenu(false); setActiveModal('SUPPORT'); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-medium flex items-center gap-3 transition-colors"
                        >
                            📞 Trung tâm hỗ trợ
                        </button>
                    </div>
                    <div className="p-2 border-t border-gray-100 mt-1">
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center gap-3 transition-colors"
                        >
                            🚪 Đăng xuất
                        </button>
                    </div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* ================= NỘI DUNG CHÍNH ================= */}
      <div className="px-4 max-w-6xl mx-auto -mt-14 relative z-10">
        {/* Thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-green-50 flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600 w-12 text-center">{shipments.filter(s => s.status === 'ASSIGNED').length}</span>
            <div className="h-8 w-px bg-gray-200"></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Cần lấy hàng</p><p className="text-gray-600 text-sm">Tại kho/vườn</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-green-50 flex items-center gap-4">
            <span className="text-3xl font-bold text-orange-500 w-12 text-center">{shipments.filter(s => s.status === 'IN_TRANSIT').length}</span>
             <div className="h-8 w-px bg-gray-200"></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Đang giao</p><p className="text-gray-600 text-sm">Trên đường đi</p></div>
          </div>
           <div className="bg-white p-5 rounded-2xl shadow-lg border border-green-50 flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600 w-12 text-center">{shipments.filter(s => s.status === 'DELIVERED').length}</span>
             <div className="h-8 w-px bg-gray-200"></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Hoàn thành</p><p className="text-gray-600 text-sm">Đã giao xong</p></div>
          </div>
        </div>

        {/* Danh sách */}
        <div>
           <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">📦 Danh sách vận đơn</h3>
              <button onClick={fetchShipments} className="text-xs font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors">🔄 Làm mới</button>
           </div>

           <div className="space-y-4">
             {loading ? (
                <div className="py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div><p className="text-gray-400">Đang đồng bộ dữ liệu...</p></div>
             ) : shipments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center shadow-sm border border-gray-100"><p className="text-gray-500">📭 Hiện chưa có đơn hàng nào.</p></div>
             ) : shipments.map((item) => (
               <div
                 key={item.id}
                 onClick={() => { setSelectedShipment(item); setIsScanning(false); }}
                 className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group relative overflow-hidden"
               >
                 <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'ASSIGNED' ? 'bg-blue-500' : item.status === 'IN_TRANSIT' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                 <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">{item.code}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">📦</div>
                        <div><p className="font-bold text-gray-700">{item.product_name}</p><p className="text-xs text-gray-500">Khối lượng: {item.quantity}</p></div>
                    </div>
                    <div className="pt-3 mt-2 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Nơi lấy</p><p className="text-sm text-gray-600 line-clamp-1">{item.sender_address}</p></div>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Nơi giao</p><p className="text-sm text-gray-600 line-clamp-1">{item.receiver_address}</p></div>
                        </div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* ================= MODAL ĐƠN HÀNG ================= */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                <h3 className="text-lg font-bold text-gray-800">Chi tiết đơn hàng</h3>
                <button onClick={() => setSelectedShipment(null)} className="w-8 h-8 rounded-full bg-white border hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-colors">✕</button>
            </div>
            <div className="p-6">
                {isScanning ? (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-600 mb-4 font-medium text-center">Vui lòng quét mã QR của đơn: <span className="font-bold text-black">{selectedShipment.code}</span></p>
                    <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden border-4 border-green-500 relative shadow-2xl">
                      <Scanner onScan={handleScan} onError={(error) => console.log(error)} />
                      <div className="absolute inset-0 m-12 border-2 border-white/50 rounded-lg pointer-events-none"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse"></div>
                    </div>
                    <button onClick={() => setIsScanning(false)} className="mt-6 py-2 px-6 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors">Hủy quét</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                     <div className="text-center">
                        <h2 className="text-3xl font-black text-gray-800 mb-2">{selectedShipment.code}</h2>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(selectedShipment.status)}`}>{getStatusLabel(selectedShipment.status)}</span>
                     </div>
                     <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <div className="flex justify-between items-center mb-1"><span className="text-blue-700 font-bold text-lg">{selectedShipment.product_name}</span></div>
                        <p className="text-blue-600/80 font-medium">Số lượng: {selectedShipment.quantity}</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div><div className="w-0.5 h-full bg-gray-300"></div><div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Điểm lấy hàng</p><p className="text-gray-800 font-semibold">{selectedShipment.sender_address}</p></div>
                                <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Điểm giao hàng</p><p className="text-gray-800 font-semibold">{selectedShipment.receiver_address}</p></div>
                            </div>
                        </div>
                     </div>
                     <div className="pt-2">
                        {selectedShipment.status === 'ASSIGNED' && (
                            <button onClick={() => setIsScanning(true)} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-transform active:scale-95 flex items-center justify-center gap-2">📷 Bắt đầu quét mã QR</button>
                        )}
                        {selectedShipment.status === 'IN_TRANSIT' && (
                            <div className="flex gap-3">
                                <button onClick={() => handleOpenMap(selectedShipment.receiver_address)} className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">📍 Bản đồ</button>
                                <button onClick={() => handleConfirmDelivery(selectedShipment)} className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-transform active:scale-95">✅ Xác nhận đã giao</button>
                            </div>
                        )}
                        {selectedShipment.status === 'DELIVERED' && (
                             <div className="w-full py-4 bg-gray-50 text-green-600 rounded-xl font-bold text-center border-2 border-green-100 flex items-center justify-center gap-2"><span>🎉</span> Đơn hàng đã hoàn tất</div>
                        )}
                     </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CÀI ĐẶT TÀI KHOẢN (ĐỔI ĐƯỢC TÊN) ================= */}
      {activeModal === 'SETTINGS' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                <button onClick={() => setActiveModal('NONE')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold">✕</button>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">⚙️ Cài đặt tài khoản</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        {/* 👇 INPUT NÀY CHO PHÉP SỬA TÊN */}
                        <input 
                            type="text" 
                            value={inputName} 
                            onChange={(e) => setInputName(e.target.value)} 
                            className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                            placeholder="Nhập tên hiển thị..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="text" value={user?.email || "driver@gmail.com"} disabled className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SĐT Liên hệ</label>
                        <input type="text" defaultValue="0909 123 456" className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                        <input type="text" defaultValue="59-X1 123.45" className="w-full p-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                    </div>
                    
                    {/* 👇 NÚT LƯU THAY ĐỔI */}
                    <button 
                        onClick={handleSaveProfile} 
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors mt-2 shadow-lg shadow-green-200"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ================= MODAL HỖ TRỢ ================= */}
      {activeModal === 'SUPPORT' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative text-center">
                <button onClick={() => setActiveModal('NONE')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold">✕</button>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Trung tâm hỗ trợ</h3>
                <p className="text-gray-500 text-sm mb-6">Bạn cần hỗ trợ về đơn hàng hoặc ứng dụng? Hãy liên hệ ngay.</p>
                
                <div className="space-y-3">
                    <a href="tel:19001234" className="block w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                        Gọi Hotline 1900 1234
                    </a>
                    <a href="mailto:support@bicap.vn" className="block w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200">
                        Gửi Email Hỗ Trợ
                    </a>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}