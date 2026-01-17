"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DriverPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    // const role = Cookies.get("role"); // Tạm thời bỏ check role chặt chẽ để test cho dễ

    if (!token) {
      // 👇 SỬA Ở ĐÂY: Thêm ?role=driver để trang Login tự chọn vai trò
      router.push("/login?role=driver");
    } else {
      router.push("/driver/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Đang điều hướng...</p>
      </div>
    </div>
  );
}