```
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-gray-900">
      <h1 className="text-4xl font-bold text-green-800 mb-4">
        BICAP: Nông Sản Sạch & Blockchain
      </h1>
      <p className="text-gray-600 mb-8 max-w-xl text-center">
        Hệ thống truy xuất nguồn gốc nông sản ứng dụng công nghệ Blockchain.
        Minh bạch từ nông trại đến bàn ăn.
      </p>
      
      <div className="space-x-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
        >
          Đăng Nhập Hệ Thống
        </Link>
        <Link 
          href="/guest" 
          className="px-6 py-3 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
        >
          Tra cứu sản phẩm
        </Link>
      </div>
    </div>
  );
}