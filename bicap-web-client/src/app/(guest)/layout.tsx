"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth"; // 1. Import hàm đăng xuất
import { auth } from "@/lib/firebase";   // 2. Import biến auth (Kiểm tra lại đường dẫn này trong máy bạn nhé!)

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // --- HÀM ĐĂNG XUẤT SẠCH SÀNH SANH ---
  const handleLogout = async () => {
    try {
        // 1. Cắt đứt kết nối với Firebase (Quan trọng nhất)
        await signOut(auth);
        
        // 2. Xóa sạch bộ nhớ trình duyệt (localStorage, sessionStorage)
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
        }

        // 3. Ép trình duyệt tải lại và về trang Login
        // Dùng window.location.href để đảm bảo nó reload lại từ đầu, không lưu cache cũ
        window.location.href = "/login";
        
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        // Dù lỗi cũng ép về login
        window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => router.push('/')}>
            🌱 BICAP Guest
          </div>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/market" className="hover:text-green-200 transition flex items-center gap-1">
              🛒 Chợ nông sản
            </Link>
            <Link href="/guest/education" className="hover:text-green-200 transition flex items-center gap-1">
              📚 Kiến thức
            </Link>

            {/* Nút Đăng Xuất */}
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition shadow-sm font-bold"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        {children}
      </main>
    </div>
  );
}