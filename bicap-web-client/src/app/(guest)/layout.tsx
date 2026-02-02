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
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Enhanced */}
      <header className="bg-gradient-to-r from-[#388E3C] to-[#7CB342] text-white p-4 shadow-xl sticky top-0 z-50 border-b border-green-700/30">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-3 font-extrabold text-xl cursor-pointer hover:opacity-90 transition-opacity" onClick={() => router.push('/')}>
            <span className="text-2xl">🌱</span>
            <span className="hidden sm:inline">BICAP Guest</span>
          </div>

          <nav className="flex items-center space-x-4 text-sm font-bold">
            <Link href="/market" className="hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm">
              <span>🛒</span>
              <span className="hidden sm:inline">Chợ nông sản</span>
            </Link>
            <Link href="/guest/education" className="hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm">
              <span>📚</span>
              <span className="hidden sm:inline">Kiến thức</span>
            </Link>
            <Link href="/guest" className="hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm">
              <span>🔍</span>
              <span className="hidden sm:inline">Truy xuất</span>
            </Link>

            {/* Nút Đăng Xuất */}
            <button
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all shadow-md font-bold flex items-center gap-2 border border-white/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}